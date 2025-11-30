import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
            <div className="absolute inset-0 bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-900" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
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
                            <span className="text-sm font-medium text-emerald-400">AI-Powered Growth Engine</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                            Scale Your Brand with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 animate-gradient-x">
                                Intelligent Design
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            GrowBrandi combines advanced AI analytics with award-winning creative strategies
                            to transform your digital presence and drive measurable business growth.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <motion.button
                                onClick={() => navigate('/contact')}
                                className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Book Strategy Call
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </motion.button>

                            <motion.button
                                onClick={() => navigate('/case-studies')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm"
                                whileHover={{ scale: 1.02 }}
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