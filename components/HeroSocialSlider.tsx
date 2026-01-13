
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Zap, Briefcase, Quote, Tag, ArrowRight } from 'lucide-react';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

interface SliderItem {
    type: 'review' | 'offer' | 'service';
    content: string; // Localized string passed from parent
    author: string;  // or Title for offer/service
    role: string;    // or Subtitle
    image?: string;
    actionLabel?: string; // Optional CTA text
    actionUrl?: string;   // Optional CTA link
}

interface HeroSocialSliderProps {
    items: SliderItem[];
    onAction?: () => void;
}

const HeroSocialSlider: React.FC<HeroSocialSliderProps> = ({ items = [], onAction }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { getLocalizedPath } = useLocalizedPath();

    useEffect(() => {
        if (!items || items.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000); // 5 seconds per slide

        return () => clearInterval(timer);
    }, [items?.length]);

    if (!items || items.length === 0) return null;

    const currentItem = items[currentIndex];

    // Animation Variants
    const variants = {
        enter: { opacity: 0, y: 30, scale: 0.9 },
        center: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -30, scale: 1.05 }
    };

    const renderIcon = (type: string) => {
        switch (type) {
            case 'offer': return <Zap className="animate-pulse" size={24} fill="currentColor" />;
            case 'service': return <Briefcase size={24} />;
            default: return <Star size={24} fill="currentColor" />;
        }
    };

    const renderBadge = (type: string) => {
        switch (type) {
            case 'offer': return 'Limited Time Offer';
            case 'service': return 'Service Spotlight';
            default: return 'Success Story';
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'offer':
                return {
                    container: 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent dark:from-amber-600/20 dark:via-orange-600/10 dark:to-transparent border-amber-500/30 dark:border-amber-400/20 shadow-amber-500/10',
                    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 border-white/20',
                    badge: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/50',
                    accentColor: 'text-amber-600 dark:text-amber-400'
                };
            case 'service':
                return {
                    container: 'bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent dark:from-blue-600/20 dark:via-indigo-600/10 dark:to-transparent border-blue-500/30 dark:border-blue-400/20 shadow-blue-500/10',
                    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 border-white/20',
                    badge: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50',
                    accentColor: 'text-blue-600 dark:text-blue-400'
                };
            default:
                return {
                    container: 'bg-white/80 dark:bg-slate-900/40 border-slate-200 dark:border-white/10 shadow-slate-200/50 dark:shadow-black/20',
                    iconBg: 'bg-white dark:bg-slate-800 text-yellow-500 shadow-md border-slate-100 dark:border-slate-700',
                    badge: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
                    accentColor: 'text-blue-600 dark:text-blue-400'
                };
        }
    };

    const styles = getTypeStyles(currentItem.type);

    return (
        <div className="pt-6 lg:pt-8 h-[280px] relative w-full max-w-xl mx-auto lg:mx-0 font-sans">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
                    className={`absolute inset-0 p-6 rounded-[2.5rem] backdrop-blur-2xl border-[1.5px] shadow-2xl transition-all duration-500 ${styles.container} group`}
                >
                    {/* Background Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />

                    {/* Decorative Icon - Floating Top Left */}
                    <div className={`absolute -top-7 -left-7 w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border backdrop-blur-md transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 z-20 ${styles.iconBg}`}>
                        {renderIcon(currentItem.type)}
                    </div>

                    {/* Badge - Top Right */}
                    <div className={`absolute top-6 right-8 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border backdrop-blur-md shadow-sm ${styles.badge}`}>
                        {renderBadge(currentItem.type)}
                    </div>

                    <div className="flex flex-col h-full relative z-10 pt-2">
                        {/* Header: Image + Author + CTA */}
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-200/50 dark:border-white/5">
                            {/* Larger Image Display */}
                            <div className="relative shrink-0">
                                {currentItem.image ? (
                                    <img
                                        src={currentItem.image}
                                        alt={currentItem.author}
                                        className={`w-20 h-20 object-cover shadow-lg border-2 border-white dark:border-slate-700 ring-2 ring-transparent group-hover:ring-offset-2 group-hover:ring-blue-500/20 transition-all duration-300 ${currentItem.type === 'review' ? 'rounded-full' : 'rounded-2xl'}`}
                                    />
                                ) : (
                                    <div className={`w-20 h-20 flex items-center justify-center font-bold text-2xl uppercase shadow-lg border-2 border-white dark:border-slate-700 ${currentItem.type === 'review' ? 'rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white' : 'rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                        {currentItem.author?.charAt(0) || '?'}
                                    </div>
                                )}
                                {/* Online Indicator */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-white dark:border-slate-900 rounded-full shadow-sm animate-pulse" />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="font-bold text-slate-900 dark:text-white text-xl truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {currentItem.author}
                                </div>
                                {currentItem.role && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.1em] truncate mt-1.5 opacity-80">
                                        {currentItem.role}
                                    </div>
                                )}
                            </div>

                            {/* Prominent CTA Button - Top Right */}
                            {currentItem.actionLabel && (
                                <a
                                    href={currentItem.actionUrl || '#'}
                                    onClick={(e) => {
                                        if (onAction) {
                                            e.preventDefault();
                                            onAction();
                                        }
                                    }}
                                    className="hidden sm:flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95 group/btn shrink-0 ml-auto"
                                >
                                    {currentItem.actionLabel}
                                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </a>
                            )}
                        </div>

                        {/* Body Content - Bottom */}
                        <div className="mt-4 relative flex-1 flex flex-col justify-center">
                            {currentItem.type === 'review' && (
                                <Quote className="absolute -top-6 -left-2 w-12 h-12 text-slate-400/10 dark:text-slate-600/20 transform -scale-x-100" />
                            )}
                            <p className="text-slate-800 dark:text-slate-100 font-medium leading-relaxed text-lg lg:text-xl tracking-tight relative z-10">
                                "{currentItem.content}"
                            </p>

                            {/* Mobile CTA Fallback */}
                            {currentItem.actionLabel && (
                                <div className="mt-6 sm:hidden">
                                    <a
                                        href={currentItem.actionUrl || '#'}
                                        onClick={(e) => {
                                            if (onAction) {
                                                e.preventDefault();
                                                onAction();
                                            }
                                        }}
                                        className="flex w-full justify-center items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
                                    >
                                        {currentItem.actionLabel}
                                        <ArrowRight size={16} />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Pagination / Indicators */}
            {items.length > 1 && (
                <div className="hidden sm:flex absolute -bottom-12 left-0 right-0 justify-center items-center gap-3">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`rounded-full transition-all duration-500 relative ${idx === currentIndex ? 'w-12' : 'w-2.5 hover:bg-slate-400 dark:hover:bg-slate-600'
                                } h-2.5 overflow-hidden bg-slate-200 dark:bg-slate-800`}
                            aria-label={`Go to slide ${idx + 1}`}
                        >
                            {idx === currentIndex && (
                                <motion.div
                                    layoutId="slider-indicator"
                                    className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSocialSlider;
