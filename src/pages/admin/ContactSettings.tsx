import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Mail, Phone, MapPin, Loader2, MessageSquare, FormInput, AtSign, Clock } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { SupportedLanguage, createEmptyLocalizedString } from '../../utils/localization';
import { CONTACT_INFO } from '../../../constants';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';

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
            email: CONTACT_INFO.email,
            phone: CONTACT_INFO.phone,
            address: CONTACT_INFO.address,
            office_hours: createEmptyLocalizedString(),
            response_time: createEmptyLocalizedString(),
        },
        social_links: CONTACT_INFO.social,
    });

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
            alert('Contact settings saved successfully!');
        } catch (error) {
            console.error('Error saving contact settings:', error);
            alert('Failed to save contact settings.');
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

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading contact settings...</div>;

    return (
        <AdminPageLayout
            title="Contact Settings"
            description="Configure your contact page and form"
            actions={
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            }
        >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                    <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                </div>

                <div className="space-y-12">
                    {/* Page Text */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <MessageSquare className="text-blue-600 dark:text-blue-400" size={24} />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Page Intro Text</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <FormInput className="text-green-600 dark:text-green-400" size={24} />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Form Labels & Messages</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50">
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
                            <LocalizedInput
                                label="Success Message"
                                value={settings.form_labels.success}
                                onChange={(v) => updateField('form_labels', 'success', v)}
                                activeLanguage={activeLanguage}
                            />
                            <LocalizedInput
                                label="Error Message"
                                value={settings.form_labels.error}
                                onChange={(v) => updateField('form_labels', 'error', v)}
                                activeLanguage={activeLanguage}
                            />
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section>
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Clock className="text-purple-600 dark:text-purple-400" size={24} />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Info & Availability</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Mail size={16} /> Contact Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={settings.contact_info.email}
                                    onChange={(e) => updateField('contact_info', 'email', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Phone size={16} /> Phone Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={settings.contact_info.phone}
                                    onChange={(e) => updateField('contact_info', 'phone', e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <MapPin size={16} /> Address
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <AtSign className="text-orange-500 dark:text-orange-400" size={24} />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Social Media Links</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">LinkedIn URL</label>
                                <input
                                    type="url"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={settings.social_links.linkedin}
                                    onChange={(e) => updateField('social_links', 'linkedin', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Twitter URL</label>
                                <input
                                    type="url"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={settings.social_links.twitter}
                                    onChange={(e) => updateField('social_links', 'twitter', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Instagram URL</label>
                                <input
                                    type="url"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={settings.social_links.instagram}
                                    onChange={(e) => updateField('social_links', 'instagram', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">WhatsApp URL</label>
                                <input
                                    type="url"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={settings.social_links.whatsapp}
                                    onChange={(e) => updateField('social_links', 'whatsapp', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default AdminContactSettings;
