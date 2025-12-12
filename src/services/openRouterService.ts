import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

interface OpenRouterOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
}

/**
 * Calls the OpenRouter API with the given prompt and system instruction.
 * Falls back to settings in Firestore if model is not provided.
 */
export const callOpenRouter = async (
    prompt: string,
    systemInstruction?: string,
    options: OpenRouterOptions = {}
) => {
    try {
        // 1. Get Configuration (Model)
        let model = options.model;
        if (!model) {
            // Fetch default from Firestore if not provided
            try {
                const settingsRef = doc(db, 'site_settings', 'main');
                const settingsSnap = await getDoc(settingsRef);
                if (settingsSnap.exists()) {
                    model = settingsSnap.data().aiConfig?.openRouterModel;
                }
            } catch (e) {
                console.warn("Failed to fetch AI settings, using default.");
            }
        }

        // Default model if still null
        model = model || "openai/gpt-3.5-turbo"; // Safe fallback

        // 2. Prepare Messages
        const messages = [];
        if (systemInstruction) {
            messages.push({ role: "system", content: systemInstruction });
        }
        messages.push({ role: "user", content: prompt });

        // 3. Make Request
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": window.location.origin, // Required by OpenRouter
                "X-Title": "GrowBrandAI Admin", // Optional
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: options.maxTokens || 1000,
                temperature: options.temperature || 0.7,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";

    } catch (error) {
        console.error("OpenRouter Call Failed:", error);
        throw error;
    }
};

/**
 * Generates a structured JSON response using OpenRouter.
 * Enforces JSON mode via prompt engineering if model doesn't support it natively.
 */
export const generateStructuredResponse = async <T>(
    prompt: string,
    systemInstruction: string = "You are a helpful JSON generator."
): Promise<T> => {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown formatting.`;

    const responseText = await callOpenRouter(jsonPrompt, systemInstruction);

    try {
        // Clean markdown code blocks if present
        const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
        return JSON.parse(cleanJson) as T;
    } catch (e) {
        console.error("Failed to parse JSON from OpenRouter response:", responseText);
        throw new Error("AI response was not valid JSON");
    }
};
