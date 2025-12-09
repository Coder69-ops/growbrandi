import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'es', 'fr'];

export const RootRedirect: React.FC = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    useEffect(() => {
        // Determine the language to redirect to
        // 1. Check i18n.language (which might be detected from browser/cookie)
        // 2. Fallback to default
        let detectedLang = i18n.language;

        // Ensure detected language is supported, otherwise default
        if (!detectedLang || !SUPPORTED_LANGUAGES.includes(detectedLang)) {
            // Try to extract only the lang code if it returns region (e.g., en-US)
            const shortLang = detectedLang?.split('-')[0];
            if (shortLang && SUPPORTED_LANGUAGES.includes(shortLang)) {
                detectedLang = shortLang;
            } else {
                detectedLang = DEFAULT_LANGUAGE;
            }
        }

        navigate(`/${detectedLang}`, { replace: true });
    }, [navigate, i18n.language]);

    return null;
};

export default RootRedirect;
