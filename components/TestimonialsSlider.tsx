import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useContent } from '../src/hooks/useContent';
import { Testimonial } from '../types';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';
import { getLocalizedField } from '../src/utils/localization';
import { Skeleton } from './ui/Skeleton';

const TestimonialsSlider: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const { data: testimonials, loading } = useContent<Testimonial>('testimonials');

    const localized = (field: any) => getLocalizedField(field, i18n.language);

    useEffect(() => {
        if (testimonials.length === 0) return;

        // Ensure index is valid when data changes
        if (currentIndex >= testimonials.length) {
            setCurrentIndex(0);
        }

        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length, currentIndex]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const paginate = (newDirection: number) => {
        if (!testimonials.length) return;
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            <BackgroundEffects />

            <div className="container mx-auto max-w-6xl relative z-10">
                <SectionHeading
                    badge={t('section_headers.testimonials.badge')}
                    title={t('section_headers.testimonials.title')}
                    highlight={t('section_headers.testimonials.highlight') || "Trust Us"}
                    description={t('section_headers.testimonials.description')}
                />

                <div className="relative h-[600px] md:h-[500px] flex items-center justify-center">
                    {loading ? (
                        <div className="w-full max-w-4xl px-4">
                            <GlassCard className="p-8 md:p-12 relative">
                                <div className="flex flex-col items-center text-center">
                                    <Skeleton variant="circle" className="w-20 h-20 mb-6" />
                                    <div className="flex gap-2 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Skeleton key={i} variant="circle" className="w-5 h-5" />
                                        ))}
                                    </div>
                                    <Skeleton className="w-full h-24 mb-6" />
                                    <Skeleton className="w-48 h-8 mb-2" />
                                    <Skeleton className="w-32 h-6" />
                                </div>
                            </GlassCard>
                        </div>
                    ) : (
                        testimonials.length > 0 && (
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="absolute w-full max-w-4xl px-4"
                                >
                                    <GlassCard className="p-8 md:p-12 relative group hover:border-blue-500/30 transition-all duration-500">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
                                            <FaQuoteRight className="text-8xl text-blue-500" />
                                        </div>

                                        <div className="flex flex-col items-center text-center relative z-10">
                                            <div className="relative mb-6">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                                                <img
                                                    src={testimonials[currentIndex].image}
                                                    alt={testimonials[currentIndex].author}
                                                    className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-white/10 shadow-xl relative z-10"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = document.getElementById(`fallback-${currentIndex}`);
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                />
                                                <div
                                                    id={`fallback-${currentIndex}`}
                                                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-xl relative z-10 hidden"
                                                >
                                                    {testimonials[currentIndex].author.charAt(0)}
                                                </div>
                                            </div>

                                            <div className="flex gap-1 mb-8">
                                                {[...Array(Math.floor(Math.max(0, Math.min(5, Number(testimonials[currentIndex]?.rating) || 5))))].map((_, i) => (
                                                    <FaStar key={i} className="text-yellow-400 text-lg" />
                                                ))}
                                            </div>

                                            <p className="text-xl md:text-2xl text-slate-700 dark:text-zinc-300 font-medium leading-relaxed mb-8 italic">
                                                "{localized(testimonials[currentIndex].quote)}"
                                            </p>

                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                                    {testimonials[currentIndex].author}
                                                </h4>
                                                <p className="text-blue-600 dark:text-blue-400 font-medium">
                                                    {localized(testimonials[currentIndex].company)}
                                                </p>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            </AnimatePresence>
                        )
                    )}

                    {!loading && testimonials.length > 0 && (
                        <>
                            <button
                                className="absolute left-4 md:left-0 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-900 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
                                onClick={() => paginate(-1)}
                            >
                                <FaChevronLeft className="text-xl" />
                            </button>
                            <button
                                className="absolute right-4 md:right-0 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-slate-900 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg"
                                onClick={() => paginate(1)}
                            >
                                <FaChevronRight className="text-xl" />
                            </button>
                        </>
                    )}

                    {!loading && testimonials.length === 0 && (
                        <div className="text-center text-slate-500 dark:text-slate-400">
                            <p>No testimonials available at the moment.</p>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default TestimonialsSlider;
