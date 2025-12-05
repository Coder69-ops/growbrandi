import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FAQ_DATA } from '../../../constants';
import { Plus, Edit2, Trash2, Save, X, Database, ArrowLeft, ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';

const AdminFAQs = () => {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFAQ, setCurrentFAQ] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'faqs'));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Initial sort by order
            data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setFaqs(data);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFAQs(); }, []);

    const handleSeedData = async () => {
        if (!window.confirm("Seed FAQ data?")) return;
        setLoading(true);
        try {
            for (const faq of FAQ_DATA) {
                await addDoc(collection(db, 'faqs'), {
                    question: { en: faq.question },
                    answer: { en: faq.answer },
                    order: 0,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }
            await fetchFAQs();
            alert("Data seeded!");
        } catch (error) {
            console.error(error);
            alert("Failed to seed data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this FAQ?")) return;
        await deleteDoc(doc(db, 'faqs', id));
        setFaqs(faqs.filter(f => f.id !== id));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = { ...currentFAQ, updatedAt: serverTimestamp() };
            if (currentFAQ.id) {
                const { id, ...rest } = data;
                await updateDoc(doc(db, 'faqs', id), rest);
            } else {
                data.createdAt = serverTimestamp();
                await addDoc(collection(db, 'faqs'), data);
            }
            setIsEditing(false);
            fetchFAQs();
        } catch (error) {
            console.error(error);
            alert("Failed to save.");
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (faq: any = {}) => {
        setCurrentFAQ({
            question: ensureLocalizedFormat(faq.question),
            answer: ensureLocalizedFormat(faq.answer),
            order: faq.order || 0,
            ...faq,
        });
        setActiveLanguage('en');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentFAQ({ ...currentFAQ, [field]: value });
    };

    if (loading && !isEditing) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading FAQs...</div>;

    return (
        <AdminPageLayout
            title="Frequently Asked Questions"
            description="Manage your help center content"
            actions={
                <div className="flex gap-3">
                    {faqs.length === 0 && (
                        <button
                            onClick={handleSeedData}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Database size={18} />
                            Seed Data
                        </button>
                    )}
                    <button
                        onClick={() => openEdit()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                    >
                        <Plus size={20} /> Add FAQ
                    </button>
                </div>
            }
        >
            {isEditing ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-slate-500" />
                            </button>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {currentFAQ.id ? 'Edit FAQ' : 'New FAQ'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                disabled={loading}
                            >
                                <Save size={18} /> Save FAQ
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                            <LocalizedInput
                                label="Question"
                                value={currentFAQ.question}
                                onChange={(v) => updateField('question', v)}
                                activeLanguage={activeLanguage}
                                required
                                placeholder="What is the question?"
                            />

                            <LocalizedInput
                                label="Answer"
                                value={currentFAQ.answer}
                                onChange={(v) => updateField('answer', v)}
                                activeLanguage={activeLanguage}
                                type="textarea"
                                rows={6}
                                required
                                placeholder="Provide a detailed answer..."
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Display Order</label>
                                <input
                                    type="number"
                                    className="w-32 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    value={currentFAQ.order}
                                    onChange={(e) => updateField('order', parseInt(e.target.value))}
                                    placeholder="0"
                                />
                                <p className="text-xs text-slate-500 mt-1">Lower numbers appear first.</p>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4 max-w-4xl mx-auto">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden group hover:border-blue-500/30 transition-all">
                            <div
                                className="p-5 flex justify-between items-center cursor-pointer select-none"
                                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${expandedId === faq.id ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                        <HelpCircle size={16} />
                                    </div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                                        {getLocalizedField(faq.question, 'en')}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">
                                        #{faq.order}
                                    </span>
                                    <ChevronDown className={`text-slate-400 transition-transform duration-300 ${expandedId === faq.id ? 'rotate-180' : ''}`} size={20} />
                                </div>
                            </div>

                            {expandedId === faq.id && (
                                <div className="px-5 pb-5 pt-0 ml-12">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                        {getLocalizedField(faq.answer, 'en')}
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEdit(faq); }}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {faqs.length === 0 && (
                        <div className="col-span-full py-16 text-center">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Frequently Asked Questions</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                Build a knowledge base to help your users.
                            </p>
                            <button
                                onClick={() => openEdit()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                            >
                                Add FAQ
                            </button>
                        </div>
                    )}
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminFAQs;
