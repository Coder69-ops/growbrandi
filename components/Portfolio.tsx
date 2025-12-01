import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaArrowRight, FaChartLine, FaCode, FaExternalLinkAlt, FaGem } from 'react-icons/fa';
import { PROJECTS } from '../constants';
import { Project } from '../types';

// --- Premium Dark Luxury Design System ---
// Background: bg-luxury-black (Global)
// Cards: Glassmorphism (bg-white/5 + backdrop-blur)
// Accents: Emerald/Blue Gradients

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.6, 0.01, 0.05, 0.95]
        },
    },
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="group relative rounded-3xl overflow-hidden bg-zinc-900/40 border border-white/5 hover:border-blue-500/30 transition-all duration-500"
            variants={itemVariants}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -10 }}
        >
            {/* Ambient Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            {/* Image Section */}
            <div className="relative h-72 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent z-10" />
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />

                {/* Floating Badge */}
                <div className="absolute top-4 right-4 z-20">
                    <span className="glass-effect px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 flex items-center gap-2">
                        <FaGem className="text-blue-400" />
                        {project.category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 relative z-20 -mt-12">
                <div className="glass-effect p-6 rounded-2xl border border-white/5 shadow-xl backdrop-blur-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors font-heading">
                                {project.title}
                            </h3>
                            <p className="text-sm text-blue-400/80 font-medium tracking-wide uppercase">
                                {project.client}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex text-yellow-400 text-xs gap-0.5 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Math.floor(project.rating) ? "fill-current" : "text-zinc-700"} />
                                ))}
                            </div>
                            <span className="text-xs text-zinc-500 font-mono">{project.rating}/5.0</span>
                        </div>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 font-light">
                        {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies?.slice(0, 3).map((tech, idx) => (
                            <span key={idx} className="text-xs text-zinc-300 bg-white/5 px-2 py-1 rounded-md border border-white/5 flex items-center gap-1">
                                <FaCode className="text-blue-500/70 text-[10px]" />
                                {tech}
                            </span>
                        ))}
                    </div>

                    {/* Action Button */}
                    <button className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-[1px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                        <div className="relative bg-zinc-900 group-hover/btn:bg-zinc-900/90 rounded-xl px-4 py-3 transition-all duration-300 flex items-center justify-center gap-2">
                            <span className="text-sm font-bold text-white group-hover/btn:text-blue-400 transition-colors">View Case Study</span>
                            <FaArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </div>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export const PortfolioPage: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

    const filteredProjects = filter === 'All'
        ? PROJECTS
        : PROJECTS.filter(p => p.category === filter);

    return (
        <div className="min-h-screen bg-luxury-black pt-24 pb-20 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

            {/* Header Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-sm font-medium text-blue-400 tracking-wide uppercase">Our Masterpieces</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight font-heading">
                            We Build <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-200 to-blue-500 animate-gradient-x">
                                Digital Legacies
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-light">
                            Explore a curated collection of our most impactful work. Where
                            <span className="text-white font-medium"> strategic vision </span>
                            meets
                            <span className="text-white font-medium"> flawless execution</span>.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border ${filter === category
                                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                                : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Projects Grid */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key={filter}
                >
                    <AnimatePresence mode='wait'>
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.title} project={project} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10">
                <div className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-12 md:p-24 text-center group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-heading">
                            Ready to build your <span className="text-blue-400">Success Story?</span>
                        </h2>
                        <p className="text-zinc-400 mb-12 text-xl font-light">
                            Join the ranks of industry leaders who chose GrowBrandi to transform their digital presence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:-translate-y-1">
                                Start Your Project
                            </button>
                            <button className="px-10 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300">
                                View Pricing
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PortfolioPage;
