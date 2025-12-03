import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaChartLine, FaExchangeAlt, FaStar, FaCheck, FaBriefcase, FaArrowRight, FaFolderOpen, FaCode, FaWhatsapp, FaBolt, FaMobileAlt, FaSearch } from 'react-icons/fa';
import { PROJECTS, CONTACT_INFO } from '../constants';
import { Project } from '../types';
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

// --- Enhanced Project Modal ---
interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
    if (!isOpen || !project) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Enhanced Backdrop */}
            <div className="absolute inset-0 bg-slate-900/80 dark:bg-black/90 backdrop-blur-md" />

            {/* Modal Content */}
            <motion.div
                className="relative w-[95%] md:w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-4 sm:p-10 border border-slate-200 dark:border-white/10 shadow-2xl custom-scrollbar"
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    aria-label="Close modal"
                    className="absolute top-6 right-6 p-3 rounded-full bg-slate-100 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-slate-200 dark:border-white/5 transition-all duration-300 z-20 group"
                >
                    <FaTimes className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Project Visuals (Left Column) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                loading="lazy"
                                width="800"
                                height="400"
                                className="w-full h-48 sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="bg-slate-900/80 dark:bg-zinc-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/10 shadow-lg flex items-center gap-2">
                                    <FaBriefcase className="w-3 h-3 text-blue-400" />
                                    {project.category}
                                </div>
                            </div>

                            {project.growthMetrics && (
                                <div className="absolute bottom-6 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse-glow">
                                    <FaChartLine className="w-4 h-4" />
                                    {project.growthMetrics}
                                </div>
                            )}
                        </div>

                        {/* Before/After Comparison */}
                        {project.beforeImage && project.afterImage && (
                            <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-slate-200 dark:border-white/5">
                                <h3 className="text-slate-900 dark:text-white font-bold mb-6 flex items-center gap-2 text-lg">
                                    <FaExchangeAlt className="w-5 h-5 text-blue-400" />
                                    Transformation Results
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3 group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Before</p>
                                        </div>
                                        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 group-hover:border-red-500/30 transition-colors duration-300">
                                            <img src={project.beforeImage} alt="Before" loading="lazy" width="600" height="400" className="w-full h-40 object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-3 group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-blue-400 uppercase font-bold tracking-wider">After</p>
                                        </div>
                                        <div className="relative overflow-hidden rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                            <img src={project.afterImage} alt="After" loading="lazy" width="600" height="400" className="w-full h-40 object-cover" />
                                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Project Details (Right Column) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 leading-tight font-heading">{project.title}</h2>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={`w-4 h-4 ${i < Math.floor(project.rating) ? 'text-yellow-400' : 'text-slate-300 dark:text-zinc-600'}`} />
                                    ))}
                                    <span className="text-slate-700 dark:text-zinc-300 ml-2 font-medium">{project.rating}</span>
                                </div>
                                <div className="text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/20">
                                    {project.completionTime}
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-lg font-light border-l-2 border-emerald-500/50 pl-4">
                                {project.description}
                            </p>
                        </div>

                        {/* Client Info */}
                        <div className="bg-slate-50 dark:bg-zinc-800/30 p-5 rounded-xl border border-slate-200 dark:border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 dark:text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">Client</p>
                                <p className="text-slate-900 dark:text-white font-bold text-lg">{project.client}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                {project.client.charAt(0)}
                            </div>
                        </div>

                        {/* Technologies */}
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                                <FaCode className="w-4 h-4 text-blue-400" />
                                Technologies Used
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.map((tech, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-lg text-sm border border-slate-200 dark:border-zinc-700 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 cursor-default">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center gap-2">
                                <FaChartLine className="w-4 h-4 text-blue-400" />
                                Key Results
                            </h3>
                            <div className="space-y-3">
                                {project.results?.map((result, index) => (
                                    <div key={index} className="flex items-start gap-3 text-slate-600 dark:text-zinc-300 bg-slate-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-colors duration-300">
                                        <div className="mt-0.5 p-1 bg-blue-500/20 rounded-full">
                                            <FaCheck className="w-3 h-3 text-blue-400" />
                                        </div>
                                        <span className="font-medium">{result}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => window.open(`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 group"
                            >
                                <FaWhatsapp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                Chat on WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Enhanced Project Card ---
interface ProjectCardProps {
    project: Project;
    index: number;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => {
    // Priority 2: Web Development Visuals
    const isWebDev = project.category === 'Web Development' || project.category === 'E-Commerce';

    return (
        <GlassCard
            className="group h-[450px] cursor-pointer p-0 overflow-hidden"
            hoverEffect={true}
            variants={itemVariants}
            onClick={onClick}
        >
            {/* Image with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    width="600"
                    height="450"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
            </div>

            {/* Priority 2: Web Dev Visual Artifacts */}
            {isWebDev && (
                <>
                    {/* Floating Lighthouse Score */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-lg p-2 shadow-lg z-20 border border-slate-200 dark:border-white/10 flex flex-col items-center gap-1 transform group-hover:scale-110 transition-transform"
                    >
                        <div className="w-8 h-8 rounded-full border-4 border-green-500 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-green-600 dark:text-green-400">100</span>
                        </div>
                        <span className="text-[8px] uppercase font-bold text-slate-500 dark:text-slate-400">Perf</span>
                    </motion.div>

                    {/* Code Snippet Decoration */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-32 left-4 bg-slate-900/90 backdrop-blur-md rounded-lg p-3 shadow-xl z-20 border border-white/10 w-48 hidden sm:block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500"
                    >
                        <div className="flex gap-1 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                        <div className="space-y-1">
                            <div className="h-1.5 w-3/4 bg-purple-500/50 rounded-full" />
                            <div className="h-1.5 w-1/2 bg-blue-500/50 rounded-full ml-2" />
                            <div className="h-1.5 w-2/3 bg-green-500/50 rounded-full" />
                        </div>
                    </motion.div>
                </>
            )}

            {/* Growth Badge */}
            {project.growthMetrics && (
                <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10 flex items-center gap-2 transform group-hover:scale-105 transition-transform duration-300">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    {project.growthMetrics}
                </div>
            )}

            {/* Content Container */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {/* Category */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-500/20">
                            {project.category}
                        </span>
                        <span className="text-zinc-400 text-sm flex items-center gap-1">
                            <FaStar className="w-3 h-3 text-yellow-500" />
                            {project.rating}
                        </span>
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 transition-all duration-300 font-heading">
                        {project.title}
                    </h3>

                    <p className="text-zinc-400 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2 font-light">
                        {project.description}
                    </p>

                    {/* Technologies & Action */}
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 border-t border-white/10 pt-4">
                        <div className="flex -space-x-2">
                            {project.technologies?.slice(0, 3).map((tech, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 font-bold" title={tech}>
                                    {tech.charAt(0)}
                                </div>
                            ))}
                            {project.technologies && project.technologies.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 font-bold">
                                    +{project.technologies.length - 3}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = '/case-studies';
                            }}
                            className="flex items-center gap-2 text-white font-bold text-sm group/btn"
                        >
                            View Case Study
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-blue-500 transition-colors duration-300">
                                <FaArrowRight className="w-3 h-3 group-hover/btn:-rotate-45 transition-transform duration-300" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

// --- Enhanced Projects Preview Section ---
const ProjectsPreview: React.FC = () => {
    const navigate = useNavigate();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [displayedProjects, setDisplayedProjects] = useState(PROJECTS);

    const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleFilterChange = (category: string) => {
        setActiveFilter(category);
        if (category === 'All') {
            setDisplayedProjects(PROJECTS);
        } else {
            setDisplayedProjects(PROJECTS.filter(p => p.category === category));
        }
    };

    return (
        <>
            <section className="relative py-16 md:py-32 overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
                <BackgroundEffects />

                <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        badge="Featured Work"
                        title="Crafting Digital"
                        highlight="Masterpieces"
                        description="Explore our portfolio of award-winning projects where we blend strategic thinking with creative excellence to drive real business growth."
                    />

                    {/* Enhanced Filter Tabs */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-16 overflow-x-auto px-4 pb-4">
                        <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-2 inline-flex gap-2 border border-slate-200 dark:border-white/5 shadow-xl">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    onClick={() => handleFilterChange(category)}
                                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden ${activeFilter === category
                                        ? 'text-white shadow-lg'
                                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {activeFilter === category && (
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600"
                                            layoutId="activeTab"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {category}
                                        {category !== 'All' && (
                                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === category ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                                                {PROJECTS.filter(p => p.category === category).length}
                                            </span>
                                        )}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enhanced Projects Grid */}
                    <motion.div layout className="mb-24">
                        <motion.div
                            className={`grid gap-8 ${displayedProjects.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
                                displayedProjects.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto' :
                                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                }`}
                            variants={containerVariants}
                            layout
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                        >
                            <AnimatePresence mode="popLayout">
                                {displayedProjects.map((project, index) => (
                                    <motion.div
                                        key={project.title}
                                        variants={itemVariants}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                    >
                                        <ProjectCard
                                            project={project}
                                            index={index}
                                            onClick={() => handleProjectClick(project)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* No Projects Found */}
                        {displayedProjects.length === 0 && (
                            <motion.div
                                className="text-center py-24 bg-slate-100 dark:bg-zinc-900/30 rounded-3xl border border-slate-200 dark:border-white/5 border-dashed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-20 h-20 bg-white dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-sm dark:shadow-none">
                                    <FaFolderOpen className="w-10 h-10 text-slate-400 dark:text-zinc-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Projects Found</h3>
                                <p className="text-slate-600 dark:text-zinc-400">We couldn't find any projects in this category.</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Enhanced Call to Action */}
                    <motion.div variants={itemVariants} className="text-center">
                        <GlassCard className="p-12 lg:p-20 bg-zinc-900/50 backdrop-blur-xl border border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-500/10 to-purple-500/10" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />

                            <div className="relative z-10 max-w-4xl mx-auto">
                                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading">
                                    Ready to Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Your Success Story?</span>
                                </h3>
                                <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Join our portfolio of successful projects. Let's discuss how we can bring
                                    your vision to life with innovative solutions and exceptional results.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <motion.button
                                        onClick={(e) => { e.preventDefault(); navigate('/portfolio'); }}
                                        className="group inline-flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-zinc-100 transition-all duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FaBriefcase className="w-5 h-5" />
                                        View Full Portfolio
                                    </motion.button>
                                    <motion.button
                                        onClick={() => window.open(`https://wa.me/${CONTACT_INFO.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                                        className="group inline-flex items-center justify-center gap-3 bg-transparent border border-white/20 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-white/10 transition-all duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FaWhatsapp className="w-5 h-5" />
                                        Chat on WhatsApp
                                    </motion.button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>

            {/* Project Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <ProjectModal
                        project={selectedProject}
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setSelectedProject(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectsPreview;
