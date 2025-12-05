import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getLocalizedField, SupportedLanguage } from '../utils/localization';

interface SiteContentHook {
    content: any;
    loading: boolean;
    error: Error | null;
    getText: (path: string, language: SupportedLanguage) => string;
}

/**
 * Hook to fetch site-wide content from Firestore
 * Falls back to translation.json if Firestore is unavailable
 * 
 * @param collection - 'site_content' or 'contact_settings'
 * @param documentId - Document ID (default: 'main')
 */
export const useSiteContent = (
    collection: 'site_content' | 'contact_settings',
    documentId: string = 'main'
): SiteContentHook => {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setError(null);

            try {
                const docRef = doc(db, collection, documentId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setContent(docSnap.data());
                } else {
                    // Document doesn't exist, will use translation.json fallback
                    setContent(null);
                }
            } catch (err) {
                console.error(`Error fetching ${collection}:`, err);
                setError(err as Error);
                // On error, content stays null and components use translation.json
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [collection, documentId]);

    /**
     * Helper function to get localized text from nested paths
     * Example: getText('hero.title', 'en') -> content.hero.title.en
     * 
     * @param path - Dot-separated path to the field (e.g., 'hero.title')
     * @param language - Language code
     * @returns Localized string or empty string if not found
     */
    const getText = (path: string, language: SupportedLanguage): string => {
        if (!content) return '';

        const keys = path.split('.');
        let value: any = content;

        // Navigate through the nested object
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return '';
            }
        }

        // If the final value is a localized object, get the language-specific text
        if (value && typeof value === 'object' && language in value) {
            return value[language] || '';
        }

        // If it's a direct string value (for non-localized fields like email, phone)
        if (typeof value === 'string') {
            return value;
        }

        return '';
    };

    return { content, loading, error, getText };
};

/**
 * Hook specifically for site content (hero, footer, navigation, section headers)
 */
export const useSiteContentData = () => useSiteContent('site_content');

/**
 * Hook specifically for contact settings
 */
export const useContactSettings = () => useSiteContent('contact_settings');
