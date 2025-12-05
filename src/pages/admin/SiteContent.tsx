import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Globe, Layout, Navigation as NavIcon, Type, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { SupportedLanguage, createEmptyLocalizedString } from '../../utils/localization';
import PreviewLayout from '../../components/admin/PreviewLayout';
import { usePreviewData } from '../../hooks/usePreviewData';

type SectionTab = 'hero' | 'footer' | 'navigation' | 'section_headers';

const AdminSiteContent = () => {
    const [activeSection, setActiveSection] = useState<SectionTab>('hero');
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    const {
        previewData: content,
        loading,
        saving,
        hasChanges,
        updatePreview,
        saveChanges,
        resetPreview
    } = usePreviewData({ collection: 'site_content', documentId: 'main' });


    const handleSave = async () => {
        try {
            await saveChanges();
            alert('Site content saved successfully!');
        } catch (error) {
            console.error('Error saving site content:', error);
            alert('Failed to save site content.');
        }
    };

    const updateField = (section: string, field: string, value: any, subfield?: string) => {
        const path = subfield
            ? `${section}.${subfield}.${field}`
            : `${section}.${field}`;
        updatePreview(path, value);
    };

    const sections = [
        { id: 'hero' as SectionTab, label: 'Hero Section', icon: Layout, description: 'Main landing area content' },
        { id: 'footer' as SectionTab, label: 'Footer', icon: Type, description: 'Links and copyright info' },
        { id: 'navigation' as SectionTab, label: 'Navigation', icon: NavIcon, description: 'Menu links and labels' },
        { id: 'section_headers' as SectionTab, label: 'Section Headers', icon: Globe, description: 'Headings for various page sections' },
    ];

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading site content...</div>;
    if (!content) return <div className="p-12 text-center text-slate-500">No content found</div>;

    return (
        <PreviewLayout previewData={content} section={activeSection}>
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Site Content
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                            Manage global text and structural content
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                        Changes made here affect global site elements. Use the preview panel on the right (desktop) or toggle below (mobile) to see updates in real-time before saving.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Section Tabs */}
                    <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                        <div className="flex p-2 gap-2 min-w-max">
                            {sections.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveSection(id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${activeSection === id
                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                        </div>

                        <div className="space-y-6">
                            {/* Hero Section */}
                            {activeSection === 'hero' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Hero Content</h3>
                                    <LocalizedInput
                                        label="Headline"
                                        value={content.hero?.headline}
                                        onChange={(v) => updateField('hero', 'headline', v)}
                                        activeLanguage={activeLanguage}
                                        required
                                        placeholder="Main hero title"
                                    />
                                    <LocalizedInput
                                        label="Subheadline"
                                        value={content.hero?.subheadline}
                                        onChange={(v) => updateField('hero', 'subheadline', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={3}
                                        required
                                        placeholder="Supporting text below headline"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <LocalizedInput
                                            label="CTA Button Text"
                                            value={content.hero?.cta_text}
                                            onChange={(v) => updateField('hero', 'cta_text', v)}
                                            activeLanguage={activeLanguage}
                                            placeholder="e.g., Get Started"
                                        />
                                        <LocalizedInput
                                            label="Secondary Button Text"
                                            value={content.hero?.secondary_cta}
                                            onChange={(v) => updateField('hero', 'secondary_cta', v)}
                                            activeLanguage={activeLanguage}
                                            placeholder="e.g., View Portfolio"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Footer Section */}
                            {activeSection === 'footer' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Footer Content</h3>
                                    <LocalizedInput
                                        label="Footer Tagline"
                                        value={content.footer?.tagline}
                                        onChange={(v) => updateField('footer', 'tagline', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={2}
                                        placeholder="Short description validation"
                                    />
                                    <LocalizedInput
                                        label="Copyright Text"
                                        value={content.footer?.copyright}
                                        onChange={(v) => updateField('footer', 'copyright', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="e.g., © 2024 Company Name"
                                    />
                                </div>
                            )}

                            {/* Navigation Section */}
                            {activeSection === 'navigation' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu Labels</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {['home', 'services', 'projects', 'about', 'contact', 'blog', 'careers'].map((item) => (
                                            <LocalizedInput
                                                key={item}
                                                label={`${item.charAt(0).toUpperCase() + item.slice(1)} Link`}
                                                value={content.navigation?.[item]}
                                                onChange={(v) => updateField('navigation', item, v)}
                                                activeLanguage={activeLanguage}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Section Headers */}
                            {activeSection === 'section_headers' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Page Headers</h3>
                                    <div className="space-y-8">
                                        {['process', 'services', 'projects', 'testimonials', 'team', 'contact', 'faq'].map((section) => (
                                            <div key={section} className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <h4 className="font-medium text-slate-900 dark:text-white capitalize mb-4">{section} Section</h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <LocalizedInput
                                                        label="Title"
                                                        value={content.section_headers?.[section]?.title}
                                                        onChange={(v) => updateField('section_headers', 'title', v, section)}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                    <LocalizedInput
                                                        label="Subtitle"
                                                        value={content.section_headers?.[section]?.subtitle}
                                                        onChange={(v) => updateField('section_headers', 'subtitle', v, section)}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PreviewLayout>
    );
};

export default AdminSiteContent;
