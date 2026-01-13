import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, X, Clock, ArrowRight, Sparkles, Users, Gift } from 'lucide-react';
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
    modalImageUrl?: string;
}

const GlobalPromoEffects: React.FC = () => {
    const { t } = useTranslation();
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [activeSlots, setActiveSlots] = useState<Record<string, string | null>>({
        banner: null,
        popup: null,
        floating_corner: null,
        footer_banner: null
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [hasTriggeredExitIntent, setHasTriggeredExitIntent] = useState(false);

    // 1. Fetch Promotions (Runs once on mount)
    useEffect(() => {
        const q = query(collection(db, 'promotions'), where('isActive', '==', true));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const promoList = snapshot.docs.map(doc => {
                const data = doc.data();
                const positions = Array.isArray(data.positions)
                    ? data.positions
                    : data.position
                        ? [data.position]
                        : ['popup'];
                return { id: doc.id, ...data, positions } as Promotion;
            });
            setPromotions(promoList);
        }, (error) => {
            console.error("Firebase Snapshot Error:", error);
        });
        return () => unsubscribe();
    }, []);

    // 2. Logic & Slot Assignment (Runs when promotions or hasTriggeredExitIntent changes)
    useEffect(() => {
        if (promotions.length === 0) return;

        const slots: Record<string, string | null> = { banner: null, popup: null, floating_corner: null, footer_banner: null };

        promotions.forEach(p => {
            const isClaimed = localStorage.getItem(`claimed_promo_${p.id}`);
            const dismissedAt = localStorage.getItem(`dismissed_promo_${p.id}`);
            let shouldShow = !isClaimed;

            if (dismissedAt) {
                if (p.frequency === 'once') shouldShow = false;
                else if (p.frequency === 'daily') {
                    const isToday = Date.now() - parseInt(dismissedAt) < 24 * 60 * 60 * 1000;
                    if (isToday) shouldShow = false;
                }
            }

            if (shouldShow) {
                if (p.positions.includes('banner')) slots.banner = p.id;
                if (p.positions.includes('popup') && !slots.popup) slots.popup = p.id;
                if (p.positions.includes('floating_corner')) slots.floating_corner = p.id;
                if (p.positions.includes('footer_banner')) slots.footer_banner = p.id;
            }
        });

        setActiveSlots(slots);

        // Auto-trigger first popup if any
        if (slots.popup && !modalOpen && !hasTriggeredExitIntent) {
            const timer = setTimeout(() => setModalOpen(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [promotions]);

    // 3. Exit Intent Logic
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 5 && !hasTriggeredExitIntent && !modalOpen) {
                const exitPromo = promotions.find(p => p.positions.includes('exit_intent'));
                if (exitPromo) {
                    const isClaimed = localStorage.getItem(`claimed_promo_${exitPromo.id}`);
                    if (!isClaimed) {
                        setActiveSlots(prev => ({ ...prev, popup: exitPromo.id }));
                        setModalOpen(true);
                        setHasTriggeredExitIntent(true);
                    }
                }
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasTriggeredExitIntent, promotions, modalOpen]);

    const handleDismiss = (id: string, slot: string) => {
        localStorage.setItem(`dismissed_promo_${id}`, Date.now().toString());
        setActiveSlots(prev => ({ ...prev, [slot]: null }));
        if (slot === 'popup') setModalOpen(false);
    };

    const handleClaimSuccess = (id: string) => {
        localStorage.setItem(`claimed_promo_${id}`, Date.now().toString());
        // Do not close or clear slots immediately, let the modal show success state
    };

    const bannerPromo = promotions.find(p => p.id === activeSlots.banner);
    const popupPromo = promotions.find(p => p.id === activeSlots.popup);
    const floatPromo = promotions.find(p => p.id === activeSlots.floating_corner);
    const footerPromo = promotions.find(p => p.id === activeSlots.footer_banner);

    const themeStyles = {
        luxury: {
            gradient: "from-slate-950 via-indigo-950 to-slate-950",
            accent: "from-indigo-400 to-violet-400",
            button: "bg-gradient-to-r from-indigo-500 to-violet-600 shadow-indigo-500/25",
            glass: "bg-white/5 border-white/10",
            glow: "bg-indigo-500/20",
            shimmer: "via-white/20"
        },
        amber: {
            gradient: "from-amber-600 via-orange-600 to-amber-700",
            accent: "from-amber-200 to-orange-100",
            button: "bg-gradient-to-r from-white to-orange-50 text-orange-600 shadow-orange-500/25",
            glass: "bg-amber-900/40 border-amber-500/30",
            glow: "bg-amber-500/30",
            shimmer: "via-orange-300/30"
        },
        blue: {
            gradient: "from-blue-600 via-cyan-600 to-blue-700",
            accent: "from-blue-100 to-cyan-100",
            button: "bg-gradient-to-r from-white to-blue-50 text-blue-600 shadow-blue-500/25",
            glass: "bg-blue-900/40 border-blue-500/30",
            glow: "bg-blue-500/30",
            shimmer: "via-blue-300/30"
        }
    };

    return (
        <>
            {/* 1. TOP STICKY BANNER - ULTRA PREMIUM */}
            <AnimatePresence>
                {bannerPromo && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className={`fixed top-0 left-0 right-0 z-[100] h-14 bg-gradient-to-r ${themeStyles[bannerPromo.style || 'luxury'].gradient} border-b border-white/10 shadow-2xl relative overflow-hidden`}
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                        <div className={`absolute -inset-[500px] bg-gradient-to-tr ${themeStyles[bannerPromo.style || 'luxury'].glow} opacity-20 blur-3xl pointer-events-none`} />

                        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-4 flex-1">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-red-500/20"
                                >
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    Live Global Offer
                                </motion.div>

                                <div className="flex items-center gap-3">
                                    {bannerPromo.imageUrl && (
                                        <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shrink-0 shadow-xl">
                                            <img src={bannerPromo.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <p className="text-white text-xs md:text-sm font-bold tracking-tight line-clamp-1">
                                        <span className={`bg-gradient-to-r ${themeStyles[bannerPromo.style || 'luxury'].accent} bg-clip-text text-transparent mr-2 font-black uppercase tracking-wider`}>
                                            {bannerPromo.title}:
                                        </span>
                                        {bannerPromo.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex items-center gap-3 mr-4">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Hurry</span>
                                    <div className="flex gap-1.5">
                                        {['00', '42', '15'].map((num, i) => (
                                            <div key={i} className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-white font-black shadow-inner">
                                                {num}
                                                {i < 2 && <span className="absolute -right-3 text-white/20">:</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setActiveSlots(prev => ({ ...prev, popup: bannerPromo.id })); setModalOpen(true); }}
                                    className={`px-6 py-2.5 ${themeStyles[bannerPromo.style || 'luxury'].button} text-xs font-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap group relative overflow-hidden`}
                                >
                                    <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                    <span className="relative z-10">{bannerPromo.buttonText}</span>
                                </button>
                                <button
                                    onClick={() => handleDismiss(bannerPromo.id, 'banner')}
                                    className="p-2 text-white/40 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 2. FLOATING CORNER WIDGET - GLASSMORPHISM */}
            <AnimatePresence>
                {floatPromo && !modalOpen && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        className={`fixed bottom-8 right-8 z-[90] w-80 h-36 backdrop-blur-3xl rounded-[2.5rem] border ${themeStyles[floatPromo.style || 'luxury'].glass} shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] p-5 flex gap-5 cursor-pointer group hover:scale-[1.05] transition-all duration-500 overflow-hidden ring-1 ring-white/20`}
                        onClick={() => { setActiveSlots(prev => ({ ...prev, popup: floatPromo.id })); setModalOpen(true); }}
                    >
                        <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-[60px] pointer-events-none ${themeStyles[floatPromo.style || 'luxury'].glow} opacity-60`} />

                        <div className="w-28 h-28 rounded-3xl overflow-hidden shrink-0 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] ring-2 ring-white/10 group-hover:scale-110 transition-transform duration-700 bg-black/40">
                            {floatPromo.imageUrl ? (
                                <img src={floatPromo.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Zap size={40} className="text-white opacity-20 fill-current" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center relative z-10">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r ${themeStyles[floatPromo.style || 'luxury'].accent} bg-clip-text text-transparent mb-2`}>
                                Verified Offer
                            </span>
                            <h4 className="text-white text-base font-black leading-tight mb-3 line-clamp-2 drop-shadow-md">{floatPromo.title}</h4>
                            <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-wider bg-white/5 py-1 px-2.5 rounded-full w-fit">
                                <Sparkles size={12} className="animate-pulse" />
                                <span>Claimed by 52 today</span>
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleDismiss(floatPromo.id, 'floating_corner'); }}
                            className="absolute top-4 right-4 p-1.5 text-white/20 hover:text-white transition-colors bg-white/5 rounded-full"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. FOOTER BANNER - THE "FOMO" BAR */}
            <AnimatePresence>
                {footerPromo && (
                    <motion.div
                        initial={{ y: 200 }}
                        animate={{ y: 0 }}
                        exit={{ y: 200 }}
                        className={`fixed bottom-0 left-0 right-0 z-[100] py-8 bg-gradient-to-r ${themeStyles[footerPromo.style || 'luxury'].gradient} border-t border-white/20 shadow-[0_-30px_60px_rgba(0,0,0,0.6)] overflow-hidden`}
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
                        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="flex items-center gap-8">
                                <motion.div
                                    animate={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="hidden sm:block p-4 rounded-[1.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl"
                                >
                                    <Gift size={32} className="text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-white text-2xl font-black tracking-tighter mb-1 uppercase italic">{footerPromo.title}</h3>
                                    <p className="text-white/60 text-sm font-bold tracking-wide uppercase px-1">{footerPromo.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className="flex-1 md:w-64 h-12 bg-black/40 rounded-2xl border border-white/10 overflow-hidden p-1.5 flex flex-col justify-center relative shadow-inner">
                                    <div className="flex justify-between items-center absolute inset-0 px-4 text-[9px] font-black text-white/40 uppercase tracking-widest z-10">
                                        <span>Status</span>
                                        <span>85% Redeemed</span>
                                    </div>
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "85%" }}
                                        transition={{ duration: 3, ease: "circOut" }}
                                        className={`h-full rounded-xl bg-gradient-to-r ${themeStyles[footerPromo.style || 'luxury'].accent} shadow-[0_0_20px_rgba(255,255,255,0.4)] relative`}
                                    >
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40" />
                                    </motion.div>
                                </div>
                                <button
                                    onClick={() => { setActiveSlots(prev => ({ ...prev, popup: footerPromo.id })); setModalOpen(true); }}
                                    className={`px-10 py-4 ${themeStyles[footerPromo.style || 'luxury'].button} text-sm font-black rounded-2xl transition-all hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-2xl whitespace-nowrap group relative overflow-hidden`}
                                >
                                    <div className="absolute inset-x-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                                    <div className="flex items-center gap-3 relative z-10">
                                        {footerPromo.buttonText}
                                        <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleDismiss(footerPromo.id, 'footer_banner')}
                                    className="p-3 text-white/20 hover:text-white transition-colors bg-white/5 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN MODAL TRIGGER */}
            {popupPromo && (
                <DiscountBookingModal
                    isOpen={modalOpen}
                    onClose={() => handleDismiss(popupPromo.id, 'popup')}
                    offerTitle={popupPromo.title}
                    offerDescription={popupPromo.description}
                    discountCode={popupPromo.discountCode}
                    buttonText={popupPromo.buttonText}
                    offerImage={popupPromo.imageUrl}
                    modalImageUrl={popupPromo.modalImageUrl}
                    style={popupPromo.style}
                    onSuccess={() => handleClaimSuccess(popupPromo.id)}
                />
            )}
        </>
    );
};

export default GlobalPromoEffects;
