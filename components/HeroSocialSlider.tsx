
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
            case 'offer': return <Zap className="text-amber-500 fill-amber-500 animate-pulse" size={24} />;
            case 'service': return <Briefcase className="text-blue-500" size={24} />;
            default: return <Star className="text-yellow-400 fill-yellow-400" size={24} />;
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
                    container: 'bg-gradient-to-br from-amber-50/90 to-orange-50/90 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-500/30',
                    iconBg: 'bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-500/30',
                    badge: 'text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/30'
                };
            case 'service':
                return {
                    container: 'bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-500/30',
                    iconBg: 'bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-500/30',
                    badge: 'text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30'
                };
            default:
                return {
                    container: 'bg-gradient-to-br from-white/95 to-slate-50/90 dark:from-slate-800/60 dark:to-slate-900/60 border-slate-200/60 dark:border-slate-700/50',
                    iconBg: 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600',
                    badge: 'text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/50'
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
                    className={`absolute inset-0 p-8 rounded-[2rem] backdrop-blur-xl border shadow-2xl shadow-slate-200/50 dark:shadow-black/50 ${styles.container}`}
                >
                    {/* Decorative Icon */}
                    <div className={`absolute -top-6 -left-6 p-4 rounded-2xl shadow-lg border backdrop-blur-md transform rotate-6 transition-all duration-500 group-hover:rotate-0 ${styles.iconBg}`}>
                        {renderIcon(currentItem.type)}
                    </div>

                    {/* Badge */}
                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${styles.badge}`}>
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
                                <div className="font-bold text-slate-900 dark:text-white text-base truncate">{currentItem.author}</div>
                                {currentItem.role && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide truncate opacity-80">
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
