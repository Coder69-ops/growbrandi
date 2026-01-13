import { useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../utils/localization';

export const useLocalizedPath = () => {
    const { lang } = useParams<{ lang: string }>();
    const location = useLocation();
    const { i18n } = useTranslation();

    // Helper to get lang from path
    const getLangFromPath = (pathname: string): SupportedLanguage | null => {
        const parts = pathname.split('/');
        const firstPart = parts[1]; // Parts[0] is empty string if path starts with /
        if (firstPart && SUPPORTED_LANGUAGES.includes(firstPart as any)) {
            return firstPart as SupportedLanguage;
        }
        return null;
    };

    // Determine current language
    // Priority: useParams > URL path segment > default 'en'
    const langFromPath = getLangFromPath(location.pathname);
    const currentLang = (lang && SUPPORTED_LANGUAGES.includes(lang as any))
        ? (lang as SupportedLanguage)
        : (langFromPath || 'en');

    const getLocalizedPath = useCallback((path: string) => {
        // External or special links
        if (path.startsWith('http') || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) {
            return path;
        }

        // Clean existing prefix
        const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
        const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

        // Create localized path
        if (currentLang === 'en') {
            return normalizedPath === '/' ? '/' : normalizedPath;
        }
        return `/${currentLang}${normalizedPath === '/' ? '' : normalizedPath}`;
    }, [currentLang]);

    return { getLocalizedPath, currentLang };
};
