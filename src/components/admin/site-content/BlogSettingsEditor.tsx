import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Plus, Trash2, Layout, Megaphone, Magnet } from 'lucide-react';
import { LocalizedInput } from '../LocalizedFormFields';
import { LocalizedTextArea } from '../LocalizedFormFields';
import { useContent } from '../../../hooks/useContent';
import { SupportedLanguage } from '../../../utils/localization';
import { useAutoTranslate } from '../../../hooks/useAutoTranslate';

// Helper Component for picking internal links
const LinkSelector = ({ onSelect }: { onSelect: (url: string) => void }) => {
    const links = [
        { label: 'Contact Page', value: '/contact' },
        { label: 'Services Page', value: '/services' },
        { label: 'Blog Home', value: '/blog' },
        { label: 'About Us', value: '/about' },
        { label: 'Careers', value: '/careers' },
        { label: 'Process', value: '/process' },
        { label: 'Case Studies', value: '/case-studies' },
    ];

    return (
        <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-500">Insert Link:</span>
            <select
                onChange={(e) => {
                    if (e.target.value) {
                        onSelect(e.target.value);
                        e.target.value = ''; // Reset
                    }
                }}
                className="text-xs border-none bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded px-2 py-0.5 font-medium cursor-pointer hover:text-blue-800 focus:ring-0"
            >
                <option value="">-- Choose --</option>
                {links.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                ))}
            </select>
        </div>
    );
};

interface BlogSettingsEditorProps {
    initialData: any;
    onSave: (data: any) => Promise<void>;
    saving: boolean;
    activeLanguage: SupportedLanguage;
}

