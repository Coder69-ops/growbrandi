import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { TESTIMONIALS } from '../../../constants';
import { Plus, Edit2, Trash2, Save, X, Database, ArrowLeft, MessageSquareQuote, Star, Building2, User } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState<any>(null);
    const [activeLanguage, setActiveLanguage] = useState<SupportedLanguage>('en');

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'testimonials'));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTestimonials(data);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const handleSeedData = async () => {
        if (!window.confirm("Seed testimonials data?")) return;
        setLoading(true);
        try {
            for (const t of TESTIMONIALS) {
                await addDoc(collection(db, 'testimonials'), {
                    author: t.author,
                    image: t.image || '',
                    rating: t.rating || 5,
                    quote: { en: t.quote },
                    company: { en: t.company },
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });
            }
            await fetchTestimonials();
            alert("Data seeded!");
        } catch (error) {
            console.error(error);
            alert("Failed to seed data.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this testimonial?")) return;
        await deleteDoc(doc(db, 'testimonials', id));
        setTestimonials(testimonials.filter(t => t.id !== id));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = { ...currentTestimonial, updatedAt: serverTimestamp() };
            if (currentTestimonial.id) {
                const { id, ...rest } = data;
                await updateDoc(doc(db, 'testimonials', id), rest);
            } else {
                data.createdAt = serverTimestamp();
                await addDoc(collection(db, 'testimonials'), data);
            }
            setIsEditing(false);
            fetchTestimonials();
        } catch (error) {
            console.error(error);
            alert("Failed to save.");
        } finally {
            setLoading(false);
        }
    };

    const openEdit = (t: any = {}) => {
        setCurrentTestimonial({
            author: t.author || '',
            image: t.image || '',
            rating: t.rating || 5,
            quote: ensureLocalizedFormat(t.quote),
            company: ensureLocalizedFormat(t.company),
            ...t,
        });
        setActiveLanguage('en');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentTestimonial({ ...currentTestimonial, [field]: value });
    };

    if (loading && !isEditing) return <div className="p-12 text-center text-slate-500 animate-pulse">Loading testimonials...</div>;

    return (
        <AdminPageLayout
            title="Testimonials"
            description="Manage client reviews and feedback"
            actions={
                <div className="flex gap-3">
                    {testimonials.length === 0 && (
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
                        <Plus size={20} /> Add Testimonial
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
                                {currentTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}
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
                                <Save size={18} /> Save Testimonial
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <LanguageTabs activeLanguage={activeLanguage} onChange={setActiveLanguage} />
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <MessageSquareQuote size={18} />
                                        Content
                                    </h3>

                                    <LocalizedInput
                                        label="Quote Content"
                                        value={currentTestimonial.quote}
                                        onChange={(v) => updateField('quote', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={6}
                                        required
                                        placeholder="Enter the client's testimonial..."
                                    />

                                    <LocalizedInput
                                        label="Company / Role"
                                        value={currentTestimonial.company}
                                        onChange={(v) => updateField('company', v)}
                                        activeLanguage={activeLanguage}
                                        placeholder="e.g., CEO at TechCorp"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <User size={18} />
                                        Author Details
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Author Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={currentTestimonial.author}
                                            onChange={(e) => updateField('author', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Rating (0-5)</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min="0"
                                                max="5"
                                                step="1"
                                                className="flex-1"
                                                value={currentTestimonial.rating}
                                                onChange={(e) => updateField('rating', parseFloat(e.target.value))}
                                            />
                                            <div className="flex items-center gap-1 font-bold text-lg text-slate-900 dark:text-white">
                                                {currentTestimonial.rating} <Star size={18} className="fill-yellow-400 text-yellow-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <ImageUpload
                                        label="Author Photo"
                                        value={currentTestimonial.image}
                                        onChange={(v) => updateField('image', v)}
                                        folder="testimonials"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div key={t.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 border border-slate-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-shadow">

                            <div className="flex items-start justify-between mb-6">
                                <div className="flex gap-1 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < (t.rating || 5) ? "currentColor" : "none"} className={i < (t.rating || 5) ? "" : "text-slate-300 dark:text-slate-600"} />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(t)} className="text-slate-400 hover:text-blue-500 transition-colors"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(t.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="mb-8 flex-1">
                                <MessageSquareQuote size={32} className="text-blue-100 dark:text-blue-900/30 mb-4" />
                                <p className="text-slate-600 dark:text-slate-300 italic">"{getLocalizedField(t.quote, 'en')}"</p>
                            </div>

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                                    {t.image ? (
                                        <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <User size={20} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{t.author}</h4>
                                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                                        <Building2 size={12} />
                                        <span>{getLocalizedField(t.company, 'en')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {testimonials.length === 0 && (
                        <div className="col-span-full py-16 text-center">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <MessageSquareQuote size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Testimonials</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
                                Showcase your happy clients to build trust.
                            </p>
                            <button
                                onClick={() => openEdit()}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                            >
                                Add Testimonial
                            </button>
                        </div>
                    )}
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminTestimonials;
