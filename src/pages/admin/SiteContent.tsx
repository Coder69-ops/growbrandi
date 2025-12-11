import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../lib/firestore-audit';
import { Save, Loader2, Layout, LayoutTemplate, Globe, Info, Users, Briefcase, Phone, FileText, List, Sparkles, Box, Megaphone, Shield } from 'lucide-react';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { LanguageTabs, LocalizedInput, LocalizedTextArea } from '../../components/admin/LocalizedFormFields';
import PreviewLayout from '../../components/admin/PreviewLayout';
import { SupportedLanguage, LocalizedString } from '../../utils/localization';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';
import { ImageUpload } from '../../components/admin/ImageUpload';

import { HeroEditor } from '../../components/admin/site-content/HeroEditor';
import { SectionHeadersEditor } from '../../components/admin/site-content/SectionHeadersEditor';
import { AboutEditor } from '../../components/admin/site-content/AboutEditor';
import { ProcessEditor } from '../../components/admin/site-content/ProcessEditor';
import { CareersEditor } from '../../components/admin/site-content/CareersEditor';
import { TeamPageEditor } from '../../components/admin/site-content/TeamPageEditor';
import { ContactEditor } from '../../components/admin/site-content/ContactEditor';
import { ToolsEditor } from '../../components/admin/site-content/ToolsEditor';
import { FooterEditor } from '../../components/admin/site-content/FooterEditor';
import { BlogSettingsEditor } from '../../components/admin/site-content/BlogSettingsEditor';
import { LegalEditor } from '../../components/admin/site-content/LegalEditor';

const TABS = [
    { id: 'hero', label: 'Home Hero', icon: LayoutTemplate },
    { id: 'section_headers', label: 'Section Headers', icon: Info },
    { id: 'about', label: 'About Us', icon: Users },
    { id: 'process', label: 'Process', icon: List },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'team_page', label: 'Team Page', icon: Users },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'tools', label: 'Tools', icon: Sparkles },
    { id: 'blog_settings', label: 'Blog & Funnels', icon: Megaphone },
    { id: 'legal', label: 'Legal Pages', icon: Shield },
    { id: 'footer', label: 'Footer', icon: Layout },
];

const TRANSLATE_OPTIONS: Record<string, { deepKeys?: string[], complexArrayFields?: Record<string, string[]> }> = {
    hero: {
        deepKeys: ['hero.badge', 'hero.title_prefix', 'hero.title_highlight', 'hero.description', 'hero.cta_consultation', 'hero.cta_showreel']
    },
    footer: {
        deepKeys: ['footer.tagline_desc', 'footer.copyright']
    },
    about: {
        deepKeys: [
            'about.hero.badge', 'about.hero.title', 'about.hero.highlight', 'about.hero.description',
            'about.story.title', 'about.story.title_highlight', 'about.story.p1', 'about.story.p2',
            'about.values.innovation.title', 'about.values.innovation.desc',
            'about.values.client.title', 'about.values.client.desc',
            'about.values.quality.title', 'about.values.quality.desc'
        ]
    },
    process: {
        deepKeys: ['process.hero.badge', 'process.hero.title', 'process.hero.highlight', 'process.hero.description'],
        complexArrayFields: {
            'process.steps': ['step', 'description']
        }
    },
    careers: {
        deepKeys: ['careers.hero.badge', 'careers.hero.title', 'careers.hero.highlight', 'careers.hero.description', 'careers.open_positions.title', 'careers.open_positions.highlight']
    },
    team_page: {
        deepKeys: ['team_page.hero.badge', 'team_page.hero.title', 'team_page.hero.highlight', 'team_page.hero.description', 'team_page.cta.title', 'team_page.cta.highlight', 'team_page.cta.description', 'team_page.cta.start_project', 'team_page.cta.learn_more']
    },
    contact: {
        deepKeys: ['contact.hero.badge', 'contact.hero.title', 'contact.hero.highlight', 'contact.hero.description', 'contact.info_labels.email', 'contact.info_labels.call', 'contact.info_labels.visit', 'contact.info_labels.response_time']
    },
    section_headers: {
        deepKeys: [
            'section_headers.services.badge', 'section_headers.services.title', 'section_headers.services.highlight', 'section_headers.services.description',
            'section_headers.testimonials.badge', 'section_headers.testimonials.title', 'section_headers.testimonials.highlight', 'section_headers.testimonials.description',
            'section_headers.team.badge', 'section_headers.team.title', 'section_headers.team.highlight', 'section_headers.team.description',
            'section_headers.projects.badge', 'section_headers.projects.title', 'section_headers.projects.highlight', 'section_headers.projects.description',
            'section_headers.faq.badge', 'section_headers.faq.title', 'section_headers.faq.highlight', 'section_headers.faq.description'
        ]
    },
    tools: {
        deepKeys: [
            'tools.slogan.badge', 'tools.slogan.title', 'tools.slogan.highlight', 'tools.slogan.description',
            'tools.use_cases.badge', 'tools.use_cases.title', 'tools.use_cases.highlight', 'tools.use_cases.description'
        ]
    },
    blog_settings: {
        deepKeys: [
            'blog_settings.sidebar_cta.title', 'blog_settings.sidebar_cta.body', 'blog_settings.sidebar_cta.button_text', 'blog_settings.sidebar_cta.button_url',
            'blog_settings.inline_cta.title', 'blog_settings.inline_cta.body', 'blog_settings.inline_cta.button_text', 'blog_settings.inline_cta.button_url',
            'blog_settings.lead_magnet.title', 'blog_settings.lead_magnet.description', 'blog_settings.lead_magnet.button_text', 'blog_settings.lead_magnet.button_url',
            'blog_settings.labels.hero_read_article', 'blog_settings.labels.card_read_more'
        ]
    },
    legal: {
        deepKeys: ['legal.privacy.title', 'legal.privacy.last_updated', 'legal.terms.title', 'legal.terms.last_updated', 'legal.cookies.title', 'legal.cookies.last_updated'],
        complexArrayFields: {
            'legal.privacy.sections': ['title', 'content'],
            'legal.terms.sections': ['title', 'content'],
            'legal.cookies.sections': ['title', 'content']
        }
    }
};

