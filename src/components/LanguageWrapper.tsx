import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'es', 'fr'];
const DEFAULT_LANGUAGE = 'en';

interface LanguageWrapperProps {
    children: React.ReactNode;
}

export const LanguageWrapper: React.FC<LanguageWrapperProps> = ({ children }) => {
    const { lang } = useParams<{ lang: string }>();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If lang is not supported, redirect to default language with the same path
        if (lang && !SUPPORTED_LANGUAGES.includes(lang)) {
            // e.g., /xx/about -> /en/about
            const newPath = location.pathname.replace(`/${lang}`, `/${DEFAULT_LANGUAGE}`);
            navigate(newPath, { replace: true });
            return;
        }

        // Sync i18n language with URL parameter
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        } else if (!lang && i18n.language !== DEFAULT_LANGUAGE) {
            // If no lang param, assume default (en) and switch if needed
            i18n.changeLanguage(DEFAULT_LANGUAGE);
        }
    }, [lang, i18n, navigate, location.pathname]);

    // Early return if validating/redirecting to avoid render flicker
    if (lang && !SUPPORTED_LANGUAGES.includes(lang)) {
        return null;
    }

    return <>{children}</>;
};

export default LanguageWrapper;
