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

export const generateBlogPost = async (
    topic: string,
    context?: { existingPosts?: { title: string, slug: string }[] }
): Promise<any> => {
    // Construct dynamic internal links string
    const existingLinksStr = context?.existingPosts && context.existingPosts.length > 0
        ? `
        - **EXISTING BLOG POSTS (Link to 1-2 of these if relevant)**:
${context.existingPosts.map(p => `          - [${p.title}](/blog/${p.slug})`).join('\n')}
        `
        : '';

    const prompt = `
    You are an expert SEO Content Strategist and Senior Blog Writer. 
    Your task is to generate a high-quality, comprehensive blog post about: "${topic}".
    
    STRICT JSON OUTPUT ONLY.
    
    The structure must be:
    {
        "title": "A high-conversion, click-worthy title (60 chars max optimized for SEO)",
        "excerpt": "A compelling, curiosity-inducing summary (150-160 chars) that works as a meta description.",
        "content": "Full blog post content in Markdown format. IMPORTANT: Use \\n\\n (double newline) to separate paragraphs and sections. Do not use single \\n for paragraphs.",
        "category": "One single relevant category (e.g. 'Marketing', 'AI Trends', 'Guide')",
        "tags": ["Array", "of", "3-5", "relevant", "tags"],
        "seo": {
            "metaTitle": "SEO title tag (exact match or variation of title, max 60 chars)",
            "metaDescription": "Optimized meta description with primary keyword (max 160 chars)",
            "keywords": "8-12 comma separated keywords (mix of short-tail and long-tail)"
        },
        "slug": "url-friendly-slug-text",
        "readTime": "Estimated read time (e.g., 'X min read')"
    }

    CONTENT GUIDELINES:
    1. **Length**: Minimum 800 words. Deep dive, not fluff.
    2. **Structure**: 
       - Use a strong Hook in the introduction.
       - Use H2s and H3s for clear hierarchy.
       - Include bullet points or numbered lists for readability.
       - End with a strong Conclusion and Call to Action (CTA).
    3. **Tone**: Professional yet conversational, authoritative, and engaging. Avoid robotic phrasing.
    4. **SEO & Linking**:
       - naturally include semantically related keywords (LSI).
       - **INTERNAL LINKS**: You MUST naturally weave in at least 2-3 links to relevant GrowBrandi pages.
         **Core Pages**:
         - [Services](/services)
         - [Brand Growth](/services/brand-growth)
         - [Social Media](/services/social-media-content)
         - [Web Dev](/services/web-development)
         - [Contact Us](/contact)
         ${existingLinksStr}
       - **EXTERNAL LINKS**: Include 1-2 high-authority external links (e.g., Forbes, HubSpot, Statista) to back up claims.
    5. **Formatting**: Ensure perfect Markdown syntax.

    RULES:
    1. Return ONLY valid JSON.
    2. Do NOT add markdown code blocks (like \`\`\`json) around the response.
    3. The 'content' field must be a single string with valid Markdown.
    `;

    try {
        const result = await generateStructuredResponse<any>(prompt);
        return result;
    } catch (error) {
        console.error("Failed to generate blog post:", error);
        throw error;
    }
};

