import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Mail, Phone, MapPin, Loader2, MessageSquare, FormInput, AtSign, Clock } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { Sparkles } from 'lucide-react';
import { SupportedLanguage, createEmptyLocalizedString } from '../../utils/localization';
import { logAction } from '../../services/auditService';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { useStatusModal } from '../../hooks/useStatusModal';

const AdminContactSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');
    const [settings, setSettings] = useState<any>({
        page_text: {
            badge: createEmptyLocalizedString(),
            title: createEmptyLocalizedString(),
            description: createEmptyLocalizedString(),
        },
        form_labels: {
            name: createEmptyLocalizedString(),
            email: createEmptyLocalizedString(),
            subject: createEmptyLocalizedString(),
            message: createEmptyLocalizedString(),
            service: createEmptyLocalizedString(),
            budget: createEmptyLocalizedString(),
            submit: createEmptyLocalizedString(),
            sending: createEmptyLocalizedString(),
            success: createEmptyLocalizedString(),
            error: createEmptyLocalizedString(),
        },
        contact_info: {
            email: '',
            phone: '',
            address: '',
            office_hours: createEmptyLocalizedString(),
            response_time: createEmptyLocalizedString(),
        },
        social_links: { linkedin: '', twitter: '', instagram: '', whatsapp: '' },
    });

    const { showSuccess, showError, StatusModal } = useStatusModal();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'contact_settings', 'main');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setSettings(docSnap.data());
            }
        } catch (error) {
            console.error('Error fetching contact settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'contact_settings', 'main'), {
                ...settings,
                updatedAt: serverTimestamp(),
            });
            await logAction('update', 'contact', 'Updated contact settings details');
            showSuccess('Settings Saved', 'Contact settings saved successfully!');
        } catch (error) {
            console.error('Error saving contact settings:', error);
            showError('Save Failed', 'Failed to save contact settings.');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (section: string, field: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        settings,
        setSettings,
        {
            deepKeys: [
                'page_text.badge',
                'page_text.title',
                'page_text.description',
                'form_labels.name',
                'form_labels.email',
                'form_labels.subject',
                'form_labels.message',
                'form_labels.service',
                'form_labels.budget',
                'form_labels.submit',
                'form_labels.sending',
                'form_labels.success',
                'form_labels.error',
                'contact_info.office_hours',
                'contact_info.response_time'
            ]
        }
    );

    return (
        <AdminPageLayout
            title="Contact Settings"
            description="Manage contact page content."
            actions={
                !loading && (
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleAutoTranslate}
                            disabled={saving || isTranslating}
                            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50 hover:scale-105 active:scale-95"
                        >
                            <Sparkles size={18} className={isTranslating ? "animate-spin" : ""} />
                            {isTranslating ? 'Translating...' : 'Auto Translate'}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 hover:scale-105 active:scale-95"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )
            }
        >
            {
                loading ? (
                    <AdminLoader message="Loading contact settings..." />
                ) : (
                    <div className="glass-panel p-8 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                        <div className="mb-8">
                            <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                        </div >

                        <div className="space-y-12">
                            {/* Page Text */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                        <MessageSquare size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Page Intro Text</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <LocalizedInput
                                        label="Badge Text"
                                        value={settings.page_text.badge}
                                        onChange={(v) => updateField('page_text', 'badge', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="e.g., Get in Touch"
                                    />
                                    <LocalizedInput
                                        label="Main Heading"
                                        value={settings.page_text.title}
                                        onChange={(v) => updateField('page_text', 'title', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="e.g., Let's Start a Conversation"
                                    />
                                    <div className="lg:col-span-2">
                                        <LocalizedInput
                                            label="Description"
                                            value={settings.page_text.description}
                                            onChange={(v) => updateField('page_text', 'description', v)}
                                            activeLanguage={activeLanguage}
                                            type="textarea"
                                            rows={2}
                                            placeholder="e.g., Ready to transform your digital presence?"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Form Labels */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                                        <FormInput size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Form Labels & Messages</h3>
                                </div>
                                <div className="bg-slate-50/50 dark:bg-slate-900/30 p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <LocalizedInput
                                        label="Name Label"
                                        value={settings.form_labels.name}
                                        onChange={(v) => updateField('form_labels', 'name', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                    <LocalizedInput
                                        label="Email Label"
                                        value={settings.form_labels.email}
                                        onChange={(v) => updateField('form_labels', 'email', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                    <LocalizedInput
                                        label="Subject Label"
                                        value={settings.form_labels.subject}
                                        onChange={(v) => updateField('form_labels', 'subject', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                    <LocalizedInput
                                        label="Message Label"
                                        value={settings.form_labels.message}
                                        onChange={(v) => updateField('form_labels', 'message', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                    <LocalizedInput
                                        label="Service Select Label"
                                        value={settings.form_labels.service}
                                        onChange={(v) => updateField('form_labels', 'service', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                    <LocalizedInput
                                        label="Budget Select Label"
                                        value={settings.form_labels.budget}
                                        onChange={(v) => updateField('form_labels', 'budget', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                    <LocalizedInput
                                        label="Submit Button Text"
                                        value={settings.form_labels.submit}
                                        onChange={(v) => updateField('form_labels', 'submit', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                    <LocalizedInput
                                        label="Loading State Text"
                                        value={settings.form_labels.sending}
                                        onChange={(v) => updateField('form_labels', 'sending', v)}
                                        activeLanguage={activeLanguage}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="p-6 rounded-xl bg-green-50/50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30">
                                        <LocalizedInput
                                            label="Success Message"
                                            value={settings.form_labels.success}
                                            onChange={(v) => updateField('form_labels', 'success', v)}
                                            activeLanguage={activeLanguage}
                                        />
                                    </div>
                                    <div className="p-6 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30">
                                        <LocalizedInput
                                            label="Error Message"
                                            value={settings.form_labels.error}
                                            onChange={(v) => updateField('form_labels', 'error', v)}
                                            activeLanguage={activeLanguage}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                                        <Clock size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Info & Availability</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Mail size={16} className="text-slate-400" /> Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={settings.contact_info.email}
                                            onChange={(e) => updateField('contact_info', 'email', e.target.value)}
                                        />
                                    </div>
                                    <div className="p-6 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <Phone size={16} className="text-slate-400" /> Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={settings.contact_info.phone}
                                            onChange={(e) => updateField('contact_info', 'phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2 p-6 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                            <MapPin size={16} className="text-slate-400" /> Address
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={settings.contact_info.address}
                                            onChange={(e) => updateField('contact_info', 'address', e.target.value)}
                                        />
                                    </div>
                                    <LocalizedInput
                                        label="Office Hours"
                                        value={settings.contact_info.office_hours}
                                        onChange={(v) => updateField('contact_info', 'office_hours', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="e.g., Mon-Fri: 9AM-6PM"
                                    />
                                    <LocalizedInput
                                        label="Response Time"
                                        value={settings.contact_info.response_time}
                                        onChange={(v) => updateField('contact_info', 'response_time', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="e.g., We'll get back to you within 24 hours"
                                    />
                                </div>
                            </section>

                            {/* Social Links */}
                            <section>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                                        <AtSign size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Social Media Links</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">LinkedIn URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                                            value={settings.social_links.linkedin}
                                            onChange={(e) => updateField('social_links', 'linkedin', e.target.value)}
                                            placeholder="https://linkedin.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Twitter URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                                            value={settings.social_links.twitter}
                                            onChange={(e) => updateField('social_links', 'twitter', e.target.value)}
                                            placeholder="https://twitter.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Instagram URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                                            value={settings.social_links.instagram}
                                            onChange={(e) => updateField('social_links', 'instagram', e.target.value)}
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">WhatsApp URL</label>
                                        <input
                                            type="url"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                                            value={settings.social_links.whatsapp}
                                            onChange={(e) => updateField('social_links', 'whatsapp', e.target.value)}
                                            placeholder="https://wa.me/..."
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div >
                )
            }
            <StatusModal />
        </AdminPageLayout >
    );
};

export default AdminContactSettings;
