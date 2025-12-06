import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Loader2, Layout, LayoutTemplate, Globe, Info, Users, Briefcase, Phone, FileText, List } from 'lucide-react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { LanguageTabs, LocalizedInput, LocalizedTextArea, LocalizedArrayInput } from '../../components/admin/LocalizedFormFields';
import PreviewLayout from '../../components/admin/PreviewLayout';
import { SupportedLanguage, createEmptyLocalizedString, LocalizedString } from '../../utils/localization';

const TABS = [
    { id: 'hero', label: 'Home Hero', icon: LayoutTemplate },
    { id: 'footer', label: 'Footer', icon: Layout },
    { id: 'about', label: 'About Us', icon: Users },
    { id: 'process', label: 'Process', icon: List },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'team_page', label: 'Team Page', icon: Users },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'section_headers', label: 'Section Headers', icon: Info },
];

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


    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_content', 'main'), {
                ...content,
                updatedAt: serverTimestamp()
            });
            alert("Site content updated successfully!");
        } catch (error) {
            console.error("Error saving content:", error);
            alert("Failed to save content.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
    );

    return (
        <AdminPageLayout
            title="Site Content"
            description="Manage global content for all static pages."
            actions={
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Running Save...
                </button>
            }
        >
            <PreviewLayout previewData={content} section={activeTab} showPreview={false}>
                <div className="space-y-6">
                    {/* Language Selector */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <Globe size={16} />
                            <span>Editing Language</span>
                        </div>
                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                    </div>

                    {/* Section Tabs */}
                    <div className="flex overflow-x-auto gap-2 pb-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-700'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Active Tab Content */}
                    <div className="anime-fade-in">
                        {/* --- HERO TAB --- */}
                        {activeTab === 'hero' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg hover:text-blue-500 transition-colors">Main Hero Text</h3>
                                    <LocalizedInput
                                        label="Badge Text"
                                        value={content.hero?.badge}
                                        onChange={(val) => handleChange('hero', 'badge', val)}
                                        activeLanguage={activeLanguage}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <LocalizedInput label="Button 1" value={content.hero?.cta_consultation} onChange={(val) => handleChange('hero', 'cta_consultation', val)} activeLanguage={activeLanguage} />
                                        <LocalizedInput label="Button 2" value={content.hero?.cta_showreel} onChange={(val) => handleChange('hero', 'cta_showreel', val)} activeLanguage={activeLanguage} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- FOOTER TAB --- */}
                        {activeTab === 'footer' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <LocalizedTextArea label="Tagline" value={content.footer?.tagline_desc} onChange={(val) => handleChange('footer', 'tagline_desc', val)} activeLanguage={activeLanguage} rows={2} />
                                    <LocalizedInput label="Copyright" value={content.footer?.copyright} onChange={(val) => handleChange('footer', 'copyright', val)} activeLanguage={activeLanguage} />
                                </div>
                            </div>
                        )}

                        {/* --- ABOUT US TAB --- */}
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Hero Section</h3>
                                    <LocalizedInput label="Badge" value={content.about?.hero?.badge} onChange={(val) => handleChange('about', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Title" value={content.about?.hero?.title} onChange={(val) => handleChange('about', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Highlight" value={content.about?.hero?.highlight} onChange={(val) => handleChange('about', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                    <LocalizedTextArea label="Description" value={content.about?.hero?.description} onChange={(val) => handleChange('about', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Our Story</h3>
                                    <LocalizedInput label="Title" value={content.about?.story?.title} onChange={(val) => handleChange('about', 'story', val, 'title')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Highlight" value={content.about?.story?.title_highlight} onChange={(val) => handleChange('about', 'story', val, 'title_highlight')} activeLanguage={activeLanguage} />
                                    <LocalizedTextArea label="Paragraph 1" value={content.about?.story?.p1} onChange={(val) => handleChange('about', 'story', val, 'p1')} activeLanguage={activeLanguage} rows={4} />
                                    <LocalizedTextArea label="Paragraph 2" value={content.about?.story?.p2} onChange={(val) => handleChange('about', 'story', val, 'p2')} activeLanguage={activeLanguage} rows={4} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Company Values</h3>
                                    {['innovation', 'client', 'quality'].map(key => (
                                        <div key={key} className="p-4 border rounded-lg dark:border-slate-700">
                                            <h4 className="font-bold capitalize mb-2">{key}</h4>
                                            <LocalizedInput label="Title" value={content.about?.values?.[key]?.title} onChange={(val) => handleChange('about', 'values', val, key, 'title')} activeLanguage={activeLanguage} />
                                            <LocalizedTextArea label="Description" value={content.about?.values?.[key]?.desc} onChange={(val) => handleChange('about', 'values', val, key, 'desc')} activeLanguage={activeLanguage} rows={2} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- PROCESS TAB --- */}
                        {activeTab === 'process' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Hero Section</h3>
                                    <LocalizedInput label="Badge" value={content.process?.hero?.badge} onChange={(val) => handleChange('process', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Title" value={content.process?.hero?.title} onChange={(val) => handleChange('process', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Highlight" value={content.process?.hero?.highlight} onChange={(val) => handleChange('process', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                    <LocalizedTextArea label="Description" value={content.process?.hero?.description} onChange={(val) => handleChange('process', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg ml-2">Process Steps</h3>
                                    {content.process?.steps?.map((step: any, index: number) => (
                                        <div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                            <div className="font-bold text-slate-400">Step {index + 1}</div>
                                            <LocalizedInput label="Title" value={step.title} onChange={(val) => handleArrayChange('process', 'steps', index, 'title', val)} activeLanguage={activeLanguage} />
                                            <LocalizedTextArea label="Description" value={step.description} onChange={(val) => handleArrayChange('process', 'steps', index, 'description', val)} activeLanguage={activeLanguage} />

                                            <div className="mt-4">
                                                <label className="text-sm font-medium">Details List</label>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
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
                        )}

                        {/* --- CAREERS TAB --- */}
                        {activeTab === 'careers' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Hero Section</h3>
                                    <LocalizedInput label="Badge" value={content.careers?.hero?.badge} onChange={(val) => handleChange('careers', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Title" value={content.careers?.hero?.title} onChange={(val) => handleChange('careers', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Highlight" value={content.careers?.hero?.highlight} onChange={(val) => handleChange('careers', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                    <LocalizedTextArea label="Description" value={content.careers?.hero?.description} onChange={(val) => handleChange('careers', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Open Positions Header</h3>
                                    <LocalizedInput label="Title" value={content.careers?.open_positions?.title} onChange={(val) => handleChange('careers', 'open_positions', val, 'title')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Highlight" value={content.careers?.open_positions?.highlight} onChange={(val) => handleChange('careers', 'open_positions', val, 'highlight')} activeLanguage={activeLanguage} />
                                </div>
                            </div>
                        )}

                        {/* --- TEAM PAGE TAB --- */}
                        {activeTab === 'team_page' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Hero Section</h3>
                                    <LocalizedInput label="Badge" value={content.team_page?.hero?.badge} onChange={(val) => handleChange('team_page', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Title" value={content.team_page?.hero?.title} onChange={(val) => handleChange('team_page', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Highlight" value={content.team_page?.hero?.highlight} onChange={(val) => handleChange('team_page', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                    <LocalizedTextArea label="Description" value={content.team_page?.hero?.description} onChange={(val) => handleChange('team_page', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">CTA Section</h3>
                                    <LocalizedInput label="Title" value={content.team_page?.cta?.title} onChange={(val) => handleChange('team_page', 'cta', val, 'title')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Highlight" value={content.team_page?.cta?.highlight} onChange={(val) => handleChange('team_page', 'cta', val, 'highlight')} activeLanguage={activeLanguage} />
                                    <LocalizedTextArea label="Description" value={content.team_page?.cta?.description} onChange={(val) => handleChange('team_page', 'cta', val, 'description')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Button 1" value={content.team_page?.cta?.start_project} onChange={(val) => handleChange('team_page', 'cta', val, 'start_project')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Button 2" value={content.team_page?.cta?.learn_more} onChange={(val) => handleChange('team_page', 'cta', val, 'learn_more')} activeLanguage={activeLanguage} />
                                </div>
                            </div>
                        )}

                        {/* --- CONTACT TAB --- */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Hero Section</h3>
                                    <LocalizedInput label="Badge" value={content.contact?.hero?.badge} onChange={(val) => handleChange('contact', 'hero', val, 'badge')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Title" value={content.contact?.hero?.title} onChange={(val) => handleChange('contact', 'hero', val, 'title')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Highlight" value={content.contact?.hero?.highlight} onChange={(val) => handleChange('contact', 'hero', val, 'highlight')} activeLanguage={activeLanguage} />
                                    <LocalizedTextArea label="Description" value={content.contact?.hero?.description} onChange={(val) => handleChange('contact', 'hero', val, 'description')} activeLanguage={activeLanguage} />
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                    <h3 className="font-semibold text-lg text-blue-600">Info Labels</h3>
                                    <LocalizedInput label="Email Label" value={content.contact?.info_labels?.email} onChange={(val) => handleChange('contact', 'info_labels', val, 'email')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Call Label" value={content.contact?.info_labels?.call} onChange={(val) => handleChange('contact', 'info_labels', val, 'call')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Visit Label" value={content.contact?.info_labels?.visit} onChange={(val) => handleChange('contact', 'info_labels', val, 'visit')} activeLanguage={activeLanguage} />
                                    <LocalizedInput label="Response Time" value={content.contact?.info_labels?.response_time} onChange={(val) => handleChange('contact', 'info_labels', val, 'response_time')} activeLanguage={activeLanguage} />
                                </div>
                            </div>
                        )}

                        {/* --- SECTION HEADERS TAB --- */}
                        {activeTab === 'section_headers' && (
                            <div className="space-y-6">
                                {['testimonials', 'team', 'projects', 'faq'].map(section => (
                                    <div key={section} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                                        <h3 className="font-semibold text-lg hover:text-blue-500 transition-colors capitalize">{section} Header</h3>
                                        <LocalizedInput
                                            label="Badge"
                                            value={content.section_headers?.[section]?.badge}
                                            onChange={(val) => handleChange('section_headers', section, val, 'badge')}
                                            activeLanguage={activeLanguage}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        )}
                    </div>
                </div>
            </PreviewLayout>
        </AdminPageLayout>
    );
};

export default AdminSiteContent;
