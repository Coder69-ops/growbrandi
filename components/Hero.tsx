import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import FAQ from './FAQ';
import TeamSection from './TeamSection';
import AIBusinessAdvisor from './AIBusinessAdvisor';
import SloganGenerator from './SloganGenerator';
import ServicesPreview from './ServicesPreview';
import ProjectsPreview from './ProjectsPreview';
import TestimonialsSlider from './TestimonialsSlider';

const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-luxury-black">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                </div>
            </div>

            <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-sm font-medium text-emerald-400">Powerful Growth Engine</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight font-heading">
                            Scale Your Brand with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 animate-gradient-x">
                                Intelligent Design
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            GrowBrandi combines Advanced AI analytics with High-Impact creative strategy to transform your Digital Presence and drive Measurable Business Growth.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.button
                                onClick={() => navigate('/contact')}
                                className="group relative px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Book Strategy Call
                                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </motion.button>

                            <motion.button
                                onClick={() => navigate('/portfolio')}
                                className="px-8 py-4 glass-effect text-white hover:bg-white/5 rounded-full font-bold text-lg transition-all duration-300"
                                whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.3)' }}
                                whileTap={{ scale: 0.98 }}
                            >
                                View Case Studies
                            </motion.button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Active Clients', value: '500+' },
                                { label: 'Projects Delivered', value: '1.2k+' },
                                { label: 'Client Satisfaction', value: '98%' },
                                { label: 'ROI Average', value: '300%' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-slate-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <ServicesPreview />
            <SloganGenerator />
            <AIBusinessAdvisor />
            <TeamSection />
            <ProjectsPreview />
            <TestimonialsSlider />
            <FAQ />
        </>
    );
};

export default Hero;