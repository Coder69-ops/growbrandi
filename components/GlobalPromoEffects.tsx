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

            // Slot Assignment logic
            const slots: Record<string, string | null> = { banner: null, popup: null, floating_corner: null, footer_banner: null };

            promoList.forEach(p => {
                // Persistent check: hide if claimed or dismissed (once/daily logic)
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
                    if (p.positions.includes('popup') && !slots.popup) slots.popup = p.id; // Take first available popup
                    if (p.positions.includes('floating_corner')) slots.floating_corner = p.id;
                    if (p.positions.includes('footer_banner')) slots.footer_banner = p.id;
                }
            });

            setActiveSlots(slots);

            // Auto-trigger first popup if any
            if (slots.popup && !modalOpen) {
                setTimeout(() => setModalOpen(true), 3000);
            }
        });

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
        return () => {
            unsubscribe();
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [hasTriggeredExitIntent, promotions, modalOpen]);

    const handleDismiss = (id: string, slot: string) => {
        localStorage.setItem(`dismissed_promo_${id}`, Date.now().toString());
        setActiveSlots(prev => ({ ...prev, [slot]: null }));
        if (slot === 'popup') setModalOpen(false);
    };

    const handleClaimSuccess = (id: string) => {
        localStorage.setItem(`claimed_promo_${id}`, Date.now().toString());
        setModalOpen(false);
        // Clear all slots for this specific promo
        setActiveSlots(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => {
                if (next[k] === id) next[k] = null;
            });
            return next;
        });
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
            glow: "bg-indigo-500/20"
        },
        amber: {
            gradient: "from-amber-600 via-orange-600 to-amber-700",
            accent: "from-amber-200 to-orange-100",
            button: "bg-gradient-to-r from-white to-orange-50 text-orange-600 shadow-orange-500/25",
            glass: "bg-amber-900/40 border-amber-500/30",
            glow: "bg-amber-500/30"
        },
        blue: {
            gradient: "from-blue-600 via-cyan-600 to-blue-700",
            accent: "from-blue-100 to-cyan-100",
            button: "bg-gradient-to-r from-white to-blue-50 text-blue-600 shadow-blue-500/25",
            glass: "bg-blue-900/40 border-blue-500/30",
            glow: "bg-blue-500/30"
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

                        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-4 flex-1">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500 text-[9px] font-black text-white uppercase tracking-widest"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    Live Offer
                                </motion.div>

                                <div className="flex items-center gap-3">
                                    {bannerPromo.imageUrl && (
                                        <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shrink-0 shadow-lg">
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

                            <div className="flex items-center gap-3">
                                <div className="hidden lg:flex items-center gap-2 mr-4">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Ends in</span>
                                    <div className="flex gap-1">
                                        {['00', '45', '08'].map((num, i) => (
                                            <div key={i} className="bg-black/20 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-[10px] font-mono text-white font-black">
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setActiveSlots(prev => ({ ...prev, popup: bannerPromo.id })); setModalOpen(true); }}
                                    className={`px-5 py-2 ${themeStyles[bannerPromo.style || 'luxury'].button} text-xs font-black rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap`}
                                >
                                    {bannerPromo.buttonText}
                                </button>
                                <button
                                    onClick={() => handleDismiss(bannerPromo.id, 'banner')}
                                    className="p-2 text-white/40 hover:text-white transition-colors"
                                >
                                    <X size={16} />
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
                        className={`fixed bottom-6 right-6 z-[90] w-72 h-32 backdrop-blur-2xl rounded-3xl border ${themeStyles[floatPromo.style || 'luxury'].glass} shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] p-4 flex gap-4 cursor-pointer group hover:scale-[1.02] transition-transform overflow-hidden`}
                        onClick={() => { setActiveSlots(prev => ({ ...prev, popup: floatPromo.id })); setModalOpen(true); }}
                    >
                        <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl pointer-events-none ${themeStyles[floatPromo.style || 'luxury'].glow}`} />

                        <div className="w-24 h-full rounded-2xl overflow-hidden shrink-0 shadow-inner bg-black/20 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500">
                            {floatPromo.imageUrl ? (
                                <img src={floatPromo.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Zap size={32} className="text-white opacity-20" />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-center relative z-10">
                            <span className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${themeStyles[floatPromo.style || 'luxury'].accent} bg-clip-text text-transparent mb-1`}>
                                New Promotion
                            </span>
                            <h4 className="text-white text-sm font-black leading-tight mb-2 line-clamp-2">{floatPromo.title}</h4>
                            <div className="flex items-center gap-1.5 text-blue-400 text-[10px] font-bold">
                                <span>Claimed by 48 today</span>
                                <Users size={10} />
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); handleDismiss(floatPromo.id, 'floating_corner'); }}
                            className="absolute top-2 right-2 p-1 text-white/20 hover:text-white transition-colors"
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
                        className={`fixed bottom-0 left-0 right-0 z-[100] py-6 bg-gradient-to-r ${themeStyles[footerPromo.style || 'luxury'].gradient} border-t border-white/20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]`}
                    >
                        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="hidden sm:block p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                                    <Gift size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white text-xl font-black tracking-tight">{footerPromo.title}</h3>
                                    <p className="text-white/70 text-sm font-medium">{footerPromo.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="flex-1 md:w-48 h-10 bg-black/20 rounded-xl border border-white/10 overflow-hidden p-1">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "65%" }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className={`h-full rounded-lg bg-gradient-to-r ${themeStyles[footerPromo.style || 'luxury'].accent} shadow-[0_0_20px_rgba(255,255,255,0.3)]`}
                                    />
                                </div>
                                <button
                                    onClick={() => { setActiveSlots(prev => ({ ...prev, popup: footerPromo.id })); setModalOpen(true); }}
                                    className={`px-8 py-3 ${themeStyles[footerPromo.style || 'luxury'].button} text-sm font-black rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap`}
                                >
                                    {footerPromo.buttonText}
                                </button>
                                <button
                                    onClick={() => handleDismiss(footerPromo.id, 'footer_banner')}
                                    className="p-2 text-white/40 hover:text-white transition-colors"
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
                    style={popupPromo.style}
                    onSuccess={() => handleClaimSuccess(popupPromo.id)}
                />
            )}
        </>
    );
};

export default GlobalPromoEffects;
