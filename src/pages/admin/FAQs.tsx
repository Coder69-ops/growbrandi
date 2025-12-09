import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { FAQ_DATA } from '../../../constants';
import { Plus, Edit2, Trash2, Save, X, Database, ArrowLeft, ChevronDown, HelpCircle, MessageCircle, Sparkles, FileText } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';
import { Reorder } from 'framer-motion';
import { useStatusModal } from '../../hooks/useStatusModal';
import { SortableItem } from '../../components/admin/SortableItem';

const AdminFAQs = () => {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFAQ, setCurrentFAQ] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const { showSuccess, showError, StatusModal } = useStatusModal();

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
            await fetchFAQs();
            showSuccess('Data Seeded', 'FAQ data seeded successfully!');
        } catch (error) {
            console.error(error);
            showError('Seeding Failed', 'Failed to seed FAQ data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this FAQ?")) return;
        try {
            await deleteDoc(doc(db, 'faqs', id));
            showSuccess('FAQ Deleted', 'The FAQ has been deleted.');
            setFaqs(faqs.filter(f => f.id !== id));
        } catch (error) {
            console.error("Error deleting FAQ:", error);
            showError('Delete Failed', 'Failed to delete the FAQ.');
        }
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
                data.order = faqs.length + 1;
                await addDoc(collection(db, 'faqs'), data);
            }
            await fetchFAQs();
            setIsEditing(false);
            showSuccess('FAQ Saved', 'FAQ details have been successfully saved.');
        } catch (error) {
            console.error(error);
            showError('Save Failed', 'Failed to save the FAQ.');
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newOrder: any[]) => {
        setFaqs(newOrder);

        const batch = writeBatch(db);
        newOrder.forEach((faq, index) => {
            const docRef = doc(db, 'faqs', faq.id);
            batch.update(docRef, { order: index + 1 });
        });

        try {
            await batch.commit();
        } catch (error) {
            console.error("Error updating order:", error);
            fetchFAQs();
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

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        currentFAQ,
        setCurrentFAQ,
        {
            fields: ['question', 'answer']
        }
    );

    return (
        <AdminPageLayout
            title="FAQs"
            description="Manage frequently asked questions."
            actions={
                !loading && (
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
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
                        >
                            <Plus size={20} /> Add FAQ
                        </button>
                    </div>
                )
            }
        >
            {loading && !isEditing ? (
                <AdminLoader message="Loading FAQs..." />
            ) : isEditing ? (
                <div className="glass-panel p-8 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                                {currentFAQ.id ? 'Edit FAQ' : 'New FAQ'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={isTranslating}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Auto-translate English text to all other languages"
                            >
                                <Sparkles size={18} className={isTranslating ? "animate-spin" : ""} />
                                {isTranslating ? 'Translating...' : 'Auto Translate'}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText size={18} className="text-blue-500" />
                                Content
                            </h3>

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
                        </div>
                    </form>
                </div>
            ) : (
                <Reorder.Group axis="y" values={faqs} onReorder={handleReorder} className="space-y-4 max-w-4xl mx-auto">
                    {faqs.map((faq) => (
                        <SortableItem key={faq.id} item={faq}>
                            <div className="glass-card overflow-hidden group hover:border-blue-500/30 transition-all">
                                <div
                                    className="p-5 flex justify-between items-center cursor-pointer select-none"
                                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${expandedId === faq.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                            <HelpCircle size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {getLocalizedField(faq.question, 'en')}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${expandedId === faq.id ? 'rotate-180' : ''}`} size={20} />
                                    </div>
                                </div>

                                {expandedId === faq.id && (
                                    <div className="px-5 pb-5 pt-0 pl-[4.5rem] animate-in slide-in-from-top-2 duration-200">
                                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 mb-4 text-lg/relaxed leading-relaxed">
                                            {getLocalizedField(faq.answer, 'en')}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openEdit(faq); }}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SortableItem>
                    ))}

                    {faqs.length === 0 && (
                        <div className="col-span-full py-16 text-center glass-panel border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Frequently Asked Questions</h3>
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
                </Reorder.Group>
            )}
            <StatusModal />
        </AdminPageLayout >
    );
};

export default AdminFAQs;
