import { useState } from 'react';
import { translateContent } from '../services/ai';

// Helper to access nested properties safely
const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
};

// Helper to set nested properties safely (immutable-ish)
const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const newObj = { ...obj };

    // Deep clone logic for the path we are traversing to ensure immutability
    let current = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
        // If the property doesn't exist or isn't an object, create it
        if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
            current[keys[i]] = {};
        }
        // Clone the next level
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
    }

    // Set the value at the leaf
    current[keys[keys.length - 1]] = value;
    return newObj;
};

interface UseAutoTranslateOptions {
    // Simple top-level fields (e.g., 'title', 'description')
    fields?: string[];
    // Arrays of localized objects (e.g., 'features' -> [{en: '...'}, {en: '...'}])
    arrayFields?: string[];
    // Nested content keys using dot notation (e.g., 'page_text.title')
    deepKeys?: string[];
    // Complex arrays of objects with localized fields (e.g., process -> [{step: {en: ..}, desc: {en: ..}}])
    complexArrayFields?: Record<string, string[]>;
}

export const useAutoTranslate = (
    data: any,
    setData: (data: any) => void,
    options: UseAutoTranslateOptions = {}
) => {
    const [isTranslating, setIsTranslating] = useState(false);

    const handleAutoTranslate = async () => {
        if (!data) return;
        setIsTranslating(true);

        try {
            const contentToTranslate: Record<string, string> = {};

            // 1. Handle Simple Key-Value Fields
            options.fields?.forEach(field => {
                const value = data[field]?.en;
                if (value) contentToTranslate[field] = value;
            });

            // 2. Handle Deep Nested Keys
            options.deepKeys?.forEach(keyPath => {
                const value = getNestedValue(data, keyPath)?.en;
                if (value) contentToTranslate[keyPath] = value;
            });

            // 3. Handle Array Fields
            options.arrayFields?.forEach(arrayName => {
                const array = data[arrayName];
                if (Array.isArray(array)) {
                    array.forEach((item, index) => {
                        if (item?.en) {
                            contentToTranslate[`${arrayName}__ARRAY__${index}`] = item.en;
                        }
                    });
                }
            });

            // 4. Handle Complex Array Fields (e.g. Process Steps)
            if (options.complexArrayFields) {
                Object.entries(options.complexArrayFields).forEach(([arrayName, fields]) => {
                    const array = data[arrayName];
                    if (Array.isArray(array)) {
                        array.forEach((item, index) => {
                            fields.forEach(field => {
                                const value = item[field]?.en;
                                if (value) {
                                    contentToTranslate[`${arrayName}__COMPLEX__${index}__${field}`] = value;
                                }
                            });
                        });
                    }
                });
            }

            if (Object.keys(contentToTranslate).length === 0) {
                alert("No English content found to translate.");
                setIsTranslating(false);
                return;
            }

            // Call AI Service
            const translations = await translateContent(contentToTranslate);

            // Merge Translations Back
            let newData = { ...data };

            // 1. Merge Simple Fields
            options.fields?.forEach(field => {
                if (translations[field]) {
                    newData[field] = { ...newData[field], ...translations[field] };
                }
            });

            // 2. Merge Deep Keys
            options.deepKeys?.forEach(keyPath => {
                if (translations[keyPath]) {
                    const currentVal = getNestedValue(newData, keyPath) || {};
                    const updatedVal = { ...currentVal, ...translations[keyPath] };
                    newData = setNestedValue(newData, keyPath, updatedVal);
                }
            });

            // 3. Merge Array Fields
            options.arrayFields?.forEach(arrayName => {
                if (Array.isArray(newData[arrayName])) {
                    newData[arrayName] = newData[arrayName].map((item: any, index: number) => {
                        const translationKey = `${arrayName}__ARRAY__${index}`;
                        if (translations[translationKey]) {
                            return { ...item, ...translations[translationKey] };
                        }
                        return item;
                    });
                }
            });

            // 4. Merge Complex Array Fields
            if (options.complexArrayFields) {
                Object.entries(options.complexArrayFields).forEach(([arrayName, fields]) => {
                    if (Array.isArray(newData[arrayName])) {
                        newData[arrayName] = newData[arrayName].map((item: any, index: number) => {
                            const updatedItem = { ...item };
                            let hasUpdates = false;

                            fields.forEach(field => {
                                const translationKey = `${arrayName}__COMPLEX__${index}__${field}`;
                                if (translations[translationKey]) {
                                    updatedItem[field] = { ...updatedItem[field], ...translations[translationKey] };
                                    hasUpdates = true;
                                }
                            });

                            return hasUpdates ? updatedItem : item;
                        });
                    }
                });
            }

            setData(newData);

        } catch (error) {
            console.error("Auto-translate error:", error);
            alert("Translation failed. Please check the console and try again.");
        } finally {
            setIsTranslating(false);
        }
    };

    return { isTranslating, handleAutoTranslate };
};
