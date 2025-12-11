/**
 * OpenRouter Service - Fallback AI service when Gemini fails
 * Uses OpenAI-compatible API with model: openai/gpt-oss-20b:free
 */

import { db } from '../src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY2 || process.env.OPENROUTER_API_KEY2;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-20b:free';

// Cache the model to avoid excessive DB reads
let cachedModel: string | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getOpenRouterModel = async (): Promise<string> => {
    // Return cached model if valid
    if (cachedModel && (Date.now() - lastFetchTime < CACHE_DURATION)) {
        return cachedModel;
    }

    try {
        const docRef = doc(db, 'site_settings', 'main');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.aiConfig?.openRouterModel) {
                cachedModel = data.aiConfig.openRouterModel;
                lastFetchTime = Date.now();
                return cachedModel || DEFAULT_MODEL;
            }
        }
    } catch (error) {
        console.warn('Failed to fetch OpenRouter model config, using default:', error);
    }

    return DEFAULT_MODEL;
};

interface OpenRouterMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface OpenRouterRequest {
    model: string;
    messages: OpenRouterMessage[];
    temperature?: number;
    max_tokens?: number;
    response_format?: { type: 'json_object' };
    stream?: boolean;
}

interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
            reasoning?: string;
        };
        finish_reason: string;
    }>;
}

/**
 * Call OpenRouter API for chat completions
 */
export const callOpenRouter = async (
    prompt: string,
    systemInstruction?: string,
    options?: {
        temperature?: number;
        maxTokens?: number;
        jsonMode?: boolean;
        model?: string;
    }
): Promise<string> => {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY2 not found in environment variables');
    }

    // Use provided model or fetch from config
    const modelToUse = options?.model || await getOpenRouterModel();
    console.log(`Using OpenRouter model: ${modelToUse} ${options?.jsonMode ? '(JSON Mode)' : ''}`);

    const messages: OpenRouterMessage[] = [];

    if (systemInstruction) {
        messages.push({
            role: 'system',
            content: systemInstruction
        });
    }

    messages.push({
        role: 'user',
        content: prompt
    });

    const requestBody: OpenRouterRequest = {
        model: modelToUse,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
    };

    if (options?.jsonMode) {
        requestBody.response_format = { type: 'json_object' };
    }

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'GrowBrandi',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data: OpenRouterResponse = await response.json();

        // Check if message exists and has content (allow empty string if it's just a length stop)
        if (!data.choices || !data.choices[0]?.message) {
            console.error('Raw OpenRouter Response:', JSON.stringify(data, null, 2));
            throw new Error('Invalid response structure from OpenRouter API');
        }

        const choice = data.choices[0];
        const content = choice.message.content || '';

        // If content is empty but we have a finish_reason of length, it might be truncated
        if (!content && choice.finish_reason === 'length') {
            return "Response truncated (max tokens reached). Connection successful.";
        }

        if (!content && !choice.message.reasoning) {
            // Allow if there is reasoning (some thinking models), otherwise error
            // actually for our interface we usually need content. 
            // But let's be lenient for connection tests if possible, or strict if prompt dependency.
            // For now, if truly empty and no length issue, might be an error.
            if (content === '') return ""; // Return empty string instead of throwing, let UI handle it
        }

        return content;
    } catch (error) {
        console.error('OpenRouter API call failed:', error);
        throw error;
    }
};

/**
 * Stream chat responses from OpenRouter
 */
export async function* streamOpenRouter(
    message: string,
    systemInstruction?: string
): AsyncGenerator<{ text: string }, void, unknown> {
    if (!OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY2 not found in environment variables');
    }

    const modelToUse = await getOpenRouterModel();
    console.log(`Streaming with OpenRouter model: ${modelToUse}`);

    const messages: OpenRouterMessage[] = [];

    if (systemInstruction) {
        messages.push({
            role: 'system',
            content: systemInstruction
        });
    }

    messages.push({
        role: 'user',
        content: message
    });

    const requestBody: OpenRouterRequest = {
        model: modelToUse,
        messages,
        temperature: 0.7,
        stream: true,
    };

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'GrowBrandi',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('No response body available');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

                if (trimmedLine.startsWith('data: ')) {
                    try {
                        const jsonStr = trimmedLine.slice(6);
                        const data = JSON.parse(jsonStr);
                        const content = data.choices?.[0]?.delta?.content;

                        if (content) {
                            yield { text: content };
                        }
                    } catch (e) {
                        console.warn('Failed to parse streaming chunk:', e);
                    }
                }
            }
        }
    } catch (error) {
        console.error('OpenRouter streaming failed:', error);
        throw error;
    }
}

/**
 * Generate structured JSON response using OpenRouter
 */
export const generateStructuredResponse = async <T = any>(
    prompt: string,
    systemInstruction?: string,
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
): Promise<T> => {
    const response = await callOpenRouter(prompt, systemInstruction, {
        ...options,
        jsonMode: true,
    });

    // Improve JSON extraction for chatty models
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    let cleanJson = response;

    if (jsonMatch) {
        cleanJson = jsonMatch[0];
    }

    // Clean up any markdown code blocks if present
    cleanJson = cleanJson.replace(/```json\n?|\n?```/g, '').trim();

    try {
        return JSON.parse(cleanJson) as T;
    } catch (error) {
        console.error('Failed to parse OpenRouter JSON response:', error);
        console.error('Raw response content:', response);
        console.error('Attempted valid JSON:', cleanJson);
        throw new Error('Failed to parse structured response from OpenRouter');
    }
};
