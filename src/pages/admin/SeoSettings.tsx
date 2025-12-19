import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { routeConfig, Route, RouteMetadata } from '../../../utils/routeConfig';
import { Save, Globe, RefreshCw, FileCode, CheckCircle, Search, Eye, Users, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, SupportedLanguage, LocalizedString, getLocalizedField, createEmptyLocalizedString, ensureLocalizedFormat } from '../../utils/localization';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader'; // [NEW]
import { useStatusModal } from '../../hooks/useStatusModal'; // [NEW]
import { logAction } from '../../services/auditService'; // [NEW]

interface SeoSettingsDoc {
    global?: {
        titleSuffix?: LocalizedString;
        defaultDescription?: LocalizedString;
        defaultKeywords?: LocalizedString; // Stored as comma-separated string per lang
    };
    routes?: Record<string, {
        title?: LocalizedString;
        description?: LocalizedString;
        keywords?: LocalizedString;
        noIndex?: boolean;
    }>;
    sitemap?: Record<string, {
        include?: boolean;
        priority?: number;
        changefreq?: string;
    }>;
}

const SeoSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<SeoSettingsDoc>({});
    const [activeTab, setActiveTab] = useState<'global' | 'pages' | 'sitemap'>('global');
    const [activeLang, setActiveLang] = useState<SupportedLanguage>('en');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSitemapModal, setShowSitemapModal] = useState(false);
    const [sitemapXml, setSitemapXml] = useState('');
    const [teamRoutes, setTeamRoutes] = useState<Record<string, RouteMetadata>>({});
    const { showSuccess, showError, StatusModal } = useStatusModal(); // [NEW]

    // New State for adding custom routes
    const [newRoutePath, setNewRoutePath] = useState('');
    const [newRouteTitle, setNewRouteTitle] = useState('');

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchSettings(), fetchTeamMembers()]);
            setLoading(false);
        };
        init();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'team_members'));
            const members: Record<string, RouteMetadata> = {};
            querySnapshot.docs.forEach(doc => {
                const data = doc.data();
                // Use slug if available, otherwise ID (as per user request /en/team/slug)
                const urlSlug = data.slug || doc.id;
                members[`team_${doc.id}`] = {
                    path: `/team/${urlSlug}`,
                    title: `Team: ${data.name}`,
                    description: `Learn more about ${data.name} at GrowBrandi.`,
                    keywords: [data.name, 'team', 'growbrandi', data.role].filter(Boolean)
                };
            });
            setTeamRoutes(members);
        } catch (error) {
            console.error("Error fetching team members:", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const docRef = doc(db, 'settings', 'seo');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data() as SeoSettingsDoc);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    // Computed merged settings to ensure defaults are present for translation
    const mergedSettings = React.useMemo(() => {
        const merged = { ...settings };
        if (!merged.routes) merged.routes = {};

        const allRoutes = { ...routeConfig, ...teamRoutes };
        Object.entries(allRoutes).forEach(([key, config]: [string, any]) => {
            if (!merged.routes![key]) merged.routes![key] = {};

            // Ensure EN values exist
            if (!merged.routes![key].title) merged.routes![key].title = {};
            if (!merged.routes![key].title!.en) {
                merged.routes![key].title!.en = config.title || '';
            }

            if (!merged.routes![key].description) merged.routes![key].description = {};
            if (!merged.routes![key].description!.en) {
                merged.routes![key].description!.en = config.description || '';
            }

            // Description defaults to global if not specific? 
            // Logic in render was: routeSettings.description?.en || config.description
            // Here we just set it.
        });
        return merged;
    }, [settings, teamRoutes]);

    // Generate Deep Keys for AutoTranslate
    const autoTranslateOptions = React.useMemo(() => {
        const deepKeys = [
            'global.titleSuffix',
            'global.defaultDescription',
            'global.defaultKeywords'
        ];

        const allRoutes = { ...routeConfig, ...teamRoutes };
        Object.keys(allRoutes).forEach(key => {
            deepKeys.push(`routes.${key}.title`);
            deepKeys.push(`routes.${key}.description`);
            // Keywords often simpler, maybe skip or include? user previous logic attempted it.
            // Let's include it.
            deepKeys.push(`routes.${key}.keywords`);
        });

        return { deepKeys };
    }, [teamRoutes]); // routeConfig is static

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        mergedSettings,
        setSettings,
        autoTranslateOptions
    );

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'seo'), settings);

            // [NEW] Audit Log
            await logAction(
                'update',
                'settings',
                `Updated SEO Settings for ${LANGUAGE_NAMES[activeLang]}`,
                { language: activeLang }
            );

            showSuccess('Settings Saved', 'SEO settings have been successfully updated.');
        } catch (error) {
            console.error("Error saving settings:", error);
            showError('Save Failed', 'Could not save SEO settings. Please try again.');
        }
        setSaving(false);
    };



    const handleGlobalChange = (field: keyof NonNullable<SeoSettingsDoc['global']>, value: string) => {
        setSettings(prev => {
            const currentGlobal = prev.global || {};
            const currentField = ensureLocalizedFormat(currentGlobal[field] as any);

            return {
                ...prev,
                global: {
                    ...currentGlobal,
                    [field]: {
                        ...currentField,
                        [activeLang]: value
                    }
                }
            };
        });
    };

    const handleRouteChange = (routeKey: string, field: 'title' | 'description' | 'keywords' | 'noIndex', value: any) => {
        setSettings(prev => {
            const currentRoutes = prev.routes || {};
            const currentRoute = currentRoutes[routeKey] || {};

            if (field === 'noIndex') {
                return {
                    ...prev,
                    routes: {
                        ...currentRoutes,
                        [routeKey]: {
                            ...currentRoute,
                            noIndex: value
                        }
                    }
                };
            }

            // Handle localized fields
            const currentField = ensureLocalizedFormat(currentRoute[field] as any);
            return {
                ...prev,
                routes: {
                    ...currentRoutes,
                    [routeKey]: {
                        ...currentRoute,
                        [field]: {
                            ...currentField,
                            [activeLang]: value
                        }
                    }
                }
            };
        });
    };

    const handleSitemapChange = (routeKey: string, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            sitemap: {
                ...prev.sitemap,
                [routeKey]: {
                    ...prev.sitemap?.[routeKey],
                    [field]: value
                }
            }
        }));
    };

    const generateSitemap = () => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
        const baseUrl = 'https://www.growbrandi.com';

        // Re-calculate custom routes inside here to be safe, or direct access if scope allows. 
        // Scope allows access to settings.routes.
        const dynamicCustomRoutes: Record<string, RouteMetadata> = {};
        if (settings.routes) {
            Object.keys(settings.routes).forEach(key => {
                // Reuse same logic: if not in static config and starts with /, it's custom
                if (!routeConfig[key] && !teamRoutes[key] && key.startsWith('/')) {
                    dynamicCustomRoutes[key] = {
                        path: key,
                        title: 'Custom Page',
                        description: '',
                        keywords: []
                    };
                }
            });
        }

        const allRoutes = { ...routeConfig, ...teamRoutes, ...dynamicCustomRoutes };

        Object.entries(allRoutes).forEach(([key, config]: [string, any]) => {
            const sitemapConfig = settings.sitemap?.[key];
            const include = sitemapConfig?.include !== false;

            if (include) {
                const priority = sitemapConfig?.priority || 0.8;
                const changefreq = sitemapConfig?.changefreq || 'weekly';

                // Generate entry for each supported language
                SUPPORTED_LANGUAGES.forEach(lang => {
                    // Normalize path: ensure it starts with /
                    const normalizedPath = config.path.startsWith('/') ? config.path : `/${config.path}`;

                    // Construct localized path
                    // ALWAYS include lang prefix as App.tsx routes are /:lang/...
                    // Example: /en/about, /de/about
                    // Home path is usually just /:lang

                    const finalPath = `/${lang}${normalizedPath === '/' ? '' : normalizedPath}`;

                    xml += `\n  <url>
    <loc>${baseUrl}${finalPath}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
                });
            }
        });

        xml += `\n</urlset>`;
        setSitemapXml(xml);
        setShowSitemapModal(true);
    };

    const downloadSitemap = () => {
        const blob = new Blob([sitemapXml], { type: 'text/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) return <AdminLoader message="Loading SEO Settings..." />;

    // Merge static routes and dynamic team routes
    const allRoutes = { ...routeConfig, ...teamRoutes };

    // [NEW] Add Custom Routes from Settings that are NOT in routeConfig or teamRoutes
    const customRoutes: Record<string, RouteMetadata> = {};
    if (settings.routes) {
        Object.keys(settings.routes).forEach(key => {
            // If key is not in allRoutes (and isn't a team key already merged), it's custom
            if (!allRoutes[key] && key.startsWith('/')) { // Assumption: Custom routes start with /
                customRoutes[key] = {
                    path: key,
                    title: settings.routes![key].title?.en || 'Custom Page', // Fallback to EN or default
                    description: settings.routes![key].description?.en || '',
                    keywords: []
                };
            }
        });
    }

    const mergedRoutesForTable = { ...allRoutes, ...customRoutes };



    const handleAddRoute = () => {
        if (!newRoutePath.startsWith('/')) {
            showError("Invalid Path", "Path must start with /");
            return;
        }
        if (mergedRoutesForTable[newRoutePath]) {
            showError("Duplicate Path", "This path already exists.");
            return;
        }

        // Add to settings
        setSettings(prev => ({
            ...prev,
            routes: {
                ...prev.routes,
                [newRoutePath]: {
                    title: createEmptyLocalizedString(),
                    description: createEmptyLocalizedString(),
                    keywords: createEmptyLocalizedString(),
                    noIndex: false
                }
            }
        }));

        // Update local customRoutes state/cache if needed, but easier to just let re-render handle it via settings dependency
        // We'll initialize the EN title
        handleRouteChange(newRoutePath, 'title', newRouteTitle);

        setNewRoutePath('');
        setNewRouteTitle('');
        showSuccess("Route Added", "Custom route added. You can now configure its SEO.");
    };

    const handleDeleteRoute = (key: string) => {
        if (!confirm(`Are you sure you want to delete settings for ${key}?`)) return;

        setSettings(prev => {
            const next = { ...prev };
            if (next.routes) {
                const newRoutes = { ...next.routes };
                delete newRoutes[key];
                next.routes = newRoutes;
            }
            // Also remove from sitemap if present
            if (next.sitemap) {
                const newSitemap = { ...next.sitemap };
                delete newSitemap[key];
                next.sitemap = newSitemap;
            }
            return next;
        });
    };

    const filteredRoutes = Object.entries(mergedRoutesForTable).filter(([key, config]: [string, any]) =>
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (config.title && config.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (config.path && config.path.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const actionButtons = (
        <div className="flex gap-2">
            {activeTab !== 'sitemap' && (
                <button
                    onClick={handleAutoTranslate}
                    disabled={saving || isTranslating}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Auto-translate missing fields"
                >
                    {isTranslating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    <span>{isTranslating ? 'Translating...' : 'Auto Translate'}</span>
                </button>
            )}
            <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
            >
                {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
        </div>
    );

    return (
        <AdminPageLayout
            title="SEO & Sitemap"
            description="Manage global meta tags, url-specific settings, and sitemap configuration."
            actions={actionButtons}
        >
            <div className="space-y-6">

                {/* Main Tabs */}
                <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`pb-3 px-1 border-b-2 font-medium transition ${activeTab === 'global' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Global Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('pages')}
                        className={`pb-3 px-1 border-b-2 font-medium transition ${activeTab === 'pages' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Page SEO
                    </button>
                    <button
                        onClick={() => setActiveTab('sitemap')}
                        className={`pb-3 px-1 border-b-2 font-medium transition ${activeTab === 'sitemap' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Sitemap Control
                    </button>
                </div>

                {/* Language Selector (Visible on Global and Pages tabs) */}
                {activeTab !== 'sitemap' && (
                    <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <button
                                key={lang}
                                onClick={() => setActiveLang(lang)}
                                className={`px-3 py-1 text-sm rounded-md transition ${activeLang === lang ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                            >
                                {LANGUAGE_NAMES[lang]}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">

                    {activeTab === 'global' && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Title Suffix ({LANGUAGE_NAMES[activeLang]})
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                                    placeholder={`e.g. | GrowBrandi`}
                                    value={getLocalizedField(settings.global?.titleSuffix, activeLang)}
                                    onChange={(e) => handleGlobalChange('titleSuffix', e.target.value)}
                                />
                                <p className="text-xs text-slate-500 mt-1">Appended to title. Switch language to translate.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Default Description ({LANGUAGE_NAMES[activeLang]})
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 h-24"
                                    placeholder="Enter default meta description..."
                                    value={getLocalizedField(settings.global?.defaultDescription, activeLang)}
                                    onChange={(e) => handleGlobalChange('defaultDescription', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Default Keywords ({LANGUAGE_NAMES[activeLang]})
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                                    placeholder="Comma separated keywords"
                                    value={getLocalizedField(settings.global?.defaultKeywords, activeLang)}
                                    onChange={(e) => handleGlobalChange('defaultKeywords', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {(activeTab === 'pages' || activeTab === 'sitemap') && (
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                                <div className="flex gap-2 items-center flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <input
                                            placeholder="Search pages..."
                                            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 w-full md:w-64 text-sm"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    {/* Add Custom Route UI */}
                                    {activeTab === 'pages' && (
                                        <div className="flex gap-2 items-center ml-4 border-l pl-4 border-slate-300 dark:border-slate-600">
                                            <input
                                                placeholder="/path/to/page"
                                                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm w-40"
                                                value={newRoutePath}
                                                onChange={(e) => setNewRoutePath(e.target.value)}
                                            />
                                            <input
                                                placeholder="Page Title"
                                                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm w-40"
                                                value={newRouteTitle}
                                                onChange={(e) => setNewRouteTitle(e.target.value)}
                                            />
                                            <button
                                                onClick={handleAddRoute}
                                                disabled={!newRoutePath || !newRouteTitle}
                                                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                                title="Add Custom Page"
                                            >
                                                <div className="w-4 h-4 font-bold leading-none">+</div>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {activeTab === 'sitemap' && (
                                    <button
                                        onClick={generateSitemap}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition lg:text-sm whitespace-nowrap"
                                    >
                                        <FileCode className="w-4 h-4" /> Generate & Preview XML
                                    </button>
                                )}
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700">
                                            <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Page</th>
                                            <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Path</th>
                                            {activeTab === 'pages' ? (
                                                <>
                                                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                                        Title ({activeLang.toUpperCase()})
                                                    </th>
                                                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                                                        Description ({activeLang.toUpperCase()})
                                                    </th>
                                                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">No Index</th>
                                                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400 w-10"></th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">Include</th>
                                                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Priority</th>
                                                    <th className="p-3 text-sm font-semibold text-slate-500 dark:text-slate-400">Freq</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredRoutes.map(([key, config]: [string, any]) => {
                                            const routeSettings = settings.routes?.[key] || {};
                                            const sitemapSettings = settings.sitemap?.[key] || {};

                                            return (
                                                <tr key={key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                    <td className="p-3">
                                                        <div className="font-medium text-slate-800 dark:text-white flex items-center gap-2">
                                                            {key.startsWith('team_') && <Users className="w-3 h-3 text-blue-500" />}
                                                            {config.title}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{key}</div>
                                                    </td>
                                                    <td className="p-3 text-sm font-mono text-slate-600 dark:text-slate-400">{config.path}</td>

                                                    {activeTab === 'pages' ? (
                                                        <>
                                                            <td className="p-3">
                                                                <input
                                                                    type="text"
                                                                    className="w-full min-w-[200px] px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                                    placeholder={config.title} // Show default as placeholder
                                                                    value={getLocalizedField(routeSettings.title, activeLang)}
                                                                    onChange={(e) => handleRouteChange(key, 'title', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="p-3">
                                                                <input
                                                                    type="text"
                                                                    className="w-full min-w-[200px] px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                                    placeholder={config.description?.substring(0, 30) + '...'}
                                                                    value={getLocalizedField(routeSettings.description, activeLang)}
                                                                    onChange={(e) => handleRouteChange(key, 'description', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="p-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                                    checked={routeSettings.noIndex || false}
                                                                    onChange={(e) => handleRouteChange(key, 'noIndex', e.target.checked)}
                                                                />
                                                            </td>
                                                            <td className="p-3">
                                                                {/* Only show delete for custom routes (start with /) */}
                                                                {key.startsWith('/') && (
                                                                    <button
                                                                        onClick={() => handleDeleteRoute(key)}
                                                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                        title="Delete Custom Page SEO"
                                                                    >
                                                                        <div className="w-4 h-4">×</div>
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="p-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                                    checked={sitemapSettings.include !== false} // Default true
                                                                    onChange={(e) => handleSitemapChange(key, 'include', e.target.checked)}
                                                                />
                                                            </td>
                                                            <td className="p-3">
                                                                <select
                                                                    className="px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                                    value={sitemapSettings.priority || '0.8'}
                                                                    onChange={(e) => handleSitemapChange(key, 'priority', e.target.value)}
                                                                >
                                                                    <option value="1.0">1.0 (High)</option>
                                                                    <option value="0.8">0.8</option>
                                                                    <option value="0.5">0.5 (Medium)</option>
                                                                    <option value="0.3">0.3</option>
                                                                    <option value="0.1">0.1 (Low)</option>
                                                                </select>
                                                            </td>
                                                            <td className="p-3">
                                                                <select
                                                                    className="px-2 py-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                                                                    value={sitemapSettings.changefreq || 'weekly'}
                                                                    onChange={(e) => handleSitemapChange(key, 'changefreq', e.target.value)}
                                                                >
                                                                    <option value="always">Always</option>
                                                                    <option value="hourly">Hourly</option>
                                                                    <option value="daily">Daily</option>
                                                                    <option value="weekly">Weekly</option>
                                                                    <option value="monthly">Monthly</option>
                                                                    <option value="yearly">Yearly</option>
                                                                </select>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div >

                {/* Sitemap Preview Modal */}
                {
                    showSitemapModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <h3 className="text-lg font-bold">Sitemap XML Preview</h3>
                                    <button onClick={() => setShowSitemapModal(false)}><Eye className="w-5 h-5 text-slate-500" /></button>
                                </div>
                                <div className="p-6 overflow-auto flex-1 bg-slate-50 dark:bg-slate-900 font-mono text-xs">
                                    <pre>{sitemapXml}</pre>
                                </div>
                                <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowSitemapModal(false)}
                                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={downloadSitemap}
                                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2"
                                    >
                                        <FileCode className="w-4 h-4" /> Download sitemap.xml
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
            <StatusModal />
        </AdminPageLayout >
    );
};

export default SeoSettings;

