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
    positions: string[];
    style: 'amber' | 'blue' | 'luxury';
    frequency?: 'once' | 'always' | 'daily';
    hideIfClaimed?: boolean;
    imageUrl?: string;
}

const GlobalPromoEffects: React.FC = () => {
    const [activePromo, setActivePromo] = useState<Promotion | null>(null);
    const [bannerPromo, setBannerPromo] = useState<Promotion | null>(null);
    const [activeFooter, setActiveFooter] = useState<Promotion | null>(null);

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
            const fetchedPromos = snapshot.docs.map(doc => {
                const data = doc.data();
                const positions = Array.isArray(data.positions)
                    ? data.positions
                    : data.position
                        ? [data.position]
                        : [];
                return { id: doc.id, ...data, positions } as Promotion;
            });

            // Helper to check if a promo should be shown
            const shouldShowPromo = (promo: Promotion) => {
                if (promo.hideIfClaimed !== false) {
                    if (localStorage.getItem(`claimed_promo_${promo.id}`)) return false;
                }
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

            const visiblePromos = fetchedPromos.filter(shouldShowPromo);

            // Slot Assignment
            const banner = visiblePromos.find(p => p.positions.includes('banner'));
            const popup = visiblePromos.find(p => p.positions.includes('popup'));
            const floating = visiblePromos.find(p => p.positions.includes('floating_corner'));
            const footer = visiblePromos.find(p => p.positions.includes('footer_banner'));
            const exitIntent = visiblePromos.find(p => p.positions.includes('exit_intent'));

            setBannerPromo(banner || null);
            setShowBanner(!!banner);
            setActiveFooter(footer || null);

            if (popup) {
                setActivePromo(popup);
                setTimeout(() => setIsModalOpen(true), 3000);
            } else if (floating) {
                setActivePromo(floating);
                setShowFloatingWidget(true);
            } else {
                setActivePromo(null);
                setShowFloatingWidget(false);
                setIsModalOpen(false);
            }

            if (exitIntent) {
                const handleExit = (e: MouseEvent) => {
                    const dismissed = localStorage.getItem(`dismissed_promo_${exitIntent.id}`);
                    if (e.clientY < 5 && !dismissed && !isModalOpen) {
                        setActivePromo(exitIntent);
                        setIsModalOpen(true);
                        document.removeEventListener('mouseleave', handleExit);
                    }
                };
                document.addEventListener('mouseleave', handleExit);
            }
        });

        return () => unsubscribe();
    }, [isModalOpen]);

    const handleDismiss = (id: string) => {
        localStorage.setItem(`dismissed_promo_${id}`, Date.now().toString());
        if (activePromo?.id === id) {
            setIsModalOpen(false);
            setShowFloatingWidget(false);
            setActivePromo(null);
        }
        if (bannerPromo?.id === id) setShowBanner(false);
        if (activeFooter?.id === id) setActiveFooter(null);
    };

    const handleClaimSuccess = () => {
        if (activePromo) {
            localStorage.setItem(`claimed_promo_${activePromo.id}`, Date.now().toString());
            setIsModalOpen(false);
            setShowFloatingWidget(false);
            setActivePromo(null);
        }
    };

    const handleWidgetClick = () => {
        setIsModalOpen(true);
        setShowFloatingWidget(false);
    };

    const handleBannerClick = () => {
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

                                    <button onClick={() => handleDismiss(bannerPromo.id)} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white/60 hover:text-white">
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
                    onClose={() => handleDismiss(activePromo.id)}
                    onSuccess={handleClaimSuccess}
                    offerTitle={activePromo.title}
                    offerDescription={activePromo.description}
                    discountCode={activePromo.discountCode}
                    buttonText={activePromo.buttonText}
                    offerImage={activePromo.imageUrl}
                    style={activePromo.style}
                />
            )}

            {/* --- FLOATING WIDGET --- */}
            <AnimatePresence>
                {showFloatingWidget && activePromo && activePromo.positions.includes('floating_corner') && !isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="fixed bottom-8 right-8 z-[50] w-[320px] cursor-pointer group"
                        onClick={handleWidgetClick}
                    >
                        <div className={`absolute -inset-[2px] bg-gradient-to-r ${activePromo.style === 'amber' ? 'from-amber-400 to-orange-600' : activePromo.style === 'blue' ? 'from-blue-400 to-cyan-600' : 'from-indigo-500 to-purple-600'} rounded-3xl opacity-50 blur-[2px] group-hover:opacity-100 transition-opacity animate-pulse`} />
                        <div className="relative bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[1.5rem] p-5 shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden">
                            <button onClick={(e) => { e.stopPropagation(); handleDismiss(activePromo.id); }} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 rounded-full transition-all z-20">
                                <X size={14} />
                            </button>
                            <div className="flex items-start gap-4 relative z-10">
                                <div className="relative shrink-0">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activePromo.style === 'amber' ? 'from-amber-500 to-orange-600' : activePromo.style === 'blue' ? 'from-blue-500 to-cyan-600' : 'from-indigo-600 to-violet-600'} p-[2px]`}>
                                        <div className="w-full h-full rounded-[0.9rem] bg-white dark:bg-slate-800 flex items-center justify-center">
                                            {activePromo.imageUrl ? <img src={activePromo.imageUrl} className="w-full h-full object-cover rounded-[0.8rem]" /> : <Zap size={24} className="text-indigo-500" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="font-black text-slate-900 dark:text-white leading-tight text-[15px] mb-2">{activePromo.title}</h4>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full w-fit">
                                        <Users size={12} className="text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-500">Claimed 50+ times</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- FOOTER BANNER --- */}
            <AnimatePresence>
                {activeFooter && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-[60] p-4 pointer-events-none"
                    >
                        <div className={`max-w-4xl mx-auto pointer-events-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative ${activeFooter.style === 'luxury' ? 'bg-slate-900' : activeFooter.style === 'amber' ? 'bg-orange-600' : 'bg-blue-600'}`}>
                            <div className="px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-2 rounded-lg animate-pulse"><Zap size={18} className="text-white" /></div>
                                    <div>
                                        <h4 className="text-white font-black text-sm">{activeFooter.title}</h4>
                                        <p className="text-white/70 text-[10px] uppercase font-bold tracking-widest">{activeFooter.discountCode}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => { setActivePromo(activeFooter); setIsModalOpen(true); }} className="px-5 py-2 bg-white text-slate-900 rounded-full font-black text-xs hover:scale-105 transition-transform shadow-lg">Claim Offer</button>
                                    <button onClick={() => handleDismiss(activeFooter.id)} className="text-white/50 hover:text-white"><X size={18} /></button>
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
