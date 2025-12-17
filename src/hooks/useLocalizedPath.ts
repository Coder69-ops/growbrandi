import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../utils/localization';

export const useLocalizedPath = () => {
    const { lang } = useParams<{ lang: string }>();
    const { i18n } = useTranslation();

    // Determine current language
    const currentLang = (lang && SUPPORTED_LANGUAGES.includes(lang as any))
        ? (lang as SupportedLanguage)
        : 'en';

    const getLocalizedPath = useCallback((path: string) => {
        // External or special links
        if (path.startsWith('http') || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) {
            return path;
        }

        // Clean existing prefix
        const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');
        const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

        if (currentLang === 'en') {
            return normalizedPath;
        }

        return `/${currentLang}${normalizedPath === '/' ? '' : normalizedPath}`;
    }, [currentLang]);

    return { getLocalizedPath, currentLang };
};
