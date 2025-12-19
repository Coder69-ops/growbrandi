import { useState } from 'react';
import { generatePageContent } from '../services/ai';

export const useContentGenerator = (
    data: any,
    setData: (data: any) => void,
    sectionName?: string // Optional: if we want to generate only for a specific section, though "page" usually implies full structure
) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatorOpen, setGeneratorOpen] = useState(false);

    const handleOpenGenerator = () => setGeneratorOpen(true);
    const handleCloseGenerator = () => setGeneratorOpen(false);

    const handleGenerateContent = async (targetAudience: string, tone: string, context: string) => {
        setIsGenerating(true);
        try {
            // We pass the current data structure so the AI knows what keys to fill
            // Deep clone to avoid any reference issues, although we are just reading keys
            const structure = JSON.parse(JSON.stringify(data));

            // Call AI Service
            const generatedContent = await generatePageContent(targetAudience, tone, context, structure);

            // Merge Logic:
            // The AI returns a full object with "en" values filled.
            // We need to merge this into the existing data state, preserving other languages if they exist (though this is generation, so likely we overwriting or starting fresh).
            // For now, let's assume we overwrite the 'en' values but keep the structure.

            // Helper for deep merge focused on 'en' keys
            const mergeContent = (original: any, generated: any): any => {
                if (typeof original !== 'object' || original === null) return generated;

                // If it's an array, we might replace it entirely if it's a list content (like features)
                // OR map 1-to-1 if it's fixed structure. 
                // For safety with simple arrays (strings), let's replace.
                // For arrays of objects, we rely on the AI returning the same array length/structure? 
                // Actually, for "Auto Generate", replacing the array content is usually desired (e.g. new benefits list).

                if (Array.isArray(original)) {
                    // If AI returned an array, use it.
                    return Array.isArray(generated) ? generated : original;
                }

                const merged = { ...original };
                for (const key in generated) {
                    if (key === 'en' && typeof generated[key] === 'string') {
                        merged[key] = generated[key];
                    } else if (typeof generated[key] === 'object') {
                        merged[key] = mergeContent(original[key], generated[key]);
                    } else {
                        // Fallback for non-localized fields
                        merged[key] = generated[key];
                    }
                }
                return merged;
            };

            const newData = mergeContent(data, generatedContent);
            setData(newData);

        } catch (error) {
            console.error("Content generation error:", error);
            throw error; // Re-throw to be caught by the modal
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        isGenerating,
        generatorOpen,
        handleOpenGenerator,
        handleCloseGenerator,
        handleGenerateContent
    };
};
