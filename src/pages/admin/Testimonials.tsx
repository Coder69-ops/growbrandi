import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { addDoc, updateDoc, deleteDoc } from '../../lib/firestore-audit';
import { Plus, Edit2, Trash2, Save, X, MessageSquare, Star, ArrowLeft, User, Quote } from 'lucide-react';
import { LanguageTabs, LocalizedInput } from '../../components/admin/LocalizedFormFields';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { Sparkles } from 'lucide-react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { SupportedLanguage, ensureLocalizedFormat, getLocalizedField } from '../../utils/localization';
import { Reorder } from 'framer-motion';
import { useStatusModal } from '../../hooks/useStatusModal';
import { useToast } from '../../context/ToastContext';
import { SortableItem } from '../../components/admin/SortableItem';
// import { logAction } from '../../services/auditService';

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
            const testimonialsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
            setTestimonials(testimonialsData);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const { showSuccess, showError, StatusModal } = useStatusModal();
    const { showConfirm } = useToast();

    const handleDelete = async (id: string) => {
        showConfirm("Are you sure you want to delete this testimonial?", async () => {
            try {
                await deleteDoc(doc(db, 'testimonials', id));
                await deleteDoc(doc(db, 'testimonials', id));
                // await logAction('delete', 'testimonials', `Deleted testimonial: ${id}`, { testimonialId: id });
                showSuccess('Testimonial Deleted', 'Testimonial deleted successfully.');
                setTestimonials(testimonials.filter(t => t.id !== id));
            } catch (error) {
                console.error("Error deleting testimonial:", error);
                showError('Delete Failed', 'Failed to delete the testimonial.');
            }
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const testimonialData = {
                ...currentTestimonial,
                updatedAt: serverTimestamp(),
            };

            if (currentTestimonial.id) {
                const { id, ...data } = testimonialData;
                await updateDoc(doc(db, 'testimonials', id), data);
                await updateDoc(doc(db, 'testimonials', id), data);
                // await logAction('update', 'testimonials', `Updated testimonial by: ${data.author?.en || 'Unknown'}`, { testimonialId: id });
                showSuccess('Testimonial Updated', 'Testimonial updated successfully.');
            } else {
                testimonialData.createdAt = serverTimestamp();
                testimonialData.order = testimonials.length + 1;
                const docRef = await addDoc(collection(db, 'testimonials'), testimonialData);
                // await logAction('create', 'testimonials', `Created testimonial by: ${testimonialData.author?.en || 'Unknown'}`, { testimonialId: docRef.id });
            }
            await fetchTestimonials();
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving testimonial:", error);
            showError('Save Failed', "Failed to save testimonial.");
        } finally {
            setLoading(false);
        }
    };

    const handleReorder = async (newOrder: any[]) => {
        setTestimonials(newOrder);

        const batch = writeBatch(db);
        newOrder.forEach((testimonial, index) => {
            const docRef = doc(db, 'testimonials', testimonial.id);
            batch.update(docRef, { order: index + 1 });
        });

        try {
            await batch.commit();
        } catch (error) {
            console.error("Error updating order:", error);
            fetchTestimonials();
        }
    };

    const openEdit = (testimonial: any = {}) => {
        setCurrentTestimonial({
            author: ensureLocalizedFormat(testimonial.author),
            company: ensureLocalizedFormat(testimonial.company),
            quote: ensureLocalizedFormat(testimonial.quote),
            image: testimonial.image || '',
            rating: testimonial.rating || 5,
            ...testimonial,
        });
        setActiveLanguage('en');
        setIsEditing(true);
    };

    const updateField = (field: string, value: any) => {
        setCurrentTestimonial({ ...currentTestimonial, [field]: value });
    };

    const { isTranslating, handleAutoTranslate } = useAutoTranslate(
        currentTestimonial,
        setCurrentTestimonial,
        {
            fields: ['author', 'company', 'quote']
        }
    );

    return (
        <AdminPageLayout
            title="Testimonials"
            description="Manage client testimonials."
            actions={
                !loading && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => openEdit()}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95"
                        >
                            <Plus size={20} />
                            Add Testimonial
                        </button>
                    </div>
                )
            }
        >
            {loading && !isEditing ? (
                <AdminLoader message="Loading testimonials..." />
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
                                {currentTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}
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

                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Quote size={18} className="text-blue-500" />
                                        Content
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <LocalizedInput
                                            label="Client Name"
                                            value={currentTestimonial.author}
                                            onChange={(v) => updateField('author', v)}
                                            activeLanguage={activeLanguage}
                                            required
                                        />
                                        <LocalizedInput
                                            label="Role / Company"
                                            value={currentTestimonial.company}
                                            onChange={(v) => updateField('company', v)}
                                            activeLanguage={activeLanguage}
                                        />
                                    </div>

                                    <LocalizedInput
                                        label="Review Content"
                                        value={currentTestimonial.quote}
                                        onChange={(v) => updateField('quote', v)}
                                        activeLanguage={activeLanguage}
                                        type="textarea"
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Sidebar Options */}
                            <div className="space-y-6">
                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <User size={18} className="text-violet-500" />
                                        Profile Image
                                    </h3>

                                    <ImageUpload
                                        label="Client Photo"
                                        value={currentTestimonial.image}
                                        onChange={(url) => updateField('image', url)}
                                        folder={`testimonials/${currentTestimonial.id || 'new'}`}
                                    />
                                </div>

                                <div className="bg-white/50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/50 space-y-6">
                                    <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Star size={18} className="text-amber-500" />
                                        Rating
                                    </h3>

                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            step="1"
                                            value={currentTestimonial.rating}
                                            onChange={(e) => updateField('rating', parseInt(e.target.value))}
                                            className="flex-1 accent-amber-500"
                                        />
                                        <span className="font-bold text-lg text-slate-900 dark:text-white bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30 text-amber-600 dark:text-amber-400">
                                            {currentTestimonial.rating} ★
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                <Reorder.Group axis="y" values={testimonials} onReorder={handleReorder} className="space-y-4">
                    {testimonials.map((testimonial) => (
                        <SortableItem key={testimonial.id} item={testimonial}>
                            <div className="glass-card p-6 flex items-start gap-6 hover:scale-[1.01] transition-all duration-300 group">
                                <div className="shrink-0 relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700">
                                        {testimonial.image ? (
                                            <img
                                                src={testimonial.image}
                                                alt={getLocalizedField(testimonial.author, 'en')}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <User size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center gap-0.5">
                                        {testimonial.rating} <Star size={8} fill="currentColor" />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {getLocalizedField(testimonial.author, 'en')}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {getLocalizedField(testimonial.company, 'en')}
                                            </p>
                                        </div>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button
                                                onClick={() => openEdit(testimonial)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(testimonial.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                                        <Quote size={16} className="absolute -top-1 -left-[9px] bg-white dark:bg-slate-950 text-slate-300 dark:text-slate-600" />
                                        <p className="text-slate-600 dark:text-slate-300 italic line-clamp-2">
                                            {getLocalizedField(testimonial.quote, 'en')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </SortableItem>
                    ))}

                    {testimonials.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 glass-panel border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={40} className="opacity-50" />
                            </div>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">No testimonials yet</p>
                            <p className="text-sm mt-2 mb-6 max-w-sm mx-auto">Add client reviews to build trust with your visitors.</p>
                            <button
                                onClick={() => openEdit()}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 font-medium"
                            >
                                Add Testimonial
                            </button>
                        </div>
                    )}
                </Reorder.Group>
            )}
            <StatusModal />
        </AdminPageLayout >
    );
};

export default AdminTestimonials;
