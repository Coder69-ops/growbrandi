
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
}

const HeroSocialSlider: React.FC<HeroSocialSliderProps> = ({ items = [] }) => {
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
        <div className="pt-8 lg:pt-12 h-[240px] relative w-full max-w-lg mx-auto lg:mx-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 15 }}
                    className={`absolute inset-0 p-8 rounded-[2.5rem] backdrop-blur-2xl border shadow-2xl transition-all duration-500 ${styles.container}`}
                >
                    {/* Background Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />

                    {/* Decorative Icon */}
                    <div className={`absolute -top-6 -left-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border backdrop-blur-md transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 z-20 ${styles.iconBg}`}>
                        {renderIcon(currentItem.type)}
                    </div>

                    {/* Badge */}
                    <div className={`absolute top-6 right-8 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${styles.badge}`}>
                        {renderBadge(currentItem.type)}
                    </div>

                    <div className="flex flex-col h-full">
                        {/* Content */}
                        <div className="mt-2 mb-6 relative">
                            {currentItem.type === 'review' && (
                                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-slate-300 dark:text-slate-600 opacity-20 transform -scale-x-100" />
                            )}
                            <p className="text-slate-800 dark:text-slate-100 font-medium leading-relaxed text-xl line-clamp-3 relative z-10">
                                {currentItem.content}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-4 mt-auto">
                            {currentItem.image ? (
                                <img
                                    src={currentItem.image}
                                    alt={currentItem.author}
                                    className={`w-12 h-12 object-cover shadow-md border-2 border-white dark:border-slate-700 ${currentItem.type === 'review' ? 'rounded-full' : 'rounded-xl'}`}
                                />
                            ) : (
                                <div className={`w-12 h-12 flex items-center justify-center font-bold text-sm uppercase shadow-md border-2 border-white dark:border-slate-700 ${currentItem.type === 'review' ? 'rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white' : 'rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                    {currentItem.author?.charAt(0) || '?'}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white text-base truncate tabular-nums">{currentItem.author}</div>
                                {currentItem.role && (
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.15em] truncate opacity-70">
                                        {currentItem.role}
                                    </div>
                                )}
                            </div>

                            {/* CTA Button */}
                            {currentItem.actionLabel && (
                                <a
                                    href={currentItem.actionUrl || '#'}
                                    className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                                >
                                    {currentItem.actionLabel}
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots Indicator */}
            {items.length > 1 && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`rounded-full transition-all duration-500 ${idx === currentIndex
                                ? 'bg-blue-600 w-8 h-2'
                                : 'bg-slate-300 dark:bg-slate-700 w-2 h-2 hover:bg-slate-400 dark:hover:bg-slate-600'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSocialSlider;
