
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Megaphone, ArrowRight, Gift, Sparkles } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import { getLocalizedField } from '../utils/localization';

const GlobalOfferDisplay = () => {
    const { getLocalizedPath, currentLang } = useLocalizedPath();
    const [offer, setOffer] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Real-time listener for instant admin updates
        const unsub = onSnapshot(doc(db, 'site_settings', 'main'), (doc) => {
            if (doc.exists()) {
                const data = doc.data().promotions;
                if (data && data.enabled) {
                    setOffer(data);
                    // Check local storage for dismissal (except for banners which usually persist or have session-based dismissal)
                    const dismissedId = localStorage.getItem('growbrandi_offer_dismissed');
                    if (dismissedId !== data.id) {
                        setIsVisible(true);
                        setIsDismissed(false);
                    } else {
                        setIsDismissed(true);
                    }
                } else {
                    setIsVisible(false);
                }
            }
        });

        return () => unsub();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        if (offer?.id) {
            localStorage.setItem('growbrandi_offer_dismissed', offer.id);
            setIsDismissed(true);
        }
    };

    if (!offer || !offer.enabled || isDismissed) return null;

    const title = getLocalizedField(offer.title, currentLang);
    const description = getLocalizedField(offer.description, currentLang);
    const buttonText = getLocalizedField(offer.buttonText, currentLang);

    // Render logic based on type

    // TYPE: TOP BANNER
    if (offer.type === 'banner') {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative z-50"
                    >
                        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                            <div className="flex items-center gap-3 text-center sm:text-left">
                                <span className="p-1.5 bg-white/20 rounded-lg shrink-0">
                                    <Sparkles size={14} className="text-yellow-300" />
                                </span>
                                <div>
                                    <span className="font-bold mr-2">{title}</span>
                                    <span className="opacity-90 hidden md:inline">{description}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                                {offer.link && (
                                    <a
                                        href={getLocalizedPath(offer.link)}
                                        className="px-4 py-1.5 bg-white text-blue-600 rounded-full font-bold text-xs hover:bg-blue-50 transition-colors uppercase tracking-wide"
                                    >
                                        {buttonText || 'Learn More'}
                                    </a>
                                )}
                                <button onClick={handleDismiss} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // TYPE: FLOATING WIDGET (Bottom Left)
    if (offer.type === 'widget') {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        className="fixed bottom-24 left-4 z-40 max-w-sm"
                    >
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 rounded-2xl shadow-2xl relative overflow-hidden group">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none" />

                            <button
                                onClick={handleDismiss}
                                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors z-10"
                            >
                                <X size={16} />
                            </button>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center overflow-hidden w-12 h-12 shrink-0">
                                    {offer.image ? (
                                        <img src={offer.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Gift size={24} />
                                    )}
                                </div>
                                <div className="flex-1 pr-6">
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
                                </div>
                            </div>

                            {offer.link && (
                                <a
                                    href={getLocalizedPath(offer.link)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors text-sm"
                                >
                                    {buttonText || 'Claim Offer'} <ArrowRight size={16} />
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // TYPE: MODAL POPUP
    if (offer.type === 'popup') {
        return (
            <AnimatePresence>
                {isVisible && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleDismiss}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden flex items-center justify-center">
                                {offer.image ? (
                                    <>
                                        <img src={offer.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20" />
                                    </>
                                ) : (
                                    <>
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                        <Sparkles className="text-white/20 absolute -top-10 -left-10 w-40 h-40 animate-pulse" />
                                        <Megaphone className="text-white relative z-10 drop-shadow-lg" size={48} />
                                    </>
                                )}

                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors backdrop-blur-sm"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-8 text-center">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{title}</h2>
                                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                    {description}
                                </p>

                                {offer.link && (
                                    <a
                                        href={getLocalizedPath(offer.link)}
                                        className="w-full block py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.02]"
                                    >
                                        {buttonText || 'Get Started Now'}
                                    </a>
                                )}

                                <button
                                    onClick={handleDismiss}
                                    className="mt-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    No thanks, maybe later
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        );
    }

    return null;
};

export default GlobalOfferDisplay;
