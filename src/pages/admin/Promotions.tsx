import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Search, Filter, Eye, EyeOff, LayoutTemplate, Tag, Clock, Image as ImageIcon, Copy, Check, BarChart3, MoreVertical, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { AssetPickerModal } from '../../components/admin/assets/AssetPickerModal';

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
    const [showAssetPicker, setShowAssetPicker] = useState(false);
    const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
    const [copiedId, setCopiedId] = useState<string | null>(null);

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
            setActiveTab('content');
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

    const handleCopyCode = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredPromotions = promotions.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.discountCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = promotions.filter(p => p.isActive).length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <Tag className="text-blue-600 dark:text-blue-400" size={32} />
                        Promotions & Offers
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Manage dynamic offers, popups, and banners across your site.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {activeCount} Active Now
                    </div>
                    <button
                        onClick={() => { setCurrentPromo({}); setIsEditing(true); setActiveTab('content'); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-600/30 active:scale-95"
                    >
                        <Plus size={18} /> New Promotion
                    </button>
                </div>
            </div>

            {/* Asset Picker Modal */}
            <AssetPickerModal
                isOpen={showAssetPicker}
                onClose={() => setShowAssetPicker(false)}
                onSelect={(url) => {
                    setCurrentPromo(prev => ({ ...prev, imageUrl: url }));
                    setShowAssetPicker(false);
                }}
            />

            {/* Edit/Create Modal */}
            {isEditing && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-black/20 backdrop-blur-md">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    {currentPromo.id ? 'Edit Promotion' : 'Create New Offer'}
                                </h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                                    {activeTab === 'content' ? 'Step 1: Offer Details' : 'Step 2: Visuals & Settings'}
                                </p>
                            </div>
                            <button type="button" onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            {/* Tabs */}
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8">
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                >
                                    Content & Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('design')}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'design' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                >
                                    Design & Display
                                </button>
                            </div>

                            {activeTab === 'content' ? (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Offer Title</label>
                                        <input
                                            value={currentPromo.title || ''}
                                            onChange={e => setCurrentPromo({ ...currentPromo, title: e.target.value })}
                                            placeholder="e.g. 50% OFF Strategy Session"
                                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-medium text-lg placeholder:font-normal"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Discount Code</label>
                                            <div className="relative">
                                                <input
                                                    value={currentPromo.discountCode || ''}
                                                    onChange={e => setCurrentPromo({ ...currentPromo, discountCode: e.target.value })}
                                                    placeholder="e.g. SUMMER50"
                                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-mono font-bold uppercase tracking-wider"
                                                />
                                                <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button CTA</label>
                                            <input
                                                value={currentPromo.buttonText || ''}
                                                onChange={e => setCurrentPromo({ ...currentPromo, buttonText: e.target.value })}
                                                placeholder="e.g. Claim Offer Now"
                                                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                                        <textarea
                                            value={currentPromo.description || ''}
                                            onChange={e => setCurrentPromo({ ...currentPromo, description: e.target.value })}
                                            placeholder="Brief details about the offer. Keep it punchy."
                                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white h-32 resize-none"
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Left: Image Picker */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                                                Offer Image
                                                <span className="text-xs font-normal text-slate-500">Optional</span>
                                            </label>

                                            <div
                                                onClick={() => setShowAssetPicker(true)}
                                                className={`aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer relative group overflow-hidden ${currentPromo.imageUrl
                                                    ? 'border-blue-500/50 bg-slate-900'
                                                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'}`}
                                            >
                                                {currentPromo.imageUrl ? (
                                                    <>
                                                        <img src={currentPromo.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm">Change Image</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 group-hover:text-blue-500">
                                                        <ImageIcon size={32} className="mb-2" />
                                                        <span className="font-medium text-sm">Select Image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Settings */}
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Display Position</label>
                                                <select
                                                    value={currentPromo.position || 'popup'}
                                                    onChange={e => setCurrentPromo({ ...currentPromo, position: e.target.value as any })}
                                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white appearance-none cursor-pointer"
                                                >
                                                    <option value="popup">General Popup (Modal)</option>
                                                    <option value="hero">Hero Slider (Home)</option>
                                                    <option value="banner">Top Sticky Banner</option>
                                                    <option value="floating_corner">Floating Corner Widget</option>
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Theme Style</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['luxury', 'amber', 'blue'].map((style) => (
                                                        <button
                                                            key={style}
                                                            onClick={() => setCurrentPromo({ ...currentPromo, style: style as any })}
                                                            className={`py-3 px-2 rounded-xl capitalize font-bold text-sm border-2 transition-all ${currentPromo.style === style
                                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-md'
                                                                : 'border-transparent bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                                                        >
                                                            {style}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Hint */}
                                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                                        <AlertCircle className="shrink-0" size={20} />
                                        <p>This promotion will appear dynamically based on the priority logic. Use <strong>?promo=true</strong> in your URL to force-show it for testing.</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-black/20 flex justify-end gap-3 sticky bottom-0 backdrop-blur-md">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (activeTab === 'content') setActiveTab('design');
                                    else handleSave();
                                }}
                                className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                            >
                                {activeTab === 'content' ? 'Next Step' : 'Save Promotion'}
                            </button>
                        </div>
                    </motion.div>
                </div>,
                document.body
            )}

            {/* Empty State */}
            {filteredPromotions.length === 0 && !loading && (
                <div className="text-center py-24 bg-slate-50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <Tag size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Promotions Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Create your first dynamic offer to engage visitors and boost conversions.</p>
                    <button
                        onClick={() => { setCurrentPromo({}); setIsEditing(true); setActiveTab('content'); }}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20"
                    >
                        Create One Now
                    </button>
                </div>
            )}

            {/* Filtered Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPromotions.map((promo) => (
                    <div key={promo.id} className={`group relative bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${promo.isActive
                        ? 'border-slate-200 dark:border-white/10 shadow-lg'
                        : 'border-slate-200 dark:border-white/5 opacity-80'
                        }`}>
                        {/* Card Image Area */}
                        <div className="h-40 w-full bg-slate-100 dark:bg-black/30 relative overflow-hidden rounded-t-3xl border-b border-slate-100 dark:border-white/5">
                            {promo.imageUrl ? (
                                <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                                    <ImagePattern />
                                </div>
                            )}

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${promo.isActive
                                    ? 'bg-green-500 text-white'
                                    : 'bg-slate-900/50 text-white'
                                    }`}>
                                    {promo.isActive ? 'Active' : 'Draft'}
                                </span>
                            </div>

                            {/* Position Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="px-2.5 py-1.5 rounded-lg bg-black/40 text-white text-[10px] uppercase font-bold backdrop-blur-md border border-white/10 shadow-sm flex items-center gap-1.5">
                                    <LayoutTemplate size={10} />
                                    {promo.position.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-1">{promo.title}</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{promo.style} Theme</p>
                                </div>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-black/20 rounded-xl mb-6 flex items-center justify-between group/code cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border border-dashed border-slate-200 dark:border-white/10"
                                onClick={() => handleCopyCode(promo.discountCode, promo.id)}
                            >
                                <code className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {promo.discountCode}
                                </code>
                                {copiedId === promo.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-400 group-hover/code:text-blue-500" />}
                            </div>

                            {/* Action Footer */}
                            <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                                <button
                                    onClick={() => toggleActive(promo)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${promo.isActive
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {promo.isActive ? <><Eye size={16} /> Live</> : <><EyeOff size={16} /> Hidden</>}
                                </button>
                                <button
                                    onClick={() => { setCurrentPromo(promo); setIsEditing(true); setActiveTab('content'); }}
                                    className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl dark:bg-white/5 dark:text-slate-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(promo.id)}
                                    className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl dark:bg-white/5 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ImagePattern = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20 translate-y-2">
        <path d="M50 20L40 30L35 25L20 40H60V30L50 20Z" fill="currentColor" />
        <circle cx="20" cy="15" r="5" fill="currentColor" />
    </svg>
);

export default Promotions;
