import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { routeConfig, Route, getRouteMetadata } from '../../utils/routeConfig';
import { LocalizedString, getLocalizedField, SupportedLanguage } from '../utils/localization';

interface SeoSettingsDoc {
    global?: {
        titleSuffix?: LocalizedString | string;
        defaultDescription?: LocalizedString | string;
        defaultKeywords?: LocalizedString | string[] | string;
        defaultOgImage?: string;
    };
    routes?: Record<string, {
        title?: LocalizedString | string;
        description?: LocalizedString | string;
        keywords?: LocalizedString | string[] | string;
        ogImage?: string;
        noIndex?: boolean;
    }>;
}

interface SeoContextType {
    seoSettings: SeoSettingsDoc;
    loading: boolean;
    getSeoMetadata: (route: Route, pathname?: string, lang?: SupportedLanguage) => {
        title: string;
        titleSuffix: string;
        description: string;
        keywords: string[];
        ogImage?: string;
        noIndex?: boolean;
    };
}

const SeoContext = createContext<SeoContextType | undefined>(undefined);

export const SeoProvider = ({ children }: { children: ReactNode }) => {
    const [seoSettings, setSeoSettings] = useState<SeoSettingsDoc>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'seo'), (doc) => {
            if (doc.exists()) {
                setSeoSettings(doc.data() as SeoSettingsDoc);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getSeoMetadata = (route: Route, pathname: string = '', lang: SupportedLanguage = 'en') => {
        // 1. Get Static Metadata
        const staticMetadata = getRouteMetadata(route, pathname);

        // 2. Get Dynamic Overrides
        let routeKey = route;

        // Check for team route override
        if (pathname.startsWith('/team/')) {
            const teamId = pathname.split('/')[2];
            if (teamId) {
                const teamKey = `team_${teamId}`;
                if (seoSettings.routes?.[teamKey]) {
                    routeKey = teamKey as any;
                }
            }
        }

        // Custom Route Override Check (Exact Path Match)
        // If the path exists in seoSettings.routes directly, use it.
        // This supports manually added paths like "/services/special-offer"
        // We strip the language prefix for the check: /en/landing -> /landing
        const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/'); // /fr/foo -> /foo

        // Logic:
        // 1. Try routeKey (mapped from routeConfig)
        // 2. If no setting for routeKey, or if we want to support custom pages that might be 404s in config
        //    check key = cleanPath

        let routeOverrides = seoSettings.routes?.[routeKey] || {};

        // If no specifically configured override for the config-based key, 
        // OR if the route is generic/catch-all, try the exact path.
        if (!seoSettings.routes?.[routeKey] && seoSettings.routes?.[cleanPath]) {
            routeOverrides = seoSettings.routes[cleanPath];
        }
        // Fallback: If cleanPath exists, it might be more specific than a generic routeKey check
        if (seoSettings.routes?.[cleanPath]) {
            routeOverrides = seoSettings.routes[cleanPath];
        }

        const globalSettings = seoSettings.global || {};

        // 3. Merge
        // Title: Override > Static
        const titleSuffix = getLocalizedField(globalSettings.titleSuffix as any, lang) || '';
        const routeTitle = getLocalizedField(routeOverrides.title as any, lang) || staticMetadata.title || '';

        // Description: Override > Static > Global Default
        const description = getLocalizedField(routeOverrides.description as any, lang) ||
            staticMetadata.description ||
            getLocalizedField(globalSettings.defaultDescription as any, lang) || '';

        // Keywords: Override > Static > Global Default
        let keywords: string[] = [];

        // Resolve helper
        const resolveKeywords = (val: any) => {
            const str = getLocalizedField(val, lang);
            return str ? str.split(',').map(s => s.trim()) : [];
        };

        if (routeOverrides.keywords) {
            keywords = resolveKeywords(routeOverrides.keywords);
        } else if (staticMetadata.keywords && staticMetadata.keywords.length > 0) {
            keywords = staticMetadata.keywords;
        } else if (globalSettings.defaultKeywords) {
            keywords = resolveKeywords(globalSettings.defaultKeywords);
        }

        return {
            title: routeTitle,
            titleSuffix,
            description,
            keywords,
            noIndex: routeOverrides.noIndex,
            ogImage: routeOverrides.ogImage
        };
    };

    return (
        <SeoContext.Provider value={{ seoSettings, loading, getSeoMetadata }}>
            {children}
        </SeoContext.Provider>
    );
};

export const useSeo = () => {
    const context = useContext(SeoContext);
    if (context === undefined) {
        throw new Error('useSeo must be used within a SeoProvider');
    }
    return context;
};
