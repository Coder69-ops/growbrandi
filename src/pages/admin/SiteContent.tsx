import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Loader2, Layout, LayoutTemplate, Globe, Info, Users, Briefcase, Phone, FileText, List, Sparkles, Box } from 'lucide-react';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { LanguageTabs, LocalizedInput, LocalizedTextArea } from '../../components/admin/LocalizedFormFields';
import PreviewLayout from '../../components/admin/PreviewLayout';
import { SupportedLanguage, LocalizedString } from '../../utils/localization';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';

const TABS = [
    { id: 'hero', label: 'Home Hero', icon: LayoutTemplate },
    { id: 'section_headers', label: 'Section Headers', icon: Info },
    { id: 'about', label: 'About Us', icon: Users },
    { id: 'process', label: 'Process', icon: List },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'team_page', label: 'Team Page', icon: Users },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'tools', label: 'Tools', icon: Sparkles },
    { id: 'footer', label: 'Footer', icon: Layout },
];

import { ImageUpload } from '../../components/admin/ImageUpload';

const TRANSLATE_OPTIONS: Record<string, string[]> = {
    hero: ['hero.badge', 'hero.title_prefix', 'hero.title_highlight', 'hero.description', 'hero.cta_consultation', 'hero.cta_showreel'],
    footer: ['footer.tagline_desc', 'footer.copyright'],
    about: [
        'about.hero.badge', 'about.hero.title', 'about.hero.highlight', 'about.hero.description',
        'about.story.title', 'about.story.title_highlight', 'about.story.p1', 'about.story.p2',
        'about.values.innovation.title', 'about.values.innovation.desc',
        'about.values.client.title', 'about.values.client.desc',
        'about.values.quality.title', 'about.values.quality.desc'
    ],
    process: ['process.hero.badge', 'process.hero.title', 'process.hero.highlight', 'process.hero.description'],
    careers: ['careers.hero.badge', 'careers.hero.title', 'careers.hero.highlight', 'careers.hero.description', 'careers.open_positions.title', 'careers.open_positions.highlight'],
    team_page: ['team_page.hero.badge', 'team_page.hero.title', 'team_page.hero.highlight', 'team_page.hero.description', 'team_page.cta.title', 'team_page.cta.highlight', 'team_page.cta.description', 'team_page.cta.start_project', 'team_page.cta.learn_more'],
    contact: ['contact.hero.badge', 'contact.hero.title', 'contact.hero.highlight', 'contact.hero.description', 'contact.info_labels.email', 'contact.info_labels.call', 'contact.info_labels.visit', 'contact.info_labels.response_time'],
    section_headers: [
        'section_headers.services.badge', 'section_headers.services.title', 'section_headers.services.highlight', 'section_headers.services.description',
        'section_headers.testimonials.badge', 'section_headers.testimonials.title', 'section_headers.testimonials.highlight', 'section_headers.testimonials.description',
        'section_headers.team.badge', 'section_headers.team.title', 'section_headers.team.highlight', 'section_headers.team.description',
        'section_headers.projects.badge', 'section_headers.projects.title', 'section_headers.projects.highlight', 'section_headers.projects.description',
        'section_headers.faq.badge', 'section_headers.faq.title', 'section_headers.faq.highlight', 'section_headers.faq.description'
    ],
    tools: [
        'tools.slogan.badge', 'tools.slogan.title', 'tools.slogan.highlight', 'tools.slogan.description',
        'tools.use_cases.badge', 'tools.use_cases.title', 'tools.use_cases.highlight', 'tools.use_cases.description'
    ]
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
        {
            deepKeys: TRANSLATE_OPTIONS[activeTab] || []
        }
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
                    <PreviewLayout previewData={content} section={activeTab} showPreview={false}>
                        <div className="space-y-6">
                            {/* Top Controls */}
                            < div className="card p-3 flex flex-col lg:flex-row gap-4 lg:items-center justify-between sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm" >
                                <div className="flex-1 min-w-0 flex overflow-x-auto gap-2 max-w-full pb-2 md:pb-0 no-scrollbar">
                                    {TABS.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <tab.icon size={16} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="hidden lg:block w-px bg-slate-200 dark:bg-slate-700 h-8 mx-2"></div>
                                <div className="w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
                                    <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                                </div>
                            </div >

                            {/* Active Tab Content */}
                            < div className="anime-fade-in" >
                                {/* --- HERO TAB --- */}
                                {
                                    activeTab === 'hero' && (
                                        <div className="space-y-6">
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                                    <LayoutTemplate size={20} className="text-blue-500" />
                                                    Main Hero Text
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LocalizedInput
                                                        label="Badge Text"
                                                        value={content.hero?.badge}
                                                        onChange={(val) => handleChange('hero', 'badge', val)}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                    <div className="hidden md:block"></div> {/* Spacer */}
                                                    <LocalizedInput
                                                        label="Title Prefix"
                                                        value={content.hero?.title_prefix}
                                                        onChange={(val) => handleChange('hero', 'title_prefix', val)}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                    <LocalizedInput
                                                        label="Title Highlight"
                                                        value={content.hero?.title_highlight}
                                                        onChange={(val) => handleChange('hero', 'title_highlight', val)}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                </div>
                                                <LocalizedTextArea
                                                    label="Description"
                                                    value={content.hero?.description}
                                                    onChange={(val) => handleChange('hero', 'description', val)}
                                                    activeLanguage={activeLanguage}
                                                    rows={3}
                                                />
                                                <div className="pt-2">
                                                    <ImageUpload
                                                        label="Background Image (Optional)"
                                                        value={content.hero?.bg_image}
                                                        onChange={(val) => handleChange('hero', 'bg_image', val)}
                                                        folder="site_content/hero"
                                                    />
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                                        <ImageUpload
                                                            label="Phone Screen Image"
                                                            value={content.hero?.phone_screen_image}
                                                            onChange={(val) => handleChange('hero', 'phone_screen_image', val)}
                                                            folder="site_content/hero"
                                                        />
                                                        <ImageUpload
                                                            label="Phone Profile Image"
                                                            value={content.hero?.phone_profile_image}
                                                            onChange={(val) => handleChange('hero', 'phone_profile_image', val)}
                                                            folder="site_content/hero"
                                                        />
                                                        <ImageUpload
                                                            label="Trustpilot Logo"
                                                            value={content.hero?.trustpilot_logo}
                                                            onChange={(val) => handleChange('hero', 'trustpilot_logo', val)}
                                                            folder="site_content/hero"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LocalizedInput label="Button 1 (Consultation)" value={content.hero?.cta_consultation} onChange={(val) => handleChange('hero', 'cta_consultation', val)} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Button 2 (Showreel)" value={content.hero?.cta_showreel} onChange={(val) => handleChange('hero', 'cta_showreel', val)} activeLanguage={activeLanguage} />
                                                </div>
                                            </div>

                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                                    <Users size={20} className="text-emerald-500" />
                                                    Trusted By Logos
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                                        <div key={i}>
                                                            <ImageUpload
                                                                label={`Partner Logo ${i}`}
                                                                value={content.hero?.partners?.[`logo_${i}`]}
                                                                onChange={(val) => handleChange('hero', 'partners', val, `logo_${i}`)}
                                                                folder="site_content/partners"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                {/* --- FOOTER TAB --- */}
                                {
                                    activeTab === 'footer' && (
                                        <div className="glass-panel p-6 space-y-6">
                                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                                                <Layout size={20} className="text-slate-500" />
                                                Footer Content
                                            </h3>
                                            <LocalizedTextArea label="Tagline" value={content.footer?.tagline_desc} onChange={(val) => handleChange('footer', 'tagline_desc', val)} activeLanguage={activeLanguage} rows={2} />
                                            <LocalizedInput label="Copyright Text" value={content.footer?.copyright} onChange={(val) => handleChange('footer', 'copyright', val)} activeLanguage={activeLanguage} />
                                        </div>
                                    )
                                }

                                {/* --- ABOUT US TAB --- */}
                                {
                                    activeTab === 'about' && (
                                        <div className="space-y-6">
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Info size={18} /> Hero Section
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <LocalizedInput label="Badge" value={content.about?.hero?.badge} onChange={(val) => handleChange('about', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Title" value={content.about?.hero?.title} onChange={(val) => handleChange('about', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.about?.hero?.highlight} onChange={(val) => handleChange('about', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <LocalizedTextArea label="Description" value={content.about?.hero?.description} onChange={(val) => handleChange('about', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                                <div className="pt-2">
                                                    <ImageUpload
                                                        label="Background Image (Optional)"
                                                        value={content.about?.hero?.bg_image}
                                                        onChange={(val) => handleChange('about', 'hero', val, 'bg_image')}
                                                        folder="site_content/about"
                                                    />
                                                </div>
                                            </div>

                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Users size={18} /> Our Story
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LocalizedInput label="Title" value={content.about?.story?.title} onChange={(val) => handleChange('about', 'story', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.about?.story?.title_highlight} onChange={(val) => handleChange('about', 'story', val, 'title_highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LocalizedTextArea label="Paragraph 1" value={content.about?.story?.p1} onChange={(val) => handleChange('about', 'story', val, 'p1')} activeLanguage={activeLanguage} rows={4} />
                                                    <LocalizedTextArea label="Paragraph 2" value={content.about?.story?.p2} onChange={(val) => handleChange('about', 'story', val, 'p2')} activeLanguage={activeLanguage} rows={4} />
                                                </div>
                                            </div>

                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Sparkles size={18} /> Company Values
                                                </h3>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    {['innovation', 'client', 'quality'].map(key => (
                                                        <div key={key} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                                            <h4 className="font-bold capitalize mb-4 text-slate-700 dark:text-slate-300">{key}</h4>
                                                            <div className="space-y-4">
                                                                <LocalizedInput label="Title" value={content.about?.values?.[key]?.title} onChange={(val) => handleChange('about', 'values', val, key, 'title')} activeLanguage={activeLanguage} />
                                                                <LocalizedTextArea label="Description" value={content.about?.values?.[key]?.desc} onChange={(val) => handleChange('about', 'values', val, key, 'desc')} activeLanguage={activeLanguage} rows={3} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                {/* --- PROCESS TAB --- */}
                                {
                                    activeTab === 'process' && (
                                        <div className="space-y-6">
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <List size={18} /> Hero Section
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <LocalizedInput label="Badge" value={content.process?.hero?.badge} onChange={(val) => handleChange('process', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Title" value={content.process?.hero?.title} onChange={(val) => handleChange('process', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.process?.hero?.highlight} onChange={(val) => handleChange('process', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <LocalizedTextArea label="Description" value={content.process?.hero?.description} onChange={(val) => handleChange('process', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                                <div className="pt-2">
                                                    <ImageUpload
                                                        label="Background Image (Optional)"
                                                        value={content.process?.hero?.bg_image}
                                                        onChange={(val) => handleChange('process', 'hero', val, 'bg_image')}
                                                        folder="site_content/process"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-lg ml-2 text-slate-900 dark:text-white">Process Steps</h3>
                                                {content.process?.steps?.map((step: any, index: number) => (
                                                    <div key={index} className="glass-panel p-6 space-y-6">
                                                        <div className="font-bold text-slate-400 flex items-center gap-2">
                                                            <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm">
                                                                {index + 1}
                                                            </span>
                                                            Step {index + 1}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <LocalizedInput label="Title" value={step.title} onChange={(val) => handleArrayChange('process', 'steps', index, 'title', val)} activeLanguage={activeLanguage} />
                                                            <LocalizedTextArea label="Description" value={step.description} onChange={(val) => handleArrayChange('process', 'steps', index, 'description', val)} activeLanguage={activeLanguage} rows={3} />
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-medium mb-3 block text-slate-700 dark:text-slate-300">Details List</label>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {step.details?.map((detail: LocalizedString, dIndex: number) => (
                                                                    <LocalizedInput
                                                                        key={dIndex}
                                                                        label={`Detail ${dIndex + 1}`}
                                                                        value={detail}
                                                                        onChange={(val) => handleArrayDetailChange('process', 'steps', index, dIndex, val)}
                                                                        activeLanguage={activeLanguage}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                }

                                {/* --- CAREERS TAB --- */}
                                {
                                    activeTab === 'careers' && (
                                        <div className="space-y-6">
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Briefcase size={18} /> Hero Section
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <LocalizedInput label="Badge" value={content.careers?.hero?.badge} onChange={(val) => handleChange('careers', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Title" value={content.careers?.hero?.title} onChange={(val) => handleChange('careers', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.careers?.hero?.highlight} onChange={(val) => handleChange('careers', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <LocalizedTextArea label="Description" value={content.careers?.hero?.description} onChange={(val) => handleChange('careers', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                                <div className="pt-2">
                                                    <ImageUpload
                                                        label="Background Image (Optional)"
                                                        value={content.careers?.hero?.bg_image}
                                                        onChange={(val) => handleChange('careers', 'hero', val, 'bg_image')}
                                                        folder="site_content/careers"
                                                    />
                                                </div>
                                            </div>
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600">Open Positions Header</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LocalizedInput label="Title" value={content.careers?.open_positions?.title} onChange={(val) => handleChange('careers', 'open_positions', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.careers?.open_positions?.highlight} onChange={(val) => handleChange('careers', 'open_positions', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                {/* --- TEAM PAGE TAB --- */}
                                {
                                    activeTab === 'team_page' && (
                                        <div className="space-y-6">
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Users size={18} /> Hero Section
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <LocalizedInput label="Badge" value={content.team_page?.hero?.badge} onChange={(val) => handleChange('team_page', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Title" value={content.team_page?.hero?.title} onChange={(val) => handleChange('team_page', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.team_page?.hero?.highlight} onChange={(val) => handleChange('team_page', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <LocalizedTextArea label="Description" value={content.team_page?.hero?.description} onChange={(val) => handleChange('team_page', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                                <div className="pt-2">
                                                    <ImageUpload
                                                        label="Background Image (Optional)"
                                                        value={content.team_page?.hero?.bg_image}
                                                        onChange={(val) => handleChange('team_page', 'hero', val, 'bg_image')}
                                                        folder="site_content/team"
                                                    />
                                                </div>
                                            </div>
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Box size={18} /> CTA Section
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LocalizedInput label="Title" value={content.team_page?.cta?.title} onChange={(val) => handleChange('team_page', 'cta', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.team_page?.cta?.highlight} onChange={(val) => handleChange('team_page', 'cta', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <LocalizedTextArea label="Description" value={content.team_page?.cta?.description} onChange={(val) => handleChange('team_page', 'cta', val, 'description')} activeLanguage={activeLanguage} />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LocalizedInput label="Button 1" value={content.team_page?.cta?.start_project} onChange={(val) => handleChange('team_page', 'cta', val, 'start_project')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Button 2" value={content.team_page?.cta?.learn_more} onChange={(val) => handleChange('team_page', 'cta', val, 'learn_more')} activeLanguage={activeLanguage} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                {/* --- CONTACT TAB --- */}
                                {
                                    activeTab === 'contact' && (
                                        <div className="space-y-6">
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Phone size={18} /> Hero Section
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <LocalizedInput label="Badge" value={content.contact?.hero?.badge} onChange={(val) => handleChange('contact', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Title" value={content.contact?.hero?.title} onChange={(val) => handleChange('contact', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.contact?.hero?.highlight} onChange={(val) => handleChange('contact', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <LocalizedTextArea label="Description" value={content.contact?.hero?.description} onChange={(val) => handleChange('contact', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                                <div className="pt-2">
                                                    <ImageUpload
                                                        label="Background Image (Optional)"
                                                        value={content.contact?.hero?.bg_image}
                                                        onChange={(val) => handleChange('contact', 'hero', val, 'bg_image')}
                                                        folder="site_content/contact"
                                                    />
                                                </div>
                                            </div>
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Info size={18} /> Info Labels
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <LocalizedInput label="Email Label" value={content.contact?.info_labels?.email} onChange={(val) => handleChange('contact', 'info_labels', val, 'email')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Call Label" value={content.contact?.info_labels?.call} onChange={(val) => handleChange('contact', 'info_labels', val, 'call')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Visit Label" value={content.contact?.info_labels?.visit} onChange={(val) => handleChange('contact', 'info_labels', val, 'visit')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Response Time" value={content.contact?.info_labels?.response_time} onChange={(val) => handleChange('contact', 'info_labels', val, 'response_time')} activeLanguage={activeLanguage} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                {/* --- SECTION HEADERS TAB --- */}
                                {
                                    activeTab === 'section_headers' && (
                                        <div className="space-y-6">
                                            {['services', 'testimonials', 'team', 'projects', 'faq'].map(section => (
                                                <div key={section} className="glass-panel p-6 space-y-4">
                                                    <h3 className="font-semibold text-lg hover:text-blue-500 transition-colors capitalize flex items-center gap-2">
                                                        <Info size={18} className="text-slate-400" />
                                                        {section} Header
                                                    </h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                        <LocalizedInput
                                                            label="Badge"
                                                            value={content.section_headers?.[section]?.badge}
                                                            onChange={(val) => handleChange('section_headers', section, val, 'badge')}
                                                            activeLanguage={activeLanguage}
                                                        />
                                                        <LocalizedInput
                                                            label="Title"
                                                            value={content.section_headers?.[section]?.title}
                                                            onChange={(val) => handleChange('section_headers', section, val, 'title')}
                                                            activeLanguage={activeLanguage}
                                                        />
                                                        <LocalizedInput
                                                            label="Highlight"
                                                            value={content.section_headers?.[section]?.highlight}
                                                            onChange={(val) => handleChange('section_headers', section, val, 'highlight')}
                                                            activeLanguage={activeLanguage}
                                                        />
                                                    </div>
                                                    <LocalizedTextArea
                                                        label="Description"
                                                        value={content.section_headers?.[section]?.description}
                                                        onChange={(val) => handleChange('section_headers', section, val, 'description')}
                                                        activeLanguage={activeLanguage}
                                                        rows={2}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }

                                {/* --- TOOLS TAB --- */}
                                {
                                    activeTab === 'tools' && (
                                        <div className="space-y-6">
                                            {/* Slogan Generator */}
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Sparkles size={18} /> Slogan Generator
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <LocalizedInput label="Badge" value={content.tools?.slogan?.badge} onChange={(val) => handleChange('tools', 'slogan', val, 'badge')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Title" value={content.tools?.slogan?.title} onChange={(val) => handleChange('tools', 'slogan', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.tools?.slogan?.highlight} onChange={(val) => handleChange('tools', 'slogan', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <LocalizedTextArea label="Description" value={content.tools?.slogan?.description} onChange={(val) => handleChange('tools', 'slogan', val, 'description')} activeLanguage={activeLanguage} rows={2} />
                                                <div className="pt-2">
                                                    <ImageUpload
                                                        label="Background Image (Optional)"
                                                        value={content.tools?.slogan?.bg_image}
                                                        onChange={(val) => handleChange('tools', 'slogan', val, 'bg_image')}
                                                        folder="site_content/tools"
                                                    />
                                                </div>
                                            </div>

                                            {/* AI Use Cases */}
                                            <div className="glass-panel p-6 space-y-6">
                                                <h3 className="font-semibold text-lg text-blue-600 flex items-center gap-2">
                                                    <Sparkles size={18} /> AI Use Cases
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <LocalizedInput label="Badge" value={content.tools?.use_cases?.badge} onChange={(val) => handleChange('tools', 'use_cases', val, 'badge')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Title" value={content.tools?.use_cases?.title} onChange={(val) => handleChange('tools', 'use_cases', val, 'title')} activeLanguage={activeLanguage} />
                                                    <LocalizedInput label="Highlight" value={content.tools?.use_cases?.highlight} onChange={(val) => handleChange('tools', 'use_cases', val, 'highlight')} activeLanguage={activeLanguage} />
                                                </div>
                                                <LocalizedTextArea label="Description" value={content.tools?.use_cases?.description} onChange={(val) => handleChange('tools', 'use_cases', val, 'description')} activeLanguage={activeLanguage} rows={2} />
                                            </div>
                                        </div>
                                    )
                                }
                            </div >
                        </div >
                    </PreviewLayout >
                )
            }
            <StatusModal />
        </AdminPageLayout >
    );
};

export default AdminSiteContent;
