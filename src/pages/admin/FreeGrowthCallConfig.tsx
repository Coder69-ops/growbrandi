import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { Save, Plus, Trash2, ArrowLeft, Loader2, Globe, Clock, MessageSquare, CheckCircle, Image as ImageIcon, Calendar, Briefcase, Sparkles, HelpCircle, Star, ShieldCheck } from 'lucide-react';
import { AssetPickerModal } from '../../components/admin/assets/AssetPickerModal';
import { useStatusModal } from '../../hooks/useStatusModal';
import { LocalizedInput, LocalizedTextArea, LocalizedArrayInput, LanguageTabs } from '../../components/admin/LocalizedFormFields';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { SupportedLanguage } from '../../utils/localization';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useContentGenerator } from '../../hooks/useContentGenerator';
import { ContentGeneratorModal } from '../../components/admin/ContentGeneratorModal';
import { Wand2 } from 'lucide-react'; // Import Wand icon

const TRANSLATE_OPTIONS: Record<string, { fields?: string[], deepKeys?: string[], arrayFields?: string[], complexArrayFields?: Record<string, string[]> }> = {
    hero: {
        deepKeys: ['hero.title', 'hero.description', 'hero.ctaText', 'hero.tagPill'],
        complexArrayFields: { 'hero.stats': ['label'] }
    },
    booking: {
        deepKeys: ['booking.statusText']
    },
    expect: {
        deepKeys: ['expect.sectionTitle', 'expect.sectionDescription'],
        arrayFields: ['expect.checklist'],
        complexArrayFields: { 'whatToExpect': ['title', 'description'] }
    },
    process: {
        fields: ['processBadge', 'processTitle'],
        complexArrayFields: { 'process': ['step', 'title', 'description'] }
    },
    faq: {
        fields: ['faqTitle'],
        complexArrayFields: { 'faq': ['question', 'answer'] }
    },
    testimonials: {
        complexArrayFields: { 'testimonials': ['quote', 'author', 'role'] },
        deepKeys: ['videoTestimonial.sectionTitle', 'videoTestimonial.quote', 'videoTestimonial.author', 'videoTestimonial.role']
    },
    logos: {
        fields: ['logosTitle']
    },
    heroSlider: {
        complexArrayFields: { 'heroSlider': ['content', 'author', 'role', 'actionLabel'] }
    },
    finalCta: {
        deepKeys: ['finalCta.title', 'finalCta.buttonText']
    }
};

const DEFAULT_DATA = {
    hero: {
        title: { en: 'Schedule a **free growth call**' },
        description: { en: 'Talk with a growth expert and get a tailored roadmap.' },
        ctaText: { en: 'Book your free call' },

        tagPill: { en: 'Trusted by 500+ teams' },
        trustAvatars: [],
        stats: [
            { number: '500+', label: { en: 'SaaS Teams' } },
            { number: '300%', label: { en: 'Avg. Growth' } }
        ]
    },
    heroSlider: [
        {
            type: 'review',
            content: { en: 'They helped us grow 300% in 3 months. Truly transformative.' },
            author: { en: 'Jane Doe' },
            role: { en: 'CEO, TechCorp' },
            image: ''
        }
    ],
    booking: {
        enabled: true,
        notificationEmail: '',
        slotDuration: 30,
        startHour: 9,
        endHour: 17,
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        statusText: { en: 'Real-time availability • Verified' }
    },
    testimonials: [
        {
            quote: { en: 'They helped us grow 300% in 3 months.' },
            author: { en: 'Jane Doe' },
            role: { en: 'CEO, TechCorp' },
            clientImage: ''
        }
    ],
    logosTitle: { en: 'TRUSTED BY INDUSTRY LEADERS' },
    trustedLogos: [],
    expect: {
        sectionTitle: { en: 'What happens on the call?' },
        sectionDescription: { en: 'No hard selling. This is a strategy session designed to uncover gaps and identify high-leverage opportunities.' },
        checklist: [
            { en: '30 min Discovery' },
            { en: 'Strategy Roadmap' },
            { en: 'Expert Insights' }
        ]
    },
    whatToExpect: [
        { title: { en: 'Project Overview' }, description: { en: 'We analyze your current setup.' } },
        { title: { en: 'Expert Feedback' }, description: { en: 'Get actionable advice.' } }
    ],
    processBadge: { en: 'Execution' },
    processTitle: { en: 'From chaos to growth in 4 steps' },
    process: [
        { step: { en: 'Step 1' }, title: { en: 'Choose Focus' }, description: { en: 'Select your main goal.' } },
        { step: { en: 'Step 2' }, title: { en: 'Share Details' }, description: { en: 'Fill out our intake form.' } }
    ],
    faqTitle: { en: 'Frequently Asked Questions' },
    faq: [
        { question: { en: 'What should I prepare?' }, answer: { en: 'Just your website URL and goals.' } }
    ],
    videoTestimonial: {
        sectionTitle: { en: 'Why founders trust us' },
        thumbnailUrl: '',
        videoUrl: '',
        quote: { en: '"Best decision we made this year."' },
        author: { en: 'John Smith' },
        role: { en: 'Founder, Startup' }
    },
    finalCta: {
        title: { en: 'Ready to scale your business?' },
        buttonText: { en: 'Claim your free slot' }
    }
};

