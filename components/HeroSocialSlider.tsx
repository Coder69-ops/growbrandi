
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
        enter: { opacity: 0, y: 20, scale: 0.95 },
        center: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 1.05 }
    };

    const renderIcon = (type: string) => {
        switch (type) {
            case 'offer': return <Zap className="text-amber-500 fill-amber-500" size={20} />;
            case 'service': return <Briefcase className="text-blue-500" size={20} />;
            default: return <Star className="text-yellow-400 fill-yellow-400" size={20} />;
        }
    };

    const renderBadge = (type: string) => {
        switch (type) {
            case 'offer': return 'Limited Offer';
            case 'service': return 'Service Spotlight';
            default: return 'Client Story';
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'offer':
                return 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20';
            case 'service':
                return 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20';
            default:
                return 'bg-slate-500/5 dark:bg-white/5 border-slate-200/50 dark:border-white/10';
        }
    };

    return (
        <div className="pt-6 lg:pt-10 h-[200px] relative w-full max-w-lg">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`absolute inset-0 p-6 rounded-3xl backdrop-blur-md border border-white/20 shadow-lg ${getTypeStyles(currentItem.type)}`}
                >
                    {/* Decorative Sparkle */}
                    <div className="absolute -top-3 -left-3 bg-white dark:bg-slate-800 p-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                        {renderIcon(currentItem.type)}
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 opacity-60">
                        {renderBadge(currentItem.type)}
                    </div>

                    <div className="flex flex-col h-full justify-between">
                        <div>
                            {/* Content */}
                            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed text-base lg:text-lg mb-4 line-clamp-3">
                                {currentItem.type === 'review' && <span className="text-slate-400 mr-2">"</span>}
                                {currentItem.content}
                                {currentItem.type === 'review' && <span className="text-slate-400 ml-1">"</span>}
                            </p>
                        </div>

                        {/* Footer / Author */}
                        <div className="flex items-center gap-3 mt-auto">
                            {currentItem.image ? (
                                <img
                                    src={currentItem.image}
                                    alt={currentItem.author}
                                    className={`w-10 h-10 object-cover shadow-sm ${currentItem.type === 'review' ? 'rounded-full' : 'rounded-lg'}`}
                                />
                            ) : (
                                <div className={`w-10 h-10 flex items-center justify-center font-bold text-xs uppercase shadow-sm ${currentItem.type === 'review' ? 'rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white' : 'rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                                    {currentItem.author?.charAt(0) || '?'}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{currentItem.author}</div>
                                {currentItem.role && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider truncate">
                                        {currentItem.role}
                                    </div>
                                )}
                            </div>

                            {/* Optional CTA for Offers */}
                            {currentItem.actionLabel && (
                                <a
                                    href={currentItem.actionUrl || '#'}
                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                                >
                                    {currentItem.actionLabel} <ArrowRight size={12} />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots Indicator */}
            {items.length > 1 && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'bg-blue-600 w-4'
                                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroSocialSlider;
