import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, X, Clock, ArrowRight, Sparkles } from 'lucide-react';
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="relative z-[60] w-full"
                    >
                        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden relative shadow-xl border-b border-white/10">
                            {/* Animated Background Mesh */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer_5s_infinite] pointer-events-none" />

                            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left relative z-10">

                                <div className="flex items-center gap-3 flex-1 min-w-0 justify-center sm:justify-start">
                                    <div className="hidden sm:flex w-8 h-8 rounded-full bg-white/10 items-center justify-center shrink-0 animate-pulse">
                                        <Sparkles size={16} className="text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm sm:text-base text-blue-100">
                                            <span className="font-bold text-white uppercase tracking-wider bg-blue-600/50 px-2 py-0.5 rounded text-[10px] mr-2 border border-blue-400/30">
                                                {bannerPromo.title}
                                            </span>
                                            {bannerPromo.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    {/* Timer Pill */}
                                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 border border-white/10 text-xs font-mono text-blue-200">
                                        <Clock size={12} />
                                        <span>Ends in 24h</span>
                                    </div>

                                    <button
                                        onClick={handleBannerClick}
                                        className="group flex items-center gap-1.5 px-4 py-1.5 bg-white text-blue-900 rounded-full text-xs font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg shadow-white/10"
                                    >
                                        {bannerPromo.buttonText || 'Claim Offer'}
                                        <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={handleCloseBanner}
                                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-blue-200 hover:text-white"
                                    >
                                        <X size={16} />
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
                />
            )}

            {/* --- FLOATING WIDGET (Redesigned) --- */}
            <AnimatePresence>
                {showFloatingWidget && activePromo && activePromo.position === 'floating_corner' && !isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="fixed bottom-6 right-6 z-[50] max-w-sm w-auto cursor-pointer group"
                        onClick={handleWidgetClick}
                    >
                        {/* Pulse Effect Ring */}
                        <div className="absolute -inset-1 bg-blue-500/30 rounded-3xl blur-md group-hover:bg-blue-500/50 transition-all duration-500 animate-pulse" />

                        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 pr-10 shadow-2xl border border-white/50 dark:border-white/10 flex items-center gap-4 hover:-translate-y-1 transition-transform overflow-hidden">
                            {/* Decorative Shine */}
                            <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-[shimmer_1s_ease-in-out_infinite]" />

                            <button
                                onClick={(e) => { e.stopPropagation(); handleCloseModal(); }}
                                className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10"
                            >
                                <X size={14} />
                            </button>

                            <div className="relative w-12 h-12 shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl rotate-3 group-hover:rotate-6 transition-transform shadow-lg" />
                                <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-white/5 z-10">
                                    <Zap size={24} className="text-blue-600 dark:text-blue-400 fill-current" />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Limited Offer</p>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white leading-tight text-sm pr-2">
                                    {activePromo.title}
                                </h4>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalPromoEffects;
