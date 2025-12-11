import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getLocalizedField } from '../utils/localization';

interface SiteContentHook {
    content: any;
    loading: boolean;
    error: Error | null;
    getText: (path: string, language: string) => string;
}

/**
 * Hook to fetch site-wide content from Firestore with real-time updates
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
        setLoading(true);
        setError(null);

        const docRef = doc(db, collection, documentId);

        const unsubscribe = onSnapshot(docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setContent(docSnap.data());
                } else {
                    setContent(null);
                }
                setLoading(false);
            },
            (err) => {
                console.error(`Error fetching ${collection}:`, err);
                setError(err as Error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [collection, documentId]);

    /**
     * Helper function to get localized text from nested paths
     * Example: getText('hero.title', 'en') -> content.hero.title.en
     * 
     * @param path - Dot-separated path to the field (e.g., 'hero.title')
     * @param language - Language code
     * @returns Localized string or empty string if not found
     */
    const getText = (path: string, language: string): string => {
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

        // Use the robust helper to extract text (handling fallbacks like en-US -> en)
        return getLocalizedField(value, language);
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
