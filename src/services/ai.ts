import { GoogleGenAI } from "@google/genai";

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
    if (!API_KEY) {
        throw new Error("Missing VITE_GEMINI_API_KEY in environment variables");
    }

    const genAI = new GoogleGenAI({ apiKey: API_KEY });

    try {

        const prompt = `
        You are a professional translator. 
        Translate the following JSON object's values from English (en) to the following languages: ${TARGET_LANGUAGES.join(', ')}.
        
        Input JSON:
        ${JSON.stringify(content, null, 2)}
        
        Output MUST be valid JSON with the exact same keys as the input.
        For each key, the value must be an object containing the translations for each target language.
        
        Example Output Format:
        {
            "someKey": {
                "de": "German Translation",
                "es": "Spanish Translation",
                "fr": "French Translation",
                "nl": "Dutch Translation"
            }
        }

        Do not include markdown code block formatting in your response, just the raw JSON string.
        `;

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
        console.error("AI Translation Error:", error);
        throw error;
    }
};