const AdminSiteContent = () => {
    const [activeTab, setActiveTab] = useState('hero');
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');
    const [content, setContent] = useState<any>({
        hero: {},
        footer: {},
        section_headers: {},
        about: {},
        process: {},
        careers: {},
        team_page: {},
        contact: {}
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        content,
        setContent,
        TRANSLATE_OPTIONS[activeTab] || {}
    );

    // Fetch Content
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, 'site_content', 'main');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setContent(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching site content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, []);

    const handleChange = (section: string, field: string, newValue: any, nestedField?: string, deepNestedField?: string) => {
        setContent((prev: any) => {
            const newContent = { ...prev };

            if (!newContent[section]) newContent[section] = {};

            if (deepNestedField && nestedField) {
                if (!newContent[section][field]) newContent[section][field] = {};
                if (!newContent[section][field][nestedField]) newContent[section][field][nestedField] = {};
                newContent[section][field][nestedField][deepNestedField] = newValue;
            } else if (nestedField) {
                if (!newContent[section][field]) newContent[section][field] = {};
                if (!newContent[section][field][nestedField] && typeof newContent[section][field] === 'object') {
                    // Ensure it's an object before assigning
                }
                // Determine if we are assigning to an object property or replacing it
                if (!newContent[section][field]) newContent[section][field] = {};
                newContent[section][field][nestedField] = newValue;
            } else {
                newContent[section][field] = newValue;
            }
            return newContent;
        });
    };

    // Specific handler for arrays of objects (like Process Steps)
    const handleArrayChange = (section: string, arrayName: string, index: number, field: string, value: any) => {
        setContent((prev: any) => {
            const newContent = { ...prev };
            if (!newContent[section]) newContent[section] = {};
            if (!newContent[section][arrayName]) newContent[section][arrayName] = [];

            const newArray = [...newContent[section][arrayName]];
            if (!newArray[index]) newArray[index] = {};
            newArray[index] = { ...newArray[index], [field]: value };

            newContent[section][arrayName] = newArray;
            return newContent;
        });
    };

    // Specific handler for arrays of strings inside array objects (Process Step Details)
    const handleArrayDetailChange = (section: string, arrayName: string, stepIndex: number, detailIndex: number, value: any) => {
        setContent((prev: any) => {
            const newContent = { ...prev };
            const newArray = [...(newContent[section]?.[arrayName] || [])];
            if (!newArray[stepIndex]) return prev;

            const details = [...(newArray[stepIndex].details || [])];
            details[detailIndex] = value;

            newArray[stepIndex] = { ...newArray[stepIndex], details };
            newContent[section][arrayName] = newArray;
            return newContent;
        });
    };

    // Generic handler to ADD an item to an array
    const handleAddArrayItem = (section: string, arrayName: string, newItem: any) => {
        setContent((prev: any) => {
            const newContent = { ...prev };
            if (!newContent[section]) newContent[section] = {};
            if (!newContent[section][arrayName]) newContent[section][arrayName] = [];

            newContent[section][arrayName] = [...newContent[section][arrayName], newItem];
            return newContent;
        });
    };

    // Generic handler to REMOVE an item from an array
    const handleRemoveArrayItem = (section: string, arrayName: string, index: number) => {
        setContent((prev: any) => {
            const newContent = { ...prev };
            if (!newContent[section]?.[arrayName]) return prev;

            const newArray = [...newContent[section][arrayName]];
            newArray.splice(index, 1);

            newContent[section][arrayName] = newArray;
            return newContent;
        });
    };

    const { showSuccess, showError, StatusModal } = useStatusModal();

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_content', 'main'), {
                ...content,
                updatedAt: serverTimestamp()
            });
            showSuccess('Changes Saved', 'Site content has been updated successfully.');
        } catch (error) {
            console.error("Error saving content:", error);
            showError('Save Failed', 'There was an error saving your changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };


    return (
        <AdminPageLayout
            title="Site Content"
            description="Manage global content for all static pages."
            actions={
                !loading && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleAutoTranslate}
                            disabled={saving || isTranslating}
                            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50"
                            title={`Auto-translate ${activeTab} section`}
                        >
                            <Sparkles size={18} className={isTranslating ? "animate-spin" : ""} />
                            {isTranslating ? 'Translating...' : 'Auto Translate'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Changes
                        </button>
                    </div>
                )
            }
            fullHeight={true}
        >
            {
                loading ? (
                    <AdminLoader message="Loading site content..." />
                ) : (
                    <div className="h-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900/50">
                        {/* Sidebar Navigation */}
                        <div className="w-full md:w-64 shrink-0 bg-white dark:bg-slate-800 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 flex flex-nowrap md:flex-col overflow-x-auto md:overflow-y-auto p-4 gap-2 no-scrollbar md:h-full z-10 sticky top-0 md:relative">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal text-left
                                        ${activeTab === tab.id
                                            ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/10 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <div className={`p-1.5 rounded-lg ${activeTab === tab.id ? 'bg-white dark:bg-blue-800/30' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                                        <tab.icon size={18} />
                                    </div>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 min-w-0 overflow-y-auto h-full">
                            <PreviewLayout previewData={content} section={activeTab} showPreview={false}>
                                <div className="space-y-6 max-w-5xl mx-auto pb-20">
                                    {/* Language Selector Header */}
                                    <div className="flex items-center justify-between p-1">
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            {TABS.find(t => t.id === activeTab)?.icon && React.createElement(TABS.find(t => t.id === activeTab)!.icon, { size: 24, className: "text-blue-500" })}
                                            {TABS.find(t => t.id === activeTab)?.label}
                                        </h2>
                                        <div className="w-auto">
                                            <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                                        </div>
                                    </div>

                                    {/* Active Tab Content */}
                                    <div className="anime-fade-in">
                                        {activeTab === 'hero' && <HeroEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'section_headers' && <SectionHeadersEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'about' && <AboutEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'process' && (
                                            <ProcessEditor
                                                content={content}
                                                handleChange={handleChange}
                                                handleArrayChange={handleArrayChange}
                                                handleArrayDetailChange={handleArrayDetailChange}
                                                activeLanguage={activeLanguage}
                                                onAddStep={() => handleAddArrayItem('process', 'steps', {
                                                    title: { en: 'New Step', nl: 'Nieuwe Stap' },
                                                    description: { en: 'Description here', nl: 'Beschrijving hier' },
                                                    details: ['Detail 1', 'Detail 2']
                                                })}
                                                onRemoveStep={(index) => handleRemoveArrayItem('process', 'steps', index)}
                                            />
                                        )}
                                        {activeTab === 'careers' && <CareersEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'team_page' && <TeamPageEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'contact' && <ContactEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'tools' && <ToolsEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'footer' && <FooterEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'legal' && <LegalEditor content={content} handleChange={handleChange} activeLanguage={activeLanguage} />}
                                        {activeTab === 'blog_settings' && (
                                            <BlogSettingsEditor
                                                initialData={content}
                                                onSave={async (newData) => {
                                                    // Merge new blog settings into content state and save
                                                    setContent(newData);
                                                    await handleSave();
                                                }}
                                                saving={saving}
                                                activeLanguage={activeLanguage}
                                            />
                                        )}
                                    </div>
                                </div>
                            </PreviewLayout>
                        </div>
                    </div>
                )
            }
            <StatusModal />
        </AdminPageLayout>
    );
};

export default AdminSiteContent;
