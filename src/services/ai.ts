import { GoogleGenAI } from "@google/genai";
import { generateStructuredResponse } from "../../services/openRouterService";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Supported languages from localization.ts
// 'en' is source, others are targets
const TARGET_LANGUAGES = ['de', 'es', 'fr', 'nl'];

interface TranslationRequest {
    [key: string]: string;
}

interface TranslationResponse {
    [key: string]: {
        [lang: string]: string;
    };
}

export const translateContent = async (
    content: TranslationRequest
): Promise<TranslationResponse> => {
    const prompt = `
    STRICT JSON OUTPUT ONLY. NO CONVERSATIONAL TEXT.
    Translated the values in the provided JSON object from English (en) to: ${TARGET_LANGUAGES.join(', ')}.
    
    Input JSON:
    ${JSON.stringify(content, null, 2)}
    
    RULES:
    1. Return ONLY valid JSON.
    2. Do NOT add any explanations or text before/after the JSON.
    3. Maintain the exact same keys as the input.
    4. Each key's value must be an object with keys: ${TARGET_LANGUAGES.join(', ')}.
    5. PRESERVE URLs, file paths, IDs, and technical strings EXACTLY as is. Do not translate them.
    
    Example Output:
    {
        "key1": { "de": "...", "es": "...", "fr": "...", "nl": "..." }
    }
    `;

    try {
        if (!API_KEY) {
            throw new Error("Missing VITE_GEMINI_API_KEY in environment variables");
        }

        const genAI = new GoogleGenAI({ apiKey: API_KEY });
        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        });

        // The new SDK likely returns the response directly or in a specific format.
        // Assuming result.response.text() exists or similar. 
        // If not, we might need to adjust based on type feedback.
        // Valid for Google GenAI SDK (candidates array)
        const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
            console.error("AI Response:", result);
            throw new Error("No translation response received from AI.");
        }

        // Clean up markdown code blocks if present (just in case)
        const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
        const translations: TranslationResponse = JSON.parse(cleanJson);
        return translations;

    } catch (error) {
        console.warn("Gemini translation failed, falling back to OpenRouter:", error);

        // Fallback to OpenRouter
        try {
            const result = await generateStructuredResponse<TranslationResponse>(prompt);
            return result;
        } catch (fallbackError) {
            console.error("OpenRouter fallback also failed:", fallbackError);
            throw fallbackError;
        }
    }
};

