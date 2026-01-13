import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Search, Filter, Eye, EyeOff, LayoutTemplate, Tag, Clock, Image as ImageIcon, Copy, Check, BarChart3, MoreVertical, AlertCircle, Zap, ArrowRight } from 'lucide-react';
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
    positions: string[];
    style: 'amber' | 'blue' | 'luxury';
    frequency: 'once' | 'always' | 'daily';
    hideIfClaimed: boolean;
    imageUrl?: string;
    modalImageUrl?: string;
    createdAt: any;
}

const Promotions = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPromo, setCurrentPromo] = useState<Partial<Promotion>>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showAssetPicker, setShowAssetPicker] = useState(false);
    const [pickingFor, setPickingFor] = useState<'imageUrl' | 'modalImageUrl'>('imageUrl');
    const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'promotions'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPromotions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion)));
            setLoading(false);
        }, (error) => {
            console.error("Promotions Fetch Error:", error);
            setLoading(false); // Stop loading even on error
        });
        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        if (!currentPromo.title || !currentPromo.discountCode) return alert('Title and Code are required');

        try {
            console.log("Attempting to save promotion:", currentPromo);
            if (currentPromo.id) {
                await updateDoc(doc(db, 'promotions', currentPromo.id), {
                    ...currentPromo,
                    updatedAt: serverTimestamp()
                });
                console.log("Promotion updated successfully");
            } else {
                const docRef = await addDoc(collection(db, 'promotions'), {
                    ...currentPromo,
                    isActive: false, // Default inactive
                    positions: currentPromo.positions || ['popup'],
                    style: currentPromo.style || 'luxury',
                    frequency: currentPromo.frequency || 'once',
                    hideIfClaimed: currentPromo.hideIfClaimed ?? true,
                    createdAt: serverTimestamp()
                });
                console.log("Promotion created with ID:", docRef.id);
            }
            setIsEditing(false);
            setCurrentPromo({});
            setActiveTab('content');
        } catch (error) {
            console.error("Error saving promo:", error);
            alert("Failed to save promotion: " + (error as any).message);
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
                    setCurrentPromo(prev => ({ ...prev, [pickingFor]: url }));
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
                                    type="button"
                                    onClick={() => setActiveTab('content')}
                                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                >
                                    Content & Details
                                </button>
                                <button
                                    type="button"
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
                                                onClick={() => { setPickingFor('imageUrl'); setShowAssetPicker(true); }}
                                                className={`aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer relative group overflow-hidden ${currentPromo.imageUrl
                                                    ? 'border-blue-500/50 bg-slate-900'
                                                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-50 hover:bg-blue-50 dark:hover:bg-blue-900/10'}`}
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

                                        {/* Left: Modal specific Image Picker */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex justify-between">
                                                Modal/Popup Image
                                                <span className="text-xs font-normal text-slate-500">Vertical Recommended</span>
                                            </label>

                                            <div
                                                onClick={() => { setPickingFor('modalImageUrl'); setShowAssetPicker(true); }}
                                                className={`aspect-[4/5] rounded-2xl border-2 border-dashed transition-all cursor-pointer relative group overflow-hidden ${currentPromo.modalImageUrl
                                                    ? 'border-indigo-500/50 bg-slate-900'
                                                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}`}
                                            >
                                                {currentPromo.modalImageUrl ? (
                                                    <>
                                                        <img src={currentPromo.modalImageUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm">Change Image</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 group-hover:text-indigo-500">
                                                        <LayoutTemplate size={32} className="mb-2" />
                                                        <div className="text-center px-4">
                                                            <span className="font-bold text-sm block">Special Modal Image</span>
                                                            <span className="text-[10px] opacity-70">Best for the dual-column popup</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Settings */}
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Display Placements</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { id: 'popup', label: 'General Popup', icon: <LayoutTemplate size={14} /> },
                                                        { id: 'banner', label: 'Sticky Banner', icon: <Tag size={14} /> },
                                                        { id: 'floating_corner', label: 'Floating Widget', icon: <Zap size={14} /> },
                                                        { id: 'hero', label: 'Hero Section', icon: <ImageIcon size={14} /> },
                                                        { id: 'in_between_sections', label: 'Inline Section', icon: <Filter size={14} /> },
                                                        { id: 'exit_intent', label: 'Exit Intent', icon: <ArrowRight size={14} /> },
                                                        { id: 'footer_banner', label: 'Footer Banner', icon: <Clock size={14} /> }
                                                    ].map((pos) => (
                                                        <button
                                                            key={pos.id}
                                                            type="button"
                                                            onClick={() => {
                                                                const currentPositions = currentPromo.positions || [];
                                                                const newPositions = currentPositions.includes(pos.id)
                                                                    ? currentPositions.filter(p => p !== pos.id)
                                                                    : [...currentPositions, pos.id];
                                                                setCurrentPromo({ ...currentPromo, positions: newPositions });
                                                            }}
                                                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-xs font-bold ${(currentPromo.positions || []).includes(pos.id)
                                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                                : 'border-transparent bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {pos.icon}
                                                            {pos.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Display Frequency</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {(['once', 'daily', 'always'] as const).map((freq) => (
                                                        <button
                                                            key={freq}
                                                            type="button"
                                                            onClick={() => setCurrentPromo({ ...currentPromo, frequency: freq })}
                                                            className={`py-2 px-1 rounded-xl capitalize font-bold text-[10px] border-2 transition-all ${currentPromo.frequency === freq
                                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-md'
                                                                : 'border-transparent bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                                                        >
                                                            {freq}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-transparent hover:border-blue-500/30 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                        <EyeOff size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Hide if Claimed</p>
                                                        <p className="text-[10px] text-slate-500">Don't show after conversion</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentPromo({ ...currentPromo, hideIfClaimed: !currentPromo.hideIfClaimed })}
                                                    className={`w-10 h-6 rounded-full p-1 transition-all ${currentPromo.hideIfClaimed !== false ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${currentPromo.hideIfClaimed !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Theme Style</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['luxury', 'amber', 'blue'].map((style) => (
                                                        <button
                                                            key={style}
                                                            type="button"
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
                                type="button"
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPromotions.map((promo) => (
                    <motion.div
                        layout
                        key={promo.id}
                        className={`group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden ${promo.isActive
                            ? 'border-slate-200 dark:border-white/10'
                            : 'border-slate-200 dark:border-white/5 opacity-70 grayscale-[0.5]'
                            }`}
                    >
                        {/* Card Top: Visual Preview */}
                        <div className="h-64 w-full bg-slate-100 dark:bg-black/30 relative overflow-hidden border-b border-slate-100 dark:border-white/5">
                            {promo.imageUrl ? (
                                <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                                    <Zap size={64} className="opacity-10" />
                                </div>
                            )}

                            {/* Status Floating Badge */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-xl border ${promo.isActive
                                    ? 'bg-green-500/90 text-white border-white/20'
                                    : 'bg-slate-900/80 text-white border-white/10'
                                    }`}>
                                    {promo.isActive ? 'Live & Active' : 'Draft Mode'}
                                </span>
                                {promo.frequency !== 'always' && (
                                    <span className="px-4 py-2 rounded-2xl bg-black/60 text-white text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10 w-fit">
                                        Frequency: {promo.frequency}
                                    </span>
                                )}
                            </div>

                            {/* Theme Indicator */}
                            <div className="absolute bottom-6 left-6">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg ${promo.style === 'amber' ? 'bg-amber-500 text-white' :
                                    promo.style === 'blue' ? 'bg-blue-500 text-white' :
                                        'bg-slate-900 text-indigo-400'
                                    }`}>
                                    {promo.style} theme
                                </span>
                            </div>

                            <button
                                onClick={() => toggleActive(promo)}
                                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-xl border border-white/20"
                            >
                                {promo.isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                        {/* Card Body: Content */}
                        <div className="p-8">
                            <div className="mb-6">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-[1.1] mb-2 font-['Outfit']">
                                    {promo.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                                    {promo.description}
                                </p>
                            </div>

                            {/* Display Slots Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {(promo.positions || []).map(p => (
                                    <span key={p} className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 border border-transparent group-hover:border-blue-500/30 transition-colors">
                                        {p.replace('_', ' ')}
                                    </span>
                                ))}
                            </div>

                            {/* Redemtpion Footer */}
                            <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                                <div className="flex-1 p-3 bg-slate-50 dark:bg-black/40 rounded-2xl flex items-center justify-between group/code cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-slate-200 dark:border-white/10"
                                    onClick={() => handleCopyCode(promo.discountCode, promo.id)}
                                >
                                    <code className="text-sm font-mono font-black text-slate-700 dark:text-slate-300 tracking-wider">
                                        {promo.discountCode}
                                    </code>
                                    {copiedId === promo.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-400 group-hover/code:text-blue-500" />}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setCurrentPromo(promo); setIsEditing(true); setActiveTab('content'); }}
                                        className="p-4 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-2xl dark:bg-white/5 dark:text-slate-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(promo.id)}
                                        className="p-4 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-2xl dark:bg-white/5 dark:text-slate-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div >
    );
};

const ImagePattern = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20 translate-y-2">
        <path d="M50 20L40 30L35 25L20 40H60V30L50 20Z" fill="currentColor" />
        <circle cx="20" cy="15" r="5" fill="currentColor" />
    </svg>
);

export default Promotions;
