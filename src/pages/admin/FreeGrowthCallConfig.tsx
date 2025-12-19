
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { Save, Plus, Trash2, ArrowLeft, Loader2, Globe, Clock, MessageSquare, CheckCircle, Image as ImageIcon, Calendar, Briefcase, Sparkles, HelpCircle, Star, ShieldCheck } from 'lucide-react';
import { AssetPickerModal } from '../../components/admin/assets/AssetPickerModal';
import { useStatusModal } from '../../hooks/useStatusModal';
import { LocalizedInput, LocalizedTextArea } from '../../components/admin/LocalizedFormFields';
import { SupportedLanguage } from '../../utils/localization';
import { AdminLoader } from '../../components/admin/AdminLoader';

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
        checklist: ['30 min Discovery', 'Strategy Roadmap', 'Expert Insights']
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

    // Image Picker State
    const [pickerOpen, setPickerOpen] = useState(false);
    const [activeImageField, setActiveImageField] = useState<{
        type: 'logo' | 'testimonial_image' | 'video_thumbnail' | 'process_image' | 'trust_avatar';
        index: number;
    } | null>(null);

    const handleImageSelect = (url: string) => {
        if (!activeImageField) return;

        if (activeImageField.type === 'logo') {
            const newLogos = [...(data.trustedLogos || [])];
            if (activeImageField.index === -1) {
                // Add new
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
        }
        setPickerOpen(false);
        setActiveImageField(null);
    };

    const openPicker = (type: 'logo' | 'testimonial_image' | 'video_thumbnail' | 'process_image' | 'trust_avatar', index: number) => {
        setActiveImageField({ type, index });
        setPickerOpen(true);
    };
    const [activeTab, setActiveTab] = useState<'hero' | 'booking' | 'expect' | 'process' | 'faq' | 'social' | 'logos' | 'finalCta'>('hero');
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en'); // Simplified for now, can use LanguageTabs
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
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                </button>
            }
        >
            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    {[
                        { id: 'hero', label: 'Hero Section', icon: Globe },
                        { id: 'booking', label: 'Booking Settings', icon: Calendar },
                        { id: 'expect', label: 'What to Expect', icon: Briefcase },
                        { id: 'process', label: 'Process Steps', icon: Sparkles },
                        { id: 'social', label: 'Success Stories', icon: MessageSquare },
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
                    {activeTab === 'hero' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tag Pill Text</label>
                                    <input
                                        type="text"
                                        value={data.hero.tagPill?.[activeLanguage] || ''}
                                        onChange={e => handleHeroChange('tagPill', e.target.value)}
                                        className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                                        placeholder="Trusted by 500+ teams"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Headline</label>
                                    <p className="text-xs text-slate-500 mb-2">Use **text** to highlight in blue. Example: Schedule a **free growth call**</p>
                                    <input
                                        type="text"
                                        value={data.hero.title?.[activeLanguage] || ''}
                                        onChange={e => handleHeroChange('title', e.target.value)}
                                        className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subheadline</label>
                                    <textarea
                                        value={data.hero.description?.[activeLanguage] || ''}
                                        onChange={e => handleHeroChange('description', e.target.value)}
                                        className="w-full p-2 border rounded-lg h-24 dark:bg-slate-900 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">CTA Button Text</label>
                                    <input
                                        type="text"
                                        value={data.hero.ctaText?.[activeLanguage] || ''}
                                        onChange={e => handleHeroChange('ctaText', e.target.value)}
                                        className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
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
                                                    <input
                                                        value={stat.label?.[activeLanguage] || ''}
                                                        onChange={(e) => {
                                                            const newStats = [...(data.hero.stats || [])];
                                                            newStats[index] = {
                                                                ...newStats[index],
                                                                label: { ...newStats[index].label, [activeLanguage]: e.target.value }
                                                            };
                                                            setData({ ...data, hero: { ...data.hero, stats: newStats } });
                                                        }}
                                                        placeholder="Label"
                                                        className="w-full p-1.5 border rounded text-sm dark:bg-slate-800 dark:border-slate-600"
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
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Calendar Status Text</label>
                                    <input
                                        type="text"
                                        value={data.booking?.statusText?.[activeLanguage] || ''}
                                        onChange={(e) => setData({ ...data, booking: { ...data.booking, statusText: { ...data.booking.statusText, [activeLanguage]: e.target.value } } })}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
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
                                    <label className="block text-sm font-medium mb-1">Section Title</label>
                                    <input
                                        value={data.expect?.sectionTitle?.[activeLanguage] || ''}
                                        onChange={(e) => setData({ ...data, expect: { ...data.expect, sectionTitle: { ...data.expect.sectionTitle, [activeLanguage]: e.target.value } } })}
                                        className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Section Description</label>
                                    <textarea
                                        value={data.expect?.sectionDescription?.[activeLanguage] || ''}
                                        onChange={(e) => setData({ ...data, expect: { ...data.expect, sectionDescription: { ...data.expect.sectionDescription, [activeLanguage]: e.target.value } } })}
                                        className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 h-20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Checklist Items</label>
                                    <div className="space-y-2">
                                        {(data.expect?.checklist || []).map((item: string, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                                <input
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newChecklist = [...data.expect.checklist];
                                                        newChecklist[idx] = e.target.value;
                                                        setData({ ...data, expect: { ...data.expect, checklist: newChecklist } });
                                                    }}
                                                    className="flex-1 p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newChecklist = [...data.expect.checklist];
                                                        newChecklist.splice(idx, 1);
                                                        setData({ ...data, expect: { ...data.expect, checklist: newChecklist } });
                                                    }}
                                                    className="p-2 text-red-500"
                                                ><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setData({ ...data, expect: { ...data.expect, checklist: [...(data.expect.checklist || []), 'New Item'] } })}
                                            className="text-xs text-blue-600 font-medium"
                                        >+ Add Item</button>
                                    </div>
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
                                    <div className="grid gap-4">
                                        <input
                                            value={item.title?.[activeLanguage] || ''}
                                            onChange={(e) => handleChange('whatToExpect', 'title', e.target.value, index, activeLanguage)}
                                            placeholder="Title"
                                            className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 font-medium"
                                        />
                                        <textarea
                                            value={item.description?.[activeLanguage] || ''}
                                            onChange={(e) => handleChange('whatToExpect', 'description', e.target.value, index, activeLanguage)}
                                            placeholder="Description"
                                            className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm h-20"
                                        />
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
                                    <label className="block text-sm font-medium mb-1">Section Badge</label>
                                    <input
                                        value={data.processBadge?.[activeLanguage] || ''}
                                        onChange={(e) => setData({ ...data, processBadge: { ...data.processBadge, [activeLanguage]: e.target.value } })}
                                        className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
                                        placeholder="Execution"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Section Title</label>
                                    <input
                                        value={data.processTitle?.[activeLanguage] || ''}
                                        onChange={(e) => setData({ ...data, processTitle: { ...data.processTitle, [activeLanguage]: e.target.value } })}
                                        className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
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
                                                <input
                                                    value={item.step?.[activeLanguage] || ''}
                                                    onChange={(e) => handleChange('process', 'step', e.target.value, index, activeLanguage)}
                                                    placeholder="Step Label"
                                                    className="w-1/3 p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm"
                                                />
                                                <input
                                                    value={item.title?.[activeLanguage] || ''}
                                                    onChange={(e) => handleChange('process', 'title', e.target.value, index, activeLanguage)}
                                                    placeholder="Step Title"
                                                    className="w-2/3 p-2 border rounded dark:bg-slate-800 dark:border-slate-600 font-medium"
                                                />
                                            </div>
                                            <textarea
                                                value={item.description?.[activeLanguage] || ''}
                                                onChange={(e) => handleChange('process', 'description', e.target.value, index, activeLanguage)}
                                                placeholder="Description"
                                                className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm h-20"
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
                                <label className="block text-sm font-medium mb-1">Section Title</label>
                                <input
                                    value={data.faqTitle?.[activeLanguage] || ''}
                                    onChange={(e) => setData({ ...data, faqTitle: { ...data.faqTitle, [activeLanguage]: e.target.value } })}
                                    className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
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
                                        <input
                                            value={item.question?.[activeLanguage] || ''}
                                            onChange={(e) => handleChange('faq', 'question', e.target.value, index, activeLanguage)}
                                            placeholder="Question"
                                            className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 font-medium"
                                        />
                                        <textarea
                                            value={item.answer?.[activeLanguage] || ''}
                                            onChange={(e) => handleChange('faq', 'answer', e.target.value, index, activeLanguage)}
                                            placeholder="Answer"
                                            className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm h-24"
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
                                            <textarea
                                                value={item.quote?.[activeLanguage] || ''}
                                                onChange={(e) => handleChange('testimonials', 'quote', e.target.value, index, activeLanguage)}
                                                placeholder="Client Quote"
                                                className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm h-20"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    value={item.author?.[activeLanguage] || ''}
                                                    onChange={(e) => handleChange('testimonials', 'author', e.target.value, index, activeLanguage)}
                                                    placeholder="Client Name"
                                                    className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm"
                                                />
                                                <input
                                                    value={item.role?.[activeLanguage] || ''}
                                                    onChange={(e) => handleChange('testimonials', 'role', e.target.value, index, activeLanguage)}
                                                    placeholder="Role / Company"
                                                    className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm"
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
                                    <label className="block text-sm font-medium mb-1">Section Title</label>
                                    <input
                                        value={data.videoTestimonial?.sectionTitle?.[activeLanguage] || ''}
                                        onChange={(e) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, sectionTitle: { ...data.videoTestimonial.sectionTitle, [activeLanguage]: e.target.value } } })}
                                        className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 mb-4"
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
                                                <label className="block text-sm font-medium mb-1">Featured Quote</label>
                                                <textarea
                                                    value={data.videoTestimonial?.quote?.[activeLanguage] || ''}
                                                    onChange={(e) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, quote: { ...data.videoTestimonial.quote, [activeLanguage]: e.target.value } } })}
                                                    className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm h-20"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    value={data.videoTestimonial?.author?.[activeLanguage] || ''}
                                                    onChange={(e) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, author: { ...data.videoTestimonial.author, [activeLanguage]: e.target.value } } })}
                                                    placeholder="Author Name"
                                                    className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm"
                                                />
                                                <input
                                                    value={data.videoTestimonial?.role?.[activeLanguage] || ''}
                                                    onChange={(e) => setData({ ...data, videoTestimonial: { ...data.videoTestimonial, role: { ...data.videoTestimonial.role, [activeLanguage]: e.target.value } } })}
                                                    placeholder="Role"
                                                    className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600 text-sm"
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
                                <label className="block text-sm font-medium mb-1">Section Title</label>
                                <input
                                    value={data.logosTitle?.[activeLanguage] || ''}
                                    onChange={(e) => setData({ ...data, logosTitle: { ...data.logosTitle, [activeLanguage]: e.target.value } })}
                                    className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
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
                                    <label className="block text-sm font-medium mb-1">Headline</label>
                                    <input
                                        type="text"
                                        value={data.finalCta?.title?.[activeLanguage] || ''}
                                        onChange={e => setData({ ...data, finalCta: { ...data.finalCta, title: { ...data.finalCta.title, [activeLanguage]: e.target.value } } })}
                                        className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Button Text</label>
                                    <input
                                        type="text"
                                        value={data.finalCta?.buttonText?.[activeLanguage] || ''}
                                        onChange={e => setData({ ...data, finalCta: { ...data.finalCta, buttonText: { ...data.finalCta.buttonText, [activeLanguage]: e.target.value } } })}
                                        className="w-full p-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <StatusModal />
            <AssetPickerModal
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={handleImageSelect}
            />
        </AdminPageLayout>
    );
};

export default AdminFreeGrowthCallConfig;
