import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../constants';

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
            className="py-24 px-4 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/60" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-6xl text-center relative z-10">
                <motion.div variants={itemVariants} className="mb-20">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-8 py-3 mb-8">
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-emerald-400 tracking-wide">CLIENT TESTIMONIALS</span>
                        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                        What Our <span className="text-gradient">Amazing Clients</span> Say
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                        Don't just take our word for it. Hear from the businesses we've helped transform their
                        digital presence and <span className="text-emerald-400 font-semibold">achieve remarkable success</span>.
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="relative"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 glass-effect p-3 rounded-full hover:bg-white/10 transition-all duration-300 group"
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 glass-effect p-3 rounded-full hover:bg-white/10 transition-all duration-300 group"
                        aria-label="Next testimonial"
                    >
                        <svg className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Enhanced Testimonial Cards */}
                    <div className="relative overflow-hidden rounded-3xl">
                        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                            {TESTIMONIALS.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-2">
                                    <motion.div
                                        className="glass-effect rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-between"
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-full translate-y-12 -translate-x-12" />

                                        {/* Header with Quote and Rating */}
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="text-8xl text-gradient font-black leading-none opacity-20">"</div>
                                            <div className="flex">
                                                {testimonial.rating && [...Array(5)].map((_, i) => (
                                                    <motion.svg
                                                        key={i}
                                                        className={`w-6 h-6 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-slate-600'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ delay: i * 0.1, duration: 0.3 }}
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </motion.svg>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Testimonial Content */}
                                        <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-auto relative z-10 flex-grow">
                                            {testimonial.quote}
                                        </blockquote>

                                        {/* Enhanced Author Section */}
                                        <div className="flex items-center gap-6 mt-8 relative z-10">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-2xl blur-lg opacity-50" />
                                                <div className="relative w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                                                    <span className="text-white font-bold text-2xl">
                                                        {testimonial.author.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-white text-xl mb-1">{testimonial.author}</div>
                                                <div className="text-emerald-400 font-semibold text-lg">{testimonial.company}</div>
                                                <div className="text-slate-400 text-sm mt-1">Verified Client</div>
                                            </div>
                                            <div className="hidden md:block">
                                                <svg className="w-12 h-12 text-emerald-400/20" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Pagination and Progress */}
                    <div className="flex flex-col items-center gap-6 mt-12">
                        {/* Progress Bar */}
                        <div className="w-full max-w-md">
                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Testimonial {activeIndex + 1} of {TESTIMONIALS.length}</span>
                                <span>Auto-advancing</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${((activeIndex + 1) / TESTIMONIALS.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Enhanced Pagination Dots */}
                        <div className="flex items-center gap-3">
                            {TESTIMONIALS.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-3 rounded-full transition-all duration-300 ${index === activeIndex
                                            ? 'bg-gradient-to-r from-emerald-400 to-blue-400 w-8 shadow-lg'
                                            : 'bg-slate-600 hover:bg-slate-500 w-3'
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default TestimonialsSlider;