const AdminFreeGrowthCallConfig = () => {
    const [data, setData] = useState<any>(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'hero' | 'heroSlider' | 'booking' | 'expect' | 'process' | 'faq' | 'social' | 'logos' | 'finalCta'>('hero');
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    // Image Picker State
    const [pickerOpen, setPickerOpen] = useState(false);
    const [activeImageField, setActiveImageField] = useState<{
        type: 'logo' | 'testimonial_image' | 'video_thumbnail' | 'process_image' | 'trust_avatar' | 'expect_image' | 'hero_slider_image';
        index: number;
    } | null>(null);

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        data,
        setData,
        TRANSLATE_OPTIONS[activeTab as keyof typeof TRANSLATE_OPTIONS] || {}
    );

    const {
        isGenerating,
        generatorOpen,
        handleOpenGenerator,
        handleCloseGenerator,
        handleGenerateContent
    } = useContentGenerator(data, setData);

    const { showSuccess, showError, StatusModal } = useStatusModal();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, 'pages', 'free-growth-call');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData({ ...DEFAULT_DATA, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ... (rest of code) ...

    const handleImageSelect = (url: string) => {
        if (!activeImageField) return;

        if (activeImageField.type === 'logo') {
            // ... existing logo logic ...
            const newLogos = [...(data.trustedLogos || [])];
            if (activeImageField.index === -1) {
                newLogos.push(url);
            } else {
                newLogos[activeImageField.index] = url;
            }
            setData({ ...data, trustedLogos: newLogos });
        } else if (activeImageField.type === 'testimonial_image') {
            const newTestimonials = [...(data.testimonials || [])];
            if (!newTestimonials[activeImageField.index]) {
                newTestimonials[activeImageField.index] = { clientImage: url };
            } else {
                newTestimonials[activeImageField.index].clientImage = url;
            }
            setData({ ...data, testimonials: newTestimonials });
        } else if (activeImageField.type === 'hero_slider_image') {
            const newSlider = [...(data.heroSlider || [])];
            if (!newSlider[activeImageField.index]) {
                newSlider[activeImageField.index] = { image: url };
            } else {
                newSlider[activeImageField.index].image = url;
            }
            setData({ ...data, heroSlider: newSlider });
        } else if (activeImageField.type === 'video_thumbnail') {
            setData({ ...data, videoTestimonial: { ...data.videoTestimonial, thumbnailUrl: url } });
        } else if (activeImageField.type === 'process_image') {
            const newProcess = [...(data.process || [])];
            if (!newProcess[activeImageField.index]) {
                newProcess[activeImageField.index] = { image: url };
            } else {
                newProcess[activeImageField.index].image = url;
            }
            setData({ ...data, process: newProcess });

        } else if (activeImageField.type === 'trust_avatar') {
            const newAvatars = [...(data.hero.trustAvatars || [])];
            if (activeImageField.index === -1) {
                newAvatars.push(url);
            } else {
                newAvatars[activeImageField.index] = url;
            }
            setData({ ...data, hero: { ...data.hero, trustAvatars: newAvatars } });
        } else if (activeImageField.type === 'expect_image') {
            const newExpectItems = [...(data.whatToExpect || [])];
            if (!newExpectItems[activeImageField.index]) {
                newExpectItems[activeImageField.index] = { icon: url };
            } else {
                newExpectItems[activeImageField.index].icon = url;
            }
            setData({ ...data, whatToExpect: newExpectItems });
        }
        setPickerOpen(false);
        setActiveImageField(null);
    };

    const openPicker = (type: 'logo' | 'testimonial_image' | 'video_thumbnail' | 'process_image' | 'trust_avatar' | 'expect_image' | 'hero_slider_image', index: number) => {
        setActiveImageField({ type, index });
        setPickerOpen(true);
    };

    const handleChange = (section: string, field: string, value: any, index?: number, subField?: string) => {
        setData((prev: any) => {
            const newData = { ...prev };
            if (index !== undefined && subField) {
                // Array handling
                const newArray = [...(newData[section] || [])];
                if (!newArray[index]) newArray[index] = {};
                // Handle clientImage directly if it's not localized
                if (field === 'clientImage') {
                    newArray[index] = { ...newArray[index], [field]: value };
                } else {
                    newArray[index] = { ...newArray[index], [field]: { ...newArray[index][field], [subField]: value } }; // Assumes localized field inside array object
                }
                // Fix for non-localized fields in array if needed, but assuming localized for now based on structure
                if (subField === 'en' && typeof newArray[index][field] !== 'object') {
                    // Fallback/Special case if structure is different
                }
                newData[section] = newArray;
            } else if (index !== undefined) {
                // Array flat field - not currently used with this structure
            } else {
                // Object field (e.g., hero section)
                if (!newData[section]) newData[section] = {};
                if (typeof newData[section][field] === 'object' && newData[section][field] !== null) {
                    newData[section][field] = { ...newData[section][field], [activeLanguage]: value };
                } else {
                    newData[section][field] = value;
                }
            }
            return newData;
        });
    };

    // Simplified specific changers
    const handleHeroChange = (field: string, value: string) => {
        setData((prev: any) => ({
            ...prev,
            hero: {
                ...prev.hero,
                [field]: typeof prev.hero[field] === 'object' ? { ...prev.hero[field], [activeLanguage]: value } : value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'pages', 'free-growth-call'), {
                ...data,
                updatedAt: serverTimestamp()
            });
            showSuccess('Saved', 'Page configuration updated.');
        } catch (error) {
            showError('Error', 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AdminLoader message="Loading page config..." />;

    return (
        <AdminPageLayout
            title="Free Growth Call Landing Page"
            description="Manage content for the consultation booking page."
            actions={
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleOpenGenerator}
                        disabled={saving || isGenerating}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        title="Auto-generate page content with AI"
                    >
                        <Wand2 size={18} className={isGenerating ? "animate-pulse" : ""} />
                        <span className="hidden sm:inline">Auto Generate</span>
                    </button>
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
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            }
        >
            <ContentGeneratorModal
                isOpen={generatorOpen}
                onClose={handleCloseGenerator}
                onGenerate={handleGenerateContent}
                isGenerating={isGenerating}
            />
            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    {[
                        { id: 'hero', label: 'Hero Section', icon: Globe },
                        { id: 'heroSlider', label: 'Hero Slider (Social)', icon: MessageSquare },
                        { id: 'booking', label: 'Booking Settings', icon: Calendar },
                        { id: 'expect', label: 'What to Expect', icon: Briefcase },
                        { id: 'process', label: 'Process Steps', icon: Sparkles },
                        { id: 'social', label: 'Success Stories', icon: Star },
                        { id: 'logos', label: 'Trusted Logos', icon: ShieldCheck },
                        { id: 'faq', label: 'FAQs', icon: HelpCircle },
                        { id: 'finalCta', label: 'Final CTA', icon: ArrowLeft },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                } `}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            {/* Breadcrumb or Title if needed */}
                        </div>
                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                    </div>

                    {activeTab === 'hero' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                            <div className="space-y-4">
                                <div>
                                    <LocalizedInput
                                        label="Tag Pill Text"
                                        value={data.hero.tagPill}
                                        onChange={(val) => setData({ ...data, hero: { ...data.hero, tagPill: val } })}
                                        activeLanguage={activeLanguage}
                                        placeholder="Trusted by 500+ teams"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-2">Use **text** to highlight in blue. Example: Schedule a **free growth call**</p>
                                    <LocalizedInput
                                        label="Headline"
                                        value={data.hero.title}
                                        onChange={(val) => setData({ ...data, hero: { ...data.hero, title: val } })}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>
                                <div>
                                    <LocalizedTextArea
                                        label="Subheadline"
                                        value={data.hero.description}
                                        onChange={(val) => setData({ ...data, hero: { ...data.hero, description: val } })}
                                        activeLanguage={activeLanguage}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <LocalizedInput
                                        label="CTA Button Text"
                                        value={data.hero.ctaText}
                                        onChange={(val) => setData({ ...data, hero: { ...data.hero, ctaText: val } })}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                    <h4 className="font-medium text-sm mb-3">Trust Avatars (Pill)</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {(data.hero.trustAvatars || []).map((url: string, index: number) => (
                                            <div key={index} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 relative group">
                                                <img src={url} alt="Trust" className="w-full h-full rounded-full object-cover" />
                                                <button
                                                    onClick={() => {
                                                        const newAvatars = [...(data.hero.trustAvatars || [])];
                                                        newAvatars.splice(index, 1);
                                                        setData({ ...data, hero: { ...data.hero, trustAvatars: newAvatars } });
                                                    }}
                                                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={10} />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => openPicker('trust_avatar', -1)}
                                            className="w-10 h-10 rounded-full border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-colors"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                    <h4 className="font-medium text-sm mb-3">Key Stats</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(data.hero.stats || []).map((stat: any, index: number) => (
                                            <div key={index} className="p-3 border rounded-lg dark:border-slate-700 relative group">
                                                <button
                                                    onClick={() => {
                                                        const newStats = [...(data.hero.stats || [])];
                                                        newStats.splice(index, 1);
                                                        setData({ ...data, hero: { ...data.hero, stats: newStats } });
                                                    }}
                                                    className="absolute top-1 right-1 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <div className="grid gap-2">
                                                    <input
                                                        value={stat.number}
                                                        onChange={(e) => {
                                                            const newStats = [...(data.hero.stats || [])];
                                                            newStats[index] = { ...newStats[index], number: e.target.value };
                                                            setData({ ...data, hero: { ...data.hero, stats: newStats } });
                                                        }}
                                                        placeholder="500+"
                                                        className="w-full p-1.5 border rounded text-sm dark:bg-slate-800 dark:border-slate-600"
                                                    />
                                                    <LocalizedInput
                                                        label="Label"
                                                        value={stat.label}
                                                        onChange={(val) => {
                                                            const newStats = [...(data.hero.stats || [])];
                                                            newStats[index] = { ...newStats[index], label: val };
                                                            setData({ ...data, hero: { ...data.hero, stats: newStats } });
                                                        }}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setData({ ...data, hero: { ...data.hero, stats: [...(data.hero.stats || []), { number: '100%', label: { en: 'New Stat' } }] } })}
                                            className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center p-4 text-sm text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                                        >
                                            <Plus size={16} /> Add Stat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'heroSlider' && (
                        <div className="space-y-6">
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg flex gap-3 text-yellow-800 dark:text-yellow-200 text-sm mb-6 border border-yellow-200 dark:border-yellow-900/30">
                                <Sparkles className="shrink-0" size={20} />
                                <div>
                                    <strong>Hero Auto-Slider</strong>
                                    <p className="opacity-90 mt-1">
                                        This slider replaces the static quote in the hero section. You can mix reviews, special offers, and service highlights.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {(data.heroSlider || []).map((item: any, index: number) => (
                                    <div key={index} className="p-4 border rounded-lg dark:border-slate-700 bg-white dark:bg-slate-900/50 relative group transition-all hover:shadow-md">
                                        <button
                                            onClick={() => {
                                                const newArray = [...(data.heroSlider || [])];
                                                newArray.splice(index, 1);
                                                setData({ ...data, heroSlider: newArray });
                                            }}
                                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            title="Remove Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Image / Icon Picker */}
                                            <div className="shrink-0">
                                                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">
                                                    {item.type === 'review' ? 'Author Photo' : 'Icon / Image'}
                                                </label>
                                                <div
                                                    className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors group/img"
                                                    onClick={() => {
                                                        setActiveImageField({ type: 'testimonial_image', index }); // Reusing existing type logic, or need to add new type
                                                        // Quick fix: let's reuse logic by adding a "hero_slider_image" type or similar.
                                                        // Actually, I need to update handleImageSelect to support this new type.
                                                        // Let's call it 'hero_slider_image' and update handleImageSelect separately.
                                                        openPicker('hero_slider_image' as any, index);
                                                    }}
                                                >
                                                    {item.image ? (
                                                        <img src={item.image} alt="Item" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="text-slate-400" />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity text-white font-medium text-xs text-center p-1">
                                                        Change
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-4">
                                                {/* Type Selector */}
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Item Type</label>
                                                    <div className="flex gap-2">
                                                        {['review', 'offer', 'service'].map(t => (
                                                            <button
                                                                key={t}
                                                                onClick={() => {
                                                                    const newArray = [...(data.heroSlider || [])];
                                                                    newArray[index] = { ...newArray[index], type: t };
                                                                    setData({ ...data, heroSlider: newArray });
                                                                }}
                                                                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${item.type === t
                                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700'
                                                                    }`}
                                                            >
                                                                {t}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <LocalizedTextArea
                                                    label={item.type === 'review' ? "Review Content / Quote" : "Description / Content"}
                                                    value={item.content}
                                                    onChange={(val) => {
                                                        const newArray = [...(data.heroSlider || [])];
                                                        newArray[index] = { ...newArray[index], content: val };
                                                        setData({ ...data, heroSlider: newArray });
                                                    }}
                                                    activeLanguage={activeLanguage}
                                                    rows={2}
                                                />

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <LocalizedInput
                                                        label={item.type === 'review' ? "Author Name" : "Title / Heading"}
                                                        value={item.author}
                                                        onChange={(val) => {
                                                            const newArray = [...(data.heroSlider || [])];
                                                            newArray[index] = { ...newArray[index], author: val };
                                                            setData({ ...data, heroSlider: newArray });
                                                        }}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                    <LocalizedInput
                                                        label={item.type === 'review' ? "Role / Company" : "Subtitle / Badge"}
                                                        value={item.role}
                                                        onChange={(val) => {
                                                            const newArray = [...(data.heroSlider || [])];
                                                            newArray[index] = { ...newArray[index], role: val };
                                                            setData({ ...data, heroSlider: newArray });
                                                        }}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                </div>

                                                {item.type !== 'review' && (
                                                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                                                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Call to Action (Optional)</label>
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={item.actionLabel || ''}
                                                                    onChange={(e) => {
                                                                        const newArray = [...(data.heroSlider || [])];
                                                                        newArray[index] = { ...newArray[index], actionLabel: e.target.value };
                                                                        setData({ ...data, heroSlider: newArray });
                                                                    }}
                                                                    placeholder="Button Text (e.g. Learn More)"
                                                                    className="w-full text-sm p-2 border rounded dark:bg-slate-900 dark:border-slate-600"
                                                                />
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={item.actionUrl || ''}
                                                                    onChange={(e) => {
                                                                        const newArray = [...(data.heroSlider || [])];
                                                                        newArray[index] = { ...newArray[index], actionUrl: e.target.value };
                                                                        setData({ ...data, heroSlider: newArray });
                                                                    }}
                                                                    placeholder="URL (e.g. /services)"
                                                                    className="w-full text-sm p-2 border rounded dark:bg-slate-900 dark:border-slate-600"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setData({
                                        ...data,
                                        heroSlider: [...(data.heroSlider || []), {
                                            type: 'review',
                                            content: { en: 'New Item' },
                                            author: { en: 'Name' },
                                            role: { en: 'Role' },
                                            image: ''
                                        }]
                                    })}
                                    className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-medium hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50/50 transition-all"
                                >
                                    <Plus size={18} /> Add Slider Item
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'booking' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 text-blue-800 dark:text-blue-200 text-sm mb-6">
                                <Clock className="shrink-0" size={20} />
                                <div>
                                    <strong>Real-time Availability Configuration</strong>
                                    <p className="opacity-90 mt-1">These settings control the public-facing booking calendar. Changes apply immediately.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Start Hour (24h)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0" max="23"
                                            value={data.booking?.startHour || 9}
                                            onChange={(e) => setData({ ...data, booking: { ...data.booking, startHour: parseInt(e.target.value) } })}
                                            className="w-full pl-10 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                            placeholder="9"
                                        />
                                        <div className="absolute left-3 top-2.5 text-slate-400 text-xs">AM</div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Hour of day to start showing slots (e.g. 9 for 9 AM)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">End Hour (24h)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0" max="23"
                                            value={data.booking?.endHour || 17}
                                            onChange={(e) => setData({ ...data, booking: { ...data.booking, endHour: parseInt(e.target.value) } })}
                                            className="w-full pl-10 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                            placeholder="17"
                                        />
                                        <div className="absolute left-3 top-2.5 text-slate-400 text-xs">PM</div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Hour of day to stop showing slots (e.g. 17 for 5 PM)</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Slot Duration (minutes)</label>
                                    <select
                                        value={data.booking?.slotDuration || 30}
                                        onChange={(e) => setData({ ...data, booking: { ...data.booking, slotDuration: parseInt(e.target.value) } })}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                    >
                                        <option value="15">15 Minutes</option>
                                        <option value="30">30 Minutes</option>
                                        <option value="45">45 Minutes</option>
                                        <option value="60">1 Hour (60 Minutes)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Notification Email</label>
                                    <input
                                        type="email"
                                        value={data.booking?.notificationEmail || ''}
                                        onChange={(e) => setData({ ...data, booking: { ...data.booking, notificationEmail: e.target.value } })}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                        placeholder="alerts@growbrandi.com"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Receive alerts when a booking is confirmed.</p>
                                </div>
                                <div>
                                    <LocalizedInput
                                        label="Calendar Status Text"
                                        value={data.booking?.statusText}
                                        onChange={(val) => setData({ ...data, booking: { ...data.booking, statusText: val } })}
                                        activeLanguage={activeLanguage}
                                        placeholder="Real-time availability • Verified"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'expect' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">What to Expect</h3>

                            <div className="grid gap-4 p-4 border rounded-lg dark:border-slate-700 bg-blue-50/30 dark:bg-blue-900/10">
                                <div>
                                    <LocalizedInput
                                        label="Section Title"
                                        value={data.expect?.sectionTitle}
                                        onChange={(val) => setData({ ...data, expect: { ...data.expect, sectionTitle: val } })}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>
                                <div>
                                    <LocalizedTextArea
                                        label="Section Description"
                                        value={data.expect?.sectionDescription}
                                        onChange={(val) => setData({ ...data, expect: { ...data.expect, sectionDescription: val } })}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>
                                <div>
                                    <LocalizedArrayInput
                                        label="Checklist Items"
                                        value={data.expect?.checklist || []}
                                        onChange={(val) => setData({ ...data, expect: { ...data.expect, checklist: val } })}
                                        activeLanguage={activeLanguage}
                                        placeholder="Checklist Item"
                                    />
                                </div>
                            </div>

                            <h4 className="font-medium mt-8">Cards (Visual Items)</h4>
                            {(data.whatToExpect || []).map((item: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 relative group">
                                    <button
                                        onClick={() => {
                                            const newArray = [...data.whatToExpect];
                                            newArray.splice(index, 1);
                                            setData({ ...data, whatToExpect: newArray });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="flex gap-4">
                                        <div
                                            className="w-16 h-16 shrink-0 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors"
                                            onClick={() => openPicker('expect_image', index)}
                                        >
                                            {item.icon ? (
                                                <img src={item.icon} alt="Icon" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="text-slate-400" />
                                            )}
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium text-xs text-center p-1">
                                                Add Icon
                                            </div>
                                        </div>
                                        <div className="grid gap-4 flex-1">
                                            <LocalizedInput
                                                label="Title"
                                                value={item.title}
                                                onChange={(val) => {
                                                    const newArray = [...data.whatToExpect];
                                                    newArray[index] = { ...newArray[index], title: val };
                                                    setData({ ...data, whatToExpect: newArray });
                                                }}
                                                activeLanguage={activeLanguage}
                                            />
                                            <LocalizedTextArea
                                                label="Description"
                                                value={item.description}
                                                onChange={(val) => {
                                                    const newArray = [...data.whatToExpect];
                                                    newArray[index] = { ...newArray[index], description: val };
                                                    setData({ ...data, whatToExpect: newArray });
                                                }}
                                                activeLanguage={activeLanguage}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>


                            ))}
                            <button
                                onClick={() => setData({ ...data, whatToExpect: [...(data.whatToExpect || []), { title: { en: 'New Item' }, description: { en: 'Description' } }] })}
                                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                            >
                                <Plus size={16} /> Add Card
                            </button>
                        </div>
                    )}

                    {activeTab === 'process' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Process Steps</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <LocalizedInput
                                        label="Section Badge"
                                        value={data.processBadge}
                                        onChange={(val) => setData({ ...data, processBadge: val })}
                                        activeLanguage={activeLanguage}
                                        placeholder="Execution"
                                    />
                                </div>
                                <div>
                                    <LocalizedInput
                                        label="Section Title"
                                        value={data.processTitle}
                                        onChange={(val) => setData({ ...data, processTitle: val })}
                                        activeLanguage={activeLanguage}
                                        placeholder="From chaos to growth in 4 steps"
                                    />
                                </div>
                            </div>

                            {(data.process || []).map((item: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 relative group">
                                    <button
                                        onClick={() => {
                                            const newArray = [...data.process];
                                            newArray.splice(index, 1);
                                            setData({ ...data, process: newArray });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="flex gap-4">
                                        {/* Process Image */}
                                        <div
                                            className="w-24 h-24 shrink-0 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors"
                                            onClick={() => openPicker('process_image', index)}
                                        >
                                            {item.image ? (
                                                <img src={item.image} alt="Step" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="text-slate-400" />
                                            )}
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium text-xs text-center p-1">
                                                Add Image
                                            </div>
                                        </div>

                                        <div className="flex-1 grid gap-4">
                                            <div className="flex gap-4">
                                                <div className="w-1/3">
                                                    <LocalizedInput
                                                        label="Step Label"
                                                        value={item.step}
                                                        onChange={(val) => {
                                                            const newArray = [...data.process];
                                                            newArray[index] = { ...newArray[index], step: val };
                                                            setData({ ...data, process: newArray });
                                                        }}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                </div>
                                                <div className="w-2/3">
                                                    <LocalizedInput
                                                        label="Step Title"
                                                        value={item.title}
                                                        onChange={(val) => {
                                                            const newArray = [...data.process];
                                                            newArray[index] = { ...newArray[index], title: val };
                                                            setData({ ...data, process: newArray });
                                                        }}
                                                        activeLanguage={activeLanguage}
                                                    />
                                                </div>
                                            </div>
                                            <LocalizedTextArea
                                                label="Description"
                                                value={item.description}
                                                onChange={(val) => {
                                                    const newArray = [...data.process];
                                                    newArray[index] = { ...newArray[index], description: val };
                                                    setData({ ...data, process: newArray });
                                                }}
                                                activeLanguage={activeLanguage}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setData({ ...data, process: [...(data.process || []), { step: { en: 'Step X' }, title: { en: 'New Step' }, description: { en: 'Description' } }] })}
                                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                            >
                                <Plus size={16} /> Add Process Step
                            </button>
                        </div>
                    )}

                    {activeTab === 'faq' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                            <div>
                                <LocalizedInput
                                    label="Section Title"
                                    value={data.faqTitle}
                                    onChange={(val) => setData({ ...data, faqTitle: val })}
                                    activeLanguage={activeLanguage}
                                    placeholder="Common questions"
                                />
                            </div>
                            {(data.faq || []).map((item: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 relative group">
                                    <button
                                        onClick={() => {
                                            const newArray = [...data.faq];
                                            newArray.splice(index, 1);
                                            setData({ ...data, faq: newArray });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid gap-4">
                                        <LocalizedInput
                                            label="Question"
                                            value={item.question}
                                            onChange={(val) => {
                                                const newArray = [...data.faq];
                                                newArray[index] = { ...newArray[index], question: val };
                                                setData({ ...data, faq: newArray });
                                            }}
                                            activeLanguage={activeLanguage}
                                        />
                                        <LocalizedTextArea
                                            label="Answer"
                                            value={item.answer}
                                            onChange={(val) => {
                                                const newArray = [...data.faq];
                                                newArray[index] = { ...newArray[index], answer: val };
                                                setData({ ...data, faq: newArray });
                                            }}
                                            activeLanguage={activeLanguage}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setData({ ...data, faq: [...(data.faq || []), { question: { en: 'New Question' }, answer: { en: 'Answer' } }] })}
                                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                            >
                                <Plus size={16} /> Add FAQ
                            </button>
                        </div>
                    )}
                    {activeTab === 'social' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Client Success Stories (Why clients love us)</h3>
                            {(data.testimonials || []).map((item: any, index: number) => (
                                <div key={index} className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 relative group">
                                    <button
                                        onClick={() => {
                                            const newArray = [...data.testimonials];
                                            newArray.splice(index, 1);
                                            setData({ ...data, testimonials: newArray });
                                        }}
                                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <div className="grid md:grid-cols-[150px_1fr] gap-6">
                                        <div className="flex flex-col gap-2">
                                            <div
                                                className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors"
                                                onClick={() => openPicker('testimonial_image', index)}
                                            >
                                                {item.clientImage ? (
                                                    <img src={item.clientImage} alt="Client" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-slate-400" />
                                                )}
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium text-xs">
                                                    Change Photo
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid gap-4">
                                            <LocalizedTextArea
                                                label="Client Quote"
                                                value={item.quote}
                                                onChange={(val) => {
                                                    const newArray = [...data.testimonials];
                                                    newArray[index] = { ...newArray[index], quote: val };
                                                    setData({ ...data, testimonials: newArray });
                                                }}
                                                activeLanguage={activeLanguage}
                                                rows={3}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <LocalizedInput
                                                    label="Client Name"
                                                    value={item.author}
                                                    onChange={(val) => {
                                                        const newArray = [...data.testimonials];
                                                        newArray[index] = { ...newArray[index], author: val };
                                                        setData({ ...data, testimonials: newArray });
                                                    }}
                                                    activeLanguage={activeLanguage}
                                                />
                                                <LocalizedInput
                                                    label="Role / Company"
                                                    value={item.role}
                                                    onChange={(val) => {
                                                        const newArray = [...data.testimonials];
                                                        newArray[index] = { ...newArray[index], role: val };
                                                        setData({ ...data, testimonials: newArray });
                                                    }}
                                                    activeLanguage={activeLanguage}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setData({ ...data, testimonials: [...(data.testimonials || []), { quote: { en: 'Amazing results!' }, author: { en: 'John Doe' }, role: { en: 'CEO, Company' } }] })}
                                className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                            >
                                <Plus size={16} /> Add Testimonial
                            </button>

                            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                                <h3 className="text-lg font-semibold mb-4">Featured Video Testimonial</h3>
                                <div>
                                    <LocalizedInput
                                        label="Section Title"
                                        value={data.videoTestimonial?.sectionTitle}
                                        onChange={(val) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, sectionTitle: val } })}
                                        activeLanguage={activeLanguage}
                                        placeholder="Why founders trust us"
                                    />
                                </div>
                                <div className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                    <div className="grid md:grid-cols-[200px_1fr] gap-6">
                                        <div
                                            className="w-full aspect-video bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-colors"
                                            onClick={() => openPicker('video_thumbnail', -1)}
                                        >
                                            {data.videoTestimonial?.thumbnailUrl ? (
                                                <img src={data.videoTestimonial.thumbnailUrl} alt="Video Thumb" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center text-slate-400">
                                                    <ImageIcon className="mb-2" />
                                                    <span className="text-xs">Thumbnail</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium text-xs">
                                                Change Thumbnail
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Video Link (YouTube/Vimeo)</label>
                                                <input
                                                    value={data.videoTestimonial?.videoUrl || ''}
                                                    onChange={(e) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, videoUrl: e.target.value } })}
                                                    className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div>
                                                <LocalizedTextArea
                                                    label="Featured Quote"
                                                    value={data.videoTestimonial?.quote}
                                                    onChange={(val) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, quote: val } })}
                                                    activeLanguage={activeLanguage}
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <LocalizedInput
                                                    label="Author Name"
                                                    value={data.videoTestimonial?.author}
                                                    onChange={(val) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, author: val } })}
                                                    activeLanguage={activeLanguage}
                                                />
                                                <LocalizedInput
                                                    label="Role"
                                                    value={data.videoTestimonial?.role}
                                                    onChange={(val) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, role: val } })}
                                                    activeLanguage={activeLanguage}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logos' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Trusted Brand Logos</h3>
                            <div>
                                <LocalizedInput
                                    label="Section Title"
                                    value={data.logosTitle}
                                    onChange={(val) => setData({ ...data, logosTitle: val })}
                                    activeLanguage={activeLanguage}
                                    placeholder="TRUSTED BY INDUSTRY LEADERS"
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(data.trustedLogos || []).map((url: string, index: number) => (
                                    <div key={index} className="relative group aspect-video bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center p-4">
                                        <img src={url} alt="Logo" className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                                        <button
                                            onClick={() => {
                                                const newLogos = [...data.trustedLogos];
                                                newLogos.splice(index, 1);
                                                setData({ ...data, trustedLogos: newLogos });
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-black/50 rounded-full text-slate-600 dark:text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => openPicker('logo', index)}
                                            className="absolute bottom-2 right-2 p-1 bg-white/80 dark:bg-black/50 rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ImageIcon size={14} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => openPicker('logo', -1)}
                                    className="aspect-video border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors bg-slate-50 dark:bg-slate-900/50"
                                >
                                    <Plus size={24} className="mb-2" />
                                    <span className="text-sm font-medium">Add Logo</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'finalCta' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Final CTA Section</h3>
                            <div className="space-y-4">
                                <div>
                                    <LocalizedInput
                                        label="Headline"
                                        value={data.finalCta?.title}
                                        onChange={(val) => setData({ ...data, finalCta: { ...data.finalCta, title: val } })}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>
                                <div>
                                    <LocalizedInput
                                        label="Button Text"
                                        value={data.finalCta?.buttonText}
                                        onChange={(val) => setData({ ...data, finalCta: { ...data.finalCta, buttonText: val } })}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div >
            <StatusModal />
            <AssetPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleImageSelect}
            />
        </AdminPageLayout >
    );
};

export default AdminFreeGrowthCallConfig;
