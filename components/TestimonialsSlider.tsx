import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaCommentDots, FaChevronLeft, FaChevronRight, FaStar, FaCheckCircle } from 'react-icons/fa';
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
            viewport={{ once: true, amount: 0 }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-luxury-black" />
            <div className="absolute top-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-6xl text-center relative z-10">
                <motion.div variants={itemVariants} className="mb-20">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-8 py-3 mb-8">
                        <FaQuoteLeft className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-bold text-blue-400 tracking-wide">CLIENT TESTIMONIALS</span>
                        <FaCommentDots className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-3xl md:text-6xl font-black mb-8 leading-tight">
                        What Our <span className="text-gradient">Amazing Clients</span> Say
                    </h2>
                    <p className="text-lg md:text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed">
                        Don't just take our word for it. Hear from the businesses we've helped transform their
                        digital presence and <span className="text-blue-400 font-semibold">achieve remarkable success</span>.
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
                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 glass-effect p-2 md:p-3 rounded-full hover:bg-white/10 transition-all duration-300 group"
                        aria-label="Previous testimonial"
                    >
                        <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-zinc-400 group-hover:text-blue-400" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 glass-effect p-2 md:p-3 rounded-full hover:bg-white/10 transition-all duration-300 group"
                        aria-label="Next testimonial"
                    >
                        <FaChevronRight className="w-5 h-5 md:w-6 md:h-6 text-zinc-400 group-hover:text-blue-400" />
                    </button>

                    {/* Enhanced Testimonial Cards */}
                    <div className="relative overflow-hidden rounded-3xl">
                        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                            {TESTIMONIALS.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-2">
                                    <motion.div
                                        className="glass-effect rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col justify-between"
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full translate-y-12 -translate-x-12" />

                                        {/* Header with Quote and Rating */}
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="text-8xl text-gradient font-black leading-none opacity-20">"</div>
                                            <div className="flex">
                                                {testimonial.rating && [...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ delay: i * 0.1, duration: 0.3 }}
                                                    >
                                                        <FaStar className={`w-6 h-6 ${i < testimonial.rating! ? 'text-yellow-400' : 'text-zinc-600'}`} />
                                                    </motion.div>
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
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-400 rounded-2xl blur-lg opacity-50" />
                                                <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                                                    <span className="text-white font-bold text-2xl">
                                                        {testimonial.author.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-white text-xl mb-1">{testimonial.author}</div>
                                                <div className="text-blue-400 font-semibold text-lg">{testimonial.company}</div>
                                                <div className="text-zinc-400 text-sm mt-1">Verified Client</div>
                                            </div>
                                            <div className="hidden md:block">
                                                <FaCheckCircle className="w-12 h-12 text-blue-400/20" />
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
                            <div className="flex justify-between text-sm text-zinc-400 mb-2">
                                <span>Testimonial {activeIndex + 1} of {TESTIMONIALS.length}</span>
                                <span>Auto-advancing</span>
                            </div>
                            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-400 rounded-full"
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
                                        ? 'bg-gradient-to-r from-blue-400 to-blue-400 w-8 shadow-lg'
                                        : 'bg-zinc-600 hover:bg-zinc-500 w-3'
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Go to testimonial ${index + 1}`}
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
