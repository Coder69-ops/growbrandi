import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { setDoc } from '../../lib/firestore-audit';
import { Save, Globe, Phone, Mail, MapPin, BarChart3, Hash, Sticker, Loader2, Palette, Layout, Sparkles } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { SupportedLanguage, ensureLocalizedFormat } from '../../utils/localization';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';
import { ImageUpload } from '../../components/admin/ImageUpload';

const TABS = [
    { id: 'branding', label: 'Branding & Identity', icon: Palette },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'stats', label: 'Business Stats', icon: BarChart3 },
];

const AdminSettings = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('branding');
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    const { showSuccess, showError, StatusModal } = useStatusModal();

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'site_settings', 'main');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            } else {
                setSettings({
                    branding: {
                        logoLight: '',
                        logoDark: '',
                        favicon: ''
                    },
                    contact: {
                        email: '',
                        phone: '',
                        address: '',
                    },
                    social: { linkedin: '', tiktok: '', instagram: '', goodfirms: '', whatsapp: '' },
                    stats: [
                        { number: '150+', icon: '🚀', label: { en: 'Projects Completed' } },
                        { number: '50+', icon: '🤝', label: { en: 'Happy Clients' } },
                        { number: '5+', icon: '🌍', label: { en: 'Years Experience' } },
                        { number: '24/7', icon: '🕑', label: { en: 'Support' } }
                    ],
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_settings', 'main'), {
                ...settings,
                updatedAt: serverTimestamp(),
            });
            showSuccess('Settings Saved', 'Global settings have been updated.');
        } catch (error) {
            console.error("Error saving settings:", error);
            showError('Save Failed', 'Failed to save global settings.');
        } finally {
            setSaving(false);
        }
    };

    const updateBranding = (field: string, value: string) => {
        setSettings({ ...settings, branding: { ...settings.branding, [field]: value } });
    };

    const updateContact = (field: string, value: string) => {
        setSettings({ ...settings, contact: { ...settings.contact, [field]: value } });
    };

    const updateSocial = (platform: string, value: string) => {
        setSettings({ ...settings, social: { ...settings.social, [platform]: value } });
    };

    const updateStat = (index: number, field: string, value: any) => {
        const newStats = [...(settings.stats || [])];
        if (!newStats[index]) newStats[index] = {};
        newStats[index] = { ...newStats[index], [field]: value };
        setSettings({ ...settings, stats: newStats });
    };

    return (
        <AdminPageLayout
            title="Settings"
            description="Global site configuration and branding."
            actions={
                !loading && (
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 hover:scale-105 active:scale-95"
                        disabled={saving}
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                )
            }
            fullHeight
        >
            {loading ? (
                <AdminLoader message="Loading settings..." />
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
                    <div className="flex-1 min-w-0 overflow-y-auto h-full p-6 md:p-8">
                        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">

                            {/* Branding Tab */}
                            {activeTab === 'branding' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Palette className="text-blue-500" size={24} />
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Branding & Identity</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="glass-panel p-6">
                                            <ImageUpload
                                                label="Logo (Light Mode)"
                                                value={settings.branding?.logoLight || settings.logo || ''} // Fallback to old key
                                                onChange={(url) => updateBranding('logoLight', url)}
                                                folder="branding"
                                            />
                                            <p className="text-xs text-slate-500 mt-2">Recommended: PNG with transparent background. visible on light backgrounds.</p>
                                        </div>
                                        <div className="glass-panel p-6">
                                            <ImageUpload
                                                label="Logo (Dark Mode)"
                                                value={settings.branding?.logoDark || ''}
                                                onChange={(url) => updateBranding('logoDark', url)}
                                                folder="branding"
                                                className="bg-slate-900" // Preview on dark bg
                                            />
                                            <p className="text-xs text-slate-500 mt-2">Recommended: White/Light PNG with transparent background. visible regarding dark backgrounds.</p>
                                        </div>
                                        <div className="glass-panel p-6">
                                            <ImageUpload
                                                label="Favicon"
                                                value={settings.branding?.favicon || ''}
                                                onChange={(url) => updateBranding('favicon', url)}
                                                folder="branding"
                                                className="w-16 h-16"
                                            />
                                            <p className="text-xs text-slate-500 mt-2">Recommended: 32x32px or 64x64px PNG/ICO.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Contact Information */}
                            {activeTab === 'contact' && (
                                <div className="glass-panel p-0 overflow-hidden">
                                    <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
                                        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                            <Phone size={20} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">General Contact Info</h2>
                                    </div>
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <Mail size={16} className="text-slate-400" /> Email Address
                                            </label>
                                            <input
                                                type="email"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                                                value={settings.contact?.email || ''}
                                                onChange={(e) => updateContact('email', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <Phone size={16} className="text-slate-400" /> Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                                                value={settings.contact?.phone || ''}
                                                onChange={(e) => updateContact('phone', e.target.value)}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <MapPin size={16} className="text-slate-400" /> Physical Address
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm"
                                                value={settings.contact?.address || ''}
                                                onChange={(e) => updateContact('address', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Social Links */}
                            {activeTab === 'social' && (
                                <div className="glass-panel p-0 overflow-hidden">
                                    <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center gap-3">
                                        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                                            <Globe size={20} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Social Media Connections</h2>
                                    </div>
                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {['linkedin', 'tiktok', 'instagram', 'goodfirms', 'whatsapp'].map((platform) => (
                                            <div key={platform}>
                                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 capitalize flex items-center gap-2">
                                                    <Globe size={14} className="text-slate-400" /> {platform} URL
                                                </label>
                                                <input
                                                    type="url"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all backdrop-blur-sm placeholder:text-slate-400"
                                                    value={settings.social?.[platform] || ''}
                                                    onChange={(e) => updateSocial(platform, e.target.value)}
                                                    placeholder={`https://${platform}.com/...`}
                                                    pattern="https?://.+"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Company Stats */}
                            {activeTab === 'stats' && (
                                <div className="glass-panel p-0 overflow-hidden">
                                    <div className="p-6 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                                <BarChart3 size={20} />
                                            </div>
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Business Statistics</h2>
                                        </div>
                                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                                    </div>

                                    <div className="p-8 grid grid-cols-1 gap-6">
                                        {settings.stats?.map((stat: any, index: number) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-slate-200/50 dark:border-slate-800/50 items-start hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                                                <div className="md:col-span-3">
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5 opacity-75">
                                                        <Hash size={12} /> Value
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono font-medium shadow-sm"
                                                        value={stat.number || ''}
                                                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                                                        placeholder="e.g., 150+"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5 opacity-75">
                                                        <Sticker size={12} /> Icon
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl shadow-sm"
                                                            value={stat.icon || ''}
                                                            onChange={(e) => updateStat(index, 'icon', e.target.value)}
                                                            placeholder="📊"
                                                        />
                                                        <span className="absolute left-3 top-3 text-lg pointer-events-none grayscale opacity-50">{stat.icon}</span>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-7 pt-0.5">
                                                    <LocalizedInput
                                                        label="Description Label"
                                                        value={ensureLocalizedFormat(stat.label)}
                                                        onChange={(v) => updateStat(index, 'label', v)}
                                                        activeLanguage={activeLanguage}
                                                        placeholder="Projects Completed"
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
            )}
            <StatusModal />
        </AdminPageLayout>
    );
};

export default AdminSettings;
