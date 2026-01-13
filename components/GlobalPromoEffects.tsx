import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, X, Clock, ArrowRight, Sparkles, Users } from 'lucide-react';
import { db } from '../src/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import DiscountBookingModal from './DiscountBookingModal';

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
    frequency?: 'once' | 'always' | 'daily';
    hideIfClaimed?: boolean;
    imageUrl?: string;
}

const GlobalPromoEffects: React.FC = () => {
    const [activePromo, setActivePromo] = useState<Promotion | null>(null);
    const [bannerPromo, setBannerPromo] = useState<Promotion | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFloatingWidget, setShowFloatingWidget] = useState(false);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Query for all active promotions
        const q = query(
            collection(db, 'promotions'),
            where('isActive', '==', true),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const promos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion));

            // Helper to check if a promo should be shown
            const shouldShowPromo = (promo: Promotion) => {
                // Check if claimed (if configured to hide)
                if (promo.hideIfClaimed !== false) {
                    const claimed = localStorage.getItem(`claimed_promo_${promo.id}`);
                    if (claimed) return false;
                }

                // Check frequency/dismissal
                const dismissedAt = localStorage.getItem(`dismissed_promo_${promo.id}`);
                if (dismissedAt) {
                    if (promo.frequency === 'once') return false;
                    if (promo.frequency === 'daily') {
                        const isToday = Date.now() - parseInt(dismissedAt) < 24 * 60 * 60 * 1000;
                        if (isToday) return false;
                    }
                }
                return true;
            };

            // 1. Handle Banner
            const banner = promos.find(p => p.position === 'banner');
            if (banner && shouldShowPromo(banner)) {
                setBannerPromo(banner);
                setShowBanner(true);
            } else {
                setShowBanner(false);
            }

            // 2. Handle Popup / Floating Widget (Priority: Popup > Floating)
            const globalPromo = promos.find(p => p.position === 'popup' || p.position === 'floating_corner');

            if (globalPromo && shouldShowPromo(globalPromo)) {
                setActivePromo(globalPromo);

                if (globalPromo.position === 'popup') {
                    // Delay popup slightly
                    const timer = setTimeout(() => setIsModalOpen(true), 3000);
                    return () => clearTimeout(timer);
                } else if (globalPromo.position === 'floating_corner') {
                    setShowFloatingWidget(true);
                }
            } else {
                setActivePromo(null);
                setShowFloatingWidget(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setShowFloatingWidget(false);
        if (activePromo) {
            localStorage.setItem(`dismissed_promo_${activePromo.id}`, Date.now().toString());
        }
    };

    const handleCloseBanner = () => {
        setShowBanner(false);
        if (bannerPromo) {
            localStorage.setItem(`dismissed_promo_${bannerPromo.id}`, Date.now().toString());
        }
    };

    const handleClaimSuccess = () => {
        if (activePromo) {
            localStorage.setItem(`claimed_promo_${activePromo.id}`, Date.now().toString());
            setIsModalOpen(false);
            setShowFloatingWidget(false);
        }
    };

    const handleWidgetClick = () => {
        setIsModalOpen(true);
        setShowFloatingWidget(false);
    };

    const handleBannerClick = () => {
        // If banner acts as a trigger for the modal (optional, depends on banner content)
        // For now, let's make the main modal use the banner content if clicked
        if (bannerPromo) {
            setActivePromo(bannerPromo);
            setIsModalOpen(true);
        }
    };

    return (
        <>
            {/* --- TOP STICKY BANNER --- */}
            <AnimatePresence>
                {showBanner && bannerPromo && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-0 left-0 right-0 z-[60] w-full"
                    >
                        <div className={`relative overflow-hidden border-b border-white/20 shadow-2xl`}>
                            {/* Animated Shimmering Background */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${bannerPromo.style === 'amber' ? 'from-amber-600 via-orange-500 to-amber-700' : bannerPromo.style === 'blue' ? 'from-blue-600 via-cyan-500 to-blue-700' : 'from-slate-900 via-indigo-900 to-slate-900'} transition-colors duration-1000`} />

                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                            />

                            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-white/20 items-center justify-center shrink-0 animate-bounce">
                                        <Zap size={20} className="text-white fill-current" />
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[10px] font-black uppercase text-white/90 bg-white/20 px-2 py-0.5 rounded-full tracking-[0.1em] border border-white/20">
                                                Special Opportunity
                                            </span>
                                            <div className="flex h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                                        </div>
                                        <p className="text-white font-bold text-sm sm:text-base tracking-tight leading-tight">
                                            {bannerPromo.title}: <span className="font-medium text-white/80">{bannerPromo.description}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Simulated Live Countdown */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/20 border border-white/20 backdrop-blur-md">
                                        <Clock size={14} className="text-white/60" />
                                        <span className="text-xs font-mono font-black text-white">00:59:59</span>
                                    </div>

                                    <button
                                        onClick={handleBannerClick}
                                        className="px-6 py-2 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                                    >
                                        {bannerPromo.buttonText || 'Claim Now'}
                                    </button>

                                    <button
                                        onClick={handleCloseBanner}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/60 hover:text-white"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MAIN CONVERSION MODAL --- */}
            {activePromo && (
                <DiscountBookingModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={handleClaimSuccess}
                    offerTitle={activePromo.title}
                    offerDescription={activePromo.description}
                    discountCode={activePromo.discountCode}
                    buttonText={activePromo.buttonText}
                    offerImage={activePromo.imageUrl}
                    style={activePromo.style}
                />
            )}

            {/* --- FLOATING WIDGET (Redesigned) --- */}
            <AnimatePresence>
                {showFloatingWidget && activePromo && activePromo.position === 'floating_corner' && !isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="fixed bottom-8 right-8 z-[50] w-[320px] cursor-pointer group"
                        onClick={handleWidgetClick}
                    >
                        {/* Shimmer Border Ring */}
                        <div className={`absolute -inset-[2px] bg-gradient-to-r ${activePromo.style === 'amber' ? 'from-amber-400 to-orange-600' : activePromo.style === 'blue' ? 'from-blue-400 to-cyan-600' : 'from-indigo-500 to-purple-600'} rounded-3xl opacity-50 blur-[2px] group-hover:opacity-100 transition-opacity animate-pulse`} />

                        <div className="relative bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[1.5rem] p-5 shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden">
                            {/* Animated Background Mesh for Widget */}
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/2 ${activePromo.style === 'amber' ? 'bg-amber-500' : activePromo.style === 'blue' ? 'bg-blue-500' : 'bg-indigo-500'}`} />

                            <button
                                onClick={(e) => { e.stopPropagation(); handleCloseModal(); }}
                                className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-full transition-all z-20"
                            >
                                <X size={14} />
                            </button>

                            <div className="flex items-start gap-4 relative z-10">
                                <div className="relative shrink-0">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activePromo.style === 'amber' ? 'from-amber-500 to-orange-600' : activePromo.style === 'blue' ? 'from-blue-500 to-cyan-600' : 'from-indigo-600 to-violet-600'} p-[2px] shadow-lg shadow-blue-500/20`}>
                                        <div className="w-full h-full rounded-[0.9rem] bg-white dark:bg-slate-800 flex items-center justify-center">
                                            {activePromo.imageUrl ? (
                                                <img src={activePromo.imageUrl} alt="Icon" className="w-full h-full object-cover rounded-[0.8rem]" />
                                            ) : (
                                                <Zap size={24} className={`${activePromo.style === 'amber' ? 'text-amber-500' : activePromo.style === 'blue' ? 'text-blue-500' : 'text-indigo-500'} fill-current`} />
                                            )}
                                        </div>
                                    </div>
                                    {/* Pulse Indicator */}
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-slate-900"></span>
                                    </span>
                                </div>

                                <div className="flex-1 pt-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.15em] ${activePromo.style === 'amber' ? 'text-amber-600 dark:text-amber-400' : activePromo.style === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                            Active Offer
                                        </p>
                                    </div>
                                    <h4 className="font-black text-slate-900 dark:text-white leading-tight text-[15px] mb-2 pr-4">
                                        {activePromo.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full w-fit">
                                        <Users size={12} className="text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">12 people claimed today</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalPromoEffects;
