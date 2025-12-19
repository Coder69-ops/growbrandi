import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'nl', 'de', 'es', 'fr'];

export const DeepLinkRedirect: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { i18n } = useTranslation();

    useEffect(() => {
        // 1. Detect Language
        let detectedLang = i18n.language;

        if (!detectedLang || !SUPPORTED_LANGUAGES.includes(detectedLang)) {
            const shortLang = detectedLang?.split('-')[0];
            if (shortLang && SUPPORTED_LANGUAGES.includes(shortLang)) {
                detectedLang = shortLang;
            } else {
                detectedLang = DEFAULT_LANGUAGE;
            }
        }

        // 2. Construct new path
        // location.pathname includes the leading slash, e.g. "/team/foo"
        // Target: "/en/team/foo"
        const newPath = `/${detectedLang}${location.pathname}`;

        // 3. Preserve query and hash
        const search = location.search;
        const hash = location.hash;

        navigate(`${newPath}${search}${hash}`, { replace: true });
    }, [navigate, location, i18n.language]);

    return null;
};

export default DeepLinkRedirect;
