
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Search, Filter, Eye, EyeOff, LayoutTemplate, Tag, Clock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

interface Promotion {
    id: string;
    title: string;
    description: string;
    footerText: string;
    discountCode: string;
    buttonText: string;
    isActive: boolean;
    position: 'hero' | 'popup' | 'banner' | 'floating_corner';
    style: 'amber' | 'blue' | 'luxury';
    imageUrl?: string;
    createdAt: any;
}

const Promotions = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPromo, setCurrentPromo] = useState<Partial<Promotion>>({});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'promotions'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPromotions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion)));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!currentPromo.title || !currentPromo.discountCode) return alert('Title and Code are required');

        try {
            if (currentPromo.id) {
                await updateDoc(doc(db, 'promotions', currentPromo.id), {
                    ...currentPromo,
                    updatedAt: serverTimestamp()
                });
            } else {
                await addDoc(collection(db, 'promotions'), {
                    ...currentPromo,
                    isActive: false, // Default inactive
                    position: currentPromo.position || 'popup',
                    style: currentPromo.style || 'luxury',
                    createdAt: serverTimestamp()
                });
            }
            setIsEditing(false);
            setCurrentPromo({});
        } catch (error) {
            console.error("Error saving promo:", error);
            alert("Failed to save promotion");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            await deleteDoc(doc(db, 'promotions', id));
        }
    };

    const toggleActive = async (promo: Promotion) => {
        await updateDoc(doc(db, 'promotions', promo.id), {
            isActive: !promo.isActive
        });
    };

    const filteredPromotions = promotions.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.discountCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Tag className="text-blue-600" />
                        Promotions & Offers
                    </h1>
                    <p className="text-slate-500 mt-2">Manage dynamic offers across your website.</p>
                </div>
                <button
                    onClick={() => { setCurrentPromo({}); setIsEditing(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-600/30"
                >
                    <Plus size={18} /> New Promotion
                </button>
            </div>

            {/* Editing Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                                <h2 className="text-xl font-bold dark:text-white">
                                    {currentPromo.id ? 'Edit Promotion' : 'Create Promotion'}
                                </h2>
                                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
                                    <X size={20} className="dark:text-white" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Offer Title</label>
                                        <input
                                            value={currentPromo.title || ''}
                                            onChange={e => setCurrentPromo({ ...currentPromo, title: e.target.value })}
                                            placeholder="e.g. 50% OFF First Month"
                                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Discount Code</label>
                                        <input
                                            value={currentPromo.discountCode || ''}
                                            onChange={e => setCurrentPromo({ ...currentPromo, discountCode: e.target.value })}
                                            placeholder="e.g. SUMMER50"
                                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Offer Image URL (Optional)</label>
                                    <input
                                        value={currentPromo.imageUrl || ''}
                                        onChange={e => setCurrentPromo({ ...currentPromo, imageUrl: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                                    <textarea
                                        value={currentPromo.description || ''}
                                        onChange={e => setCurrentPromo({ ...currentPromo, description: e.target.value })}
                                        placeholder="Brief details about the offer..."
                                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white h-24 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Text</label>
                                        <input
                                            value={currentPromo.buttonText || ''}
                                            onChange={e => setCurrentPromo({ ...currentPromo, buttonText: e.target.value })}
                                            placeholder="e.g. Claim Offer"
                                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Display Position</label>
                                        <select
                                            value={currentPromo.position || 'popup'}
                                            onChange={e => setCurrentPromo({ ...currentPromo, position: e.target.value as any })}
                                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                        >
                                            <option value="popup">General Popup</option>
                                            <option value="hero">Hero Slider (Home)</option>
                                            <option value="banner">Top Sticky Banner</option>
                                            <option value="floating_corner">Floating Corner Widget</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Visual Style</label>
                                    <div className="flex gap-4">
                                        {['luxury', 'amber', 'blue'].map((style) => (
                                            <button
                                                key={style}
                                                onClick={() => setCurrentPromo({ ...currentPromo, style: style as any })}
                                                className={`px-4 py-2 rounded-lg capitalize border-2 transition-all ${currentPromo.style === style
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'border-transparent bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-black/20 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all"
                                >
                                    Save Promotion
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Promotions List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPromotions.map((promo) => (
                    <div key={promo.id} className={`relative group p-6 rounded-2xl border transition-all duration-300 ${promo.isActive
                        ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 opacity-75 grayscale'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${promo.isActive ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-slate-200 text-slate-500'
                                }`}>
                                {promo.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => { setCurrentPromo(promo); setIsEditing(true); }} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(promo.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{promo.title}</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <code className="bg-slate-100 dark:bg-black/30 px-2 py-1 rounded text-xs font-mono font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                                {promo.discountCode}
                            </code>
                            <span className="text-xs text-slate-400 flex items-center gap-1 capitalize">
                                <LayoutTemplate size={12} /> {promo.position.replace('_', ' ')}
                            </span>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 min-h-[40px]">
                            {promo.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                            <button
                                onClick={() => toggleActive(promo)}
                                className={`flex items-center gap-2 text-sm font-bold ${promo.isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                                    }`}
                            >
                                {promo.isActive ? <><Eye size={16} /> Live</> : <><EyeOff size={16} /> Hidden</>}
                            </button>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                {promo.style} style
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPromotions.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Tag size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Promotions</h3>
                    <p className="text-slate-500 mb-6">Create your first dynamic offer to get started.</p>
                    <button
                        onClick={() => { setCurrentPromo({}); setIsEditing(true); }}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                        Create One Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default Promotions;
