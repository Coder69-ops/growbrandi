import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { CONTACT_INFO, COMPANY_STATS } from '../../../constants';
import { Save, Globe, Phone, Mail, MapPin, Settings as SettingsIcon, BarChart3, Hash, Sticker, Loader2 } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { SupportedLanguage, ensureLocalizedFormat } from '../../utils/localization';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';

const AdminSettings = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'site_settings', 'main');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSettings(docSnap.data());
            } else {
                // Initialize with defaults from constants
                setSettings({
                    contact: {
                        email: CONTACT_INFO.email,
                        phone: CONTACT_INFO.phone,
                        address: CONTACT_INFO.address,
                    },
                    social: CONTACT_INFO.social,
                    stats: COMPANY_STATS.map(s => ({
                        number: s.number,
                        icon: s.icon,
                        label: ensureLocalizedFormat(s.label),
                    })),
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
            alert("Settings saved!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Failed to save settings.");
        } finally {
            setSaving(false);
        }
    };

    const updateContact = (field: string, value: string) => {
        setSettings({ ...settings, contact: { ...settings.contact, [field]: value } });
    };

    const updateSocial = (platform: string, value: string) => {
        setSettings({ ...settings, social: { ...settings.social, [platform]: value } });
    };

    const updateStat = (index: number, field: string, value: any) => {
        const newStats = [...settings.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setSettings({ ...settings, stats: newStats });
    };

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading settings...</div>;

    return (
        <AdminPageLayout
            title="Site Settings"
            description="Manage global configuration and company details"
            actions={
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    disabled={saving}
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            }
        >
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* Contact Information */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Phone size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">General Contact Info</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Mail size={16} className="text-slate-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={settings.contact?.address || ''}
                                onChange={(e) => updateContact('address', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            <Globe size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Social Media Connections</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['linkedin', 'twitter', 'instagram', 'dribbble', 'whatsapp'].map((platform) => (
                            <div key={platform}>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 capitalize flex items-center gap-2">
                                    <Globe size={14} className="text-slate-400" /> {platform} URL
                                </label>
                                <input
                                    type="url"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                                    value={settings.social?.[platform] || ''}
                                    onChange={(e) => updateSocial(platform, e.target.value)}
                                    placeholder={`https://${platform}.com/...`}
                                    pattern="https?://.+"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Company Stats */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                <BarChart3 size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Business Statistics</h2>
                        </div>
                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                    </div>

                    <div className="p-6 grid grid-cols-1 gap-6">
                        {settings.stats?.map((stat: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/50 items-start">
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                                        <Hash size={12} /> Value
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                        value={stat.number || ''}
                                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                                        placeholder="e.g., 150+"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                                        <Sticker size={12} /> Icon
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl"
                                        value={stat.icon || ''}
                                        onChange={(e) => updateStat(index, 'icon', e.target.value)}
                                        placeholder="📊"
                                    />
                                </div>
                                <div className="md:col-span-7 pt-1">
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
            </div>
        </AdminPageLayout>
    );
};

export default AdminSettings;
