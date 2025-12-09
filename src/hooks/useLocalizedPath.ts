import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLocalizedPath = () => {
    const { i18n } = useTranslation();

    const getLocalizedPath = useCallback((path: string) => {
        // If path is external or anchor, return as is
        if (path.startsWith('http') || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) {
            return path;
        }

        // Clean any existing language prefix
        // Matches /xx/ or /xx at start
        const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');

        // Normalize
        const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

        // Get current lang (fallback to en if missing)
        const lang = (i18n.language || 'en').split('-')[0];

        // Return /lang/path (avoid double slash if path is /)
        return `/${lang}${normalizedPath === '/' ? '' : normalizedPath}`;
    }, [i18n.language]);

    return { getLocalizedPath };
};