export const BlogSettingsEditor: React.FC<BlogSettingsEditorProps> = ({ initialData, onSave, saving, activeLanguage }) => {
    const { t } = useTranslation();
    const [data, setData] = useState<any>(initialData || {});
    // Fetch posts to allow selecting a featured post
    const { data: blogPosts } = useContent('blog_posts');

    // Ensure default structure
    useEffect(() => {
        if (!data.blog_settings) {
            setData((prev: any) => ({
                ...prev,
                blog_settings: {
                    featured_post_mode: 'latest', // 'latest' or 'manual'
                    featured_post_id: '',
                    sidebar_cta: {
                        enabled: true,
                        title: { en: 'Book a Strategy Call', nl: 'Boek een Strategie gesprek' },
                        body: { en: 'Ready to scale your business? Let\'s talk.', nl: 'Meer klanten? Laten we praten.' },
                        button_text: { en: 'Book Now', nl: 'Boek Nu' },
                        button_url: { en: '/contact', nl: '/contact' }
                    },
                    inline_cta: {
                        enabled: true,
                        title: { en: 'Need help with this?', nl: 'Hulp nodig hiermee?' },
                        body: { en: 'Our experts can handle this for you.', nl: 'Onze experts kunnen dit voor u doen.' },
                        button_text: { en: 'Get Help', nl: 'Krijg Hulp' },
                        button_url: { en: '/services', nl: '/services' }
                    },
                    lead_magnet: {
                        enabled: true,
                        title: { en: 'Free Growth Checklist', nl: 'Gratis Groei Checklist' },
                        description: { en: 'Download our ultimate guide to 10x your growth.', nl: 'Download onze ultieme gids.' },
                        button_text: { en: 'Download Free', nl: 'Gratis Downloaden' },
                        button_url: { en: '#', nl: '#' },
                        image: ''
                    },
                    labels: {
                        hero_read_article: { en: 'Read Article', nl: 'Lees Artikel' },
                        card_read_more: { en: 'Read More', nl: 'Lees Meer' }
                    }
                }
            }));
        }
    }, [initialData]);

    const updateSettings = (section: string, field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            blog_settings: {
                ...prev.blog_settings,
                [section]: {
                    ...prev.blog_settings?.[section],
                    [field]: value
                }
            }
        }));
    };

    const updateRootSetting = (field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            blog_settings: {
                ...prev.blog_settings,
                [field]: value
            }
        }));
    };

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        data,
        setData,
        {
            deepKeys: [
                'blog_settings.sidebar_cta.title', 'blog_settings.sidebar_cta.body',
                'blog_settings.sidebar_cta.button_text', 'blog_settings.sidebar_cta.button_url',
                'blog_settings.inline_cta.title', 'blog_settings.inline_cta.body',
                'blog_settings.inline_cta.button_text', 'blog_settings.inline_cta.button_url',
                'blog_settings.lead_magnet.title', 'blog_settings.lead_magnet.description',
                'blog_settings.lead_magnet.button_text', 'blog_settings.lead_magnet.button_url',
                'blog_settings.labels.hero_read_article', 'blog_settings.labels.card_read_more'
            ]
        }
    );

    const settings = data.blog_settings || {};

    return (
        <div className="space-y-8">
            {/* Featured Post Settings */}
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Featured Post</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Control the big hero post on the blog home page.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Mode</label>
                        <select
                            value={settings.featured_post_mode || 'latest'}
                            onChange={(e) => updateRootSetting('featured_post_mode', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                            <option value="latest">Auto-show Latest Post</option>
                            <option value="manual">Manual Selection</option>
                        </select>
                    </div>

                    {settings.featured_post_mode === 'manual' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Post</label>
                            <select
                                value={settings.featured_post_id || ''}
                                onChange={(e) => updateRootSetting('featured_post_id', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="">-- Choose a post --</option>
                                {blogPosts.map((post: any) => (
                                    <option key={post.id} value={post.id}>{post.title?.en || post.title?.nl || 'Untitled'}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </section>

            {/* Conversion Funnels */}
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Megaphone className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Conversion CTAs</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Configure the calls-to-action that appear on blog posts.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sticky Sidebar Widget */}
                    <div className="space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 pb-8 lg:pb-0 lg:pr-8">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Sidebar Sticky Widget</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.sidebar_cta?.enabled ?? true}
                                    onChange={(e) => updateSettings('sidebar_cta', 'enabled', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <LocalizedInput
                            label="Widget Title"
                            value={settings.sidebar_cta?.title || {}}
                            onChange={(val) => updateSettings('sidebar_cta', 'title', val)}
                            placeholder={{ en: "Book a call", nl: "Boek een gesprek" } as any}
                            activeLanguage={activeLanguage}
                        />
                        <LocalizedTextArea
                            label="Widget Body"
                            value={settings.sidebar_cta?.body || {}}
                            onChange={(val) => updateSettings('sidebar_cta', 'body', val)}
                            placeholder={{ en: "Ready to scale?", nl: "Klaar om te groeien?" } as any}
                            activeLanguage={activeLanguage}
                        />
                        <LocalizedInput
                            label="Button Text"
                            value={settings.sidebar_cta?.button_text || {}}
                            onChange={(val) => updateSettings('sidebar_cta', 'button_text', val)}
                            activeLanguage={activeLanguage}
                        />
                        <div>
                            <LinkSelector onSelect={(url) => {
                                const current = settings.sidebar_cta?.button_url || {};
                                updateSettings('sidebar_cta', 'button_url', { ...current, [activeLanguage]: url });
                            }} />
                            <LocalizedInput
                                label="Button URL"
                                value={settings.sidebar_cta?.button_url || {}}
                                onChange={(val) => updateSettings('sidebar_cta', 'button_url', val)}
                                placeholder="/contact"
                                activeLanguage={activeLanguage}
                            />
                        </div>
                    </div>

                    {/* Inline Content CTA */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 dark:text-white">Inline Content CTA</h3>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.inline_cta?.enabled ?? true}
                                    onChange={(e) => updateSettings('inline_cta', 'enabled', e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <p className="text-xs text-slate-500 italic mb-2">Appears automatically after the 2nd paragraph of blog posts.</p>
                        <LocalizedInput
                            label="Card Title"
                            value={settings.inline_cta?.title || {}}
                            onChange={(val) => updateSettings('inline_cta', 'title', val)}
                            activeLanguage={activeLanguage}
                        />
                        <LocalizedTextArea
                            label="Card Body"
                            value={settings.inline_cta?.body || {}}
                            onChange={(val) => updateSettings('inline_cta', 'body', val)}
                            activeLanguage={activeLanguage}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <LocalizedInput
                                label="Button Text"
                                value={settings.inline_cta?.button_text || {}}
                                onChange={(val) => updateSettings('inline_cta', 'button_text', val)}
                                activeLanguage={activeLanguage}
                            />
                            <div>
                                <LinkSelector onSelect={(url) => {
                                    const current = settings.inline_cta?.button_url || {};
                                    updateSettings('inline_cta', 'button_url', { ...current, [activeLanguage]: url });
                                }} />
                                <LocalizedInput
                                    label="Button URL"
                                    value={settings.inline_cta?.button_url || {}}
                                    onChange={(val) => updateSettings('inline_cta', 'button_url', val)}
                                    activeLanguage={activeLanguage}
                                    placeholder="/services"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lead Magnet */}
            <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Magnet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Lead Magnet Funnel</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Offer a free checklist or guide to collect leads. Appears in the blog list.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Grid Card Configuration</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.lead_magnet?.enabled ?? true}
                                onChange={(e) => updateSettings('lead_magnet', 'enabled', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <LocalizedInput
                                label="Offer Title"
                                value={settings.lead_magnet?.title || {}}
                                onChange={(val) => updateSettings('lead_magnet', 'title', val)}
                                placeholder={{ en: "Free SEO Checklist", nl: "Gratis SEO Checklist" } as any}
                                activeLanguage={activeLanguage}
                            />
                            <LocalizedTextArea
                                label="Short Description"
                                value={settings.lead_magnet?.description || {}}
                                onChange={(val) => updateSettings('lead_magnet', 'description', val)}
                                activeLanguage={activeLanguage}
                            />
                        </div>
                        <div className="space-y-4">
                            <LocalizedInput
                                label="Button Text"
                                value={settings.lead_magnet?.button_text || {}}
                                onChange={(val) => updateSettings('lead_magnet', 'button_text', val)}
                                activeLanguage={activeLanguage}
                            />
                            <div>
                                <LinkSelector onSelect={(url) => {
                                    const current = settings.lead_magnet?.button_url || {};
                                    updateSettings('lead_magnet', 'button_url', { ...current, [activeLanguage]: url });
                                }} />
                                <LocalizedInput
                                    label="Download/Signup URL"
                                    value={settings.lead_magnet?.button_url || {}}
                                    onChange={(val) => updateSettings('lead_magnet', 'button_url', val)}
                                    placeholder="https://example.com/guide"
                                    activeLanguage={activeLanguage}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={saving || isTranslating}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50"
                >
                    <svg className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {isTranslating ? 'Translating...' : 'Auto Translate'}
                </button>
                <button
                    onClick={() => onSave(data)}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                    <Save className="w-4 h-4" />
                    {saving ? t('admin.common.saving', 'Saving...') : t('admin.common.save_changes', 'Save Changes')}
                </button>
            </div>
        </div>
    );
};


