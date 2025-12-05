import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaCommentDots, FaChevronLeft, FaChevronRight, FaStar, FaCheckCircle } from 'react-icons/fa';
import { TESTIMONIALS } from '../constants';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const TestimonialsSlider: React.FC = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const touchStartX = useRef(0);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchStartX.current - touchEndX > 50) {
            handleNext();
        } else if (touchEndX - touchStartX.current > 50) {
            handlePrev();
        }
    }

    useEffect(() => {
        const interval = setInterval(handleNext, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.section
            className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            variants={containerVariants}
        >
            <BackgroundEffects />

            <div className="container mx-auto max-w-6xl text-center relative z-10">
                <SectionHeading
                    badge={t('section_headers.testimonials.badge')}
                    title={t('section_headers.testimonials.title')}
                    highlight={t('section_headers.testimonials.highlight')}
                    description={t('section_headers.testimonials.description')}
                />

                <motion.div
                    variants={itemVariants}
                    className="relative"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 md:-left-12 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 group border border-slate-200 dark:border-white/10"
                        aria-label={t('section_headers.testimonials.aria.prev')}
                    >
                        <FaChevronLeft className="w-5 h-5 text-slate-600 dark:text-zinc-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 md:-right-12 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 group border border-slate-200 dark:border-white/10"
                        aria-label={t('section_headers.testimonials.aria.next')}
                    >
                        <FaChevronRight className="w-5 h-5 text-slate-600 dark:text-zinc-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                    </button>

                    {/* Enhanced Testimonial Cards */}
                    <div className="relative overflow-hidden rounded-3xl py-4">
                        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                            {TESTIMONIALS.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-2 md:px-4">
                                    <GlassCard
                                        className="p-8 md:p-12 min-h-[400px] flex flex-col justify-between"
                                        hoverEffect={true}
                                    >
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

                                        {/* Header with Quote and Rating */}
                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <FaQuoteLeft className="text-4xl md:text-5xl text-blue-500/20 dark:text-blue-400/20" />
                                            <div className="flex gap-1">
                                                {testimonial.rating && [...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ delay: i * 0.1, duration: 0.3 }}
                                                    >
                                                        <FaStar className={`w-5 h-5 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-slate-300 dark:text-zinc-600'}`} />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Testimonial Content */}
                                        <blockquote className="text-xl md:text-2xl text-slate-800 dark:text-zinc-100 font-medium leading-relaxed mb-8 relative z-10 flex-grow font-heading">
                                            "{t(testimonial.quote)}"
                                        </blockquote>

                                        {/* Enhanced Author Section */}
                                        <div className="flex items-center gap-4 md:gap-6 relative z-10 border-t border-slate-200 dark:border-white/5 pt-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-50" />
                                                <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-xl md:text-2xl">
                                                        {testimonial.author.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="font-bold text-slate-900 dark:text-white text-lg md:text-xl mb-0.5">{testimonial.author}</div>
                                                <div className="text-blue-600 dark:text-blue-400 font-medium text-sm md:text-base">{testimonial.company}</div>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5">
                                                <img src="/logos/trustpilot--logo.png" alt="Trustpilot" className="h-6 w-auto object-contain" />
                                                <div className="w-px h-4 bg-slate-300 dark:bg-zinc-700" />
                                                <div className="flex items-center gap-1.5">
                                                    <FaCheckCircle className="w-4 h-4 text-[#00b67a]" />
                                                    <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wide">{t('common.verified')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Pagination and Progress */}
                    <div className="flex flex-col items-center gap-6 mt-12">
                        {/* Progress Bar */}
                        <div className="w-full max-w-md px-4">
                            <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-zinc-400 mb-2 uppercase tracking-wider">
                                <span>{t('section_headers.testimonials.pager_text', { current: activeIndex + 1, total: TESTIMONIALS.length })}</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((activeIndex + 1) / TESTIMONIALS.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Enhanced Pagination Dots */}
                        <div className="flex items-center gap-3">
                            {TESTIMONIALS.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? 'bg-blue-500 w-8'
                                        : 'bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400 dark:hover:bg-zinc-600 w-2'
                                        }`}
                                    aria-label={t('section_headers.testimonials.aria.go_to', { number: index + 1 })}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div >
            </div >
        </motion.section >
    )
}

export default TestimonialsSlider;
