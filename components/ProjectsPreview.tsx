import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaChartLine, FaExchangeAlt, FaStar, FaCheck, FaBriefcase, FaArrowRight, FaCommentDots, FaFolderOpen, FaRocket, FaCode } from 'react-icons/fa';
import { PROJECTS } from '../constants';
import { Project } from '../types';

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
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* Modal Content */}
            <motion.div
                className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl custom-scrollbar"
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-3 rounded-full bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-white/5 transition-all duration-300 z-20 group"
                >
                    <FaTimes className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Project Visuals (Left Column) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="bg-zinc-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/10 shadow-lg flex items-center gap-2">
                                    <FaBriefcase className="w-3 h-3 text-emerald-400" />
                                    {project.category}
                                </div>
                            </div>

                            {project.growthMetrics && (
                                <div className="absolute bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse-glow">
                                    <FaChartLine className="w-4 h-4" />
                                    {project.growthMetrics}
                                </div>
                            )}
                        </div>

                        {/* Before/After Comparison */}
                        {project.beforeImage && project.afterImage && (
                            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-white/5">
                                <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                                    <FaExchangeAlt className="w-5 h-5 text-emerald-400" />
                                    Transformation Results
                                </h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3 group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Before</p>
                                        </div>
                                        <div className="relative overflow-hidden rounded-xl border border-white/5 group-hover:border-red-500/30 transition-colors duration-300">
                                            <img src={project.beforeImage} alt="Before" className="w-full h-40 object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                    <div className="space-y-3 group">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider">After</p>
                                        </div>
                                        <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                            <img src={project.afterImage} alt="After" className="w-full h-40 object-cover" />
                                            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Project Details (Right Column) */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h2 className="text-4xl font-black text-white mb-4 leading-tight font-heading">{project.title}</h2>
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-white/5">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={`w-4 h-4 ${i < Math.floor(project.rating) ? 'text-yellow-400' : 'text-zinc-600'}`} />
                                    ))}
                                    <span className="text-zinc-300 ml-2 font-medium">{project.rating}</span>
                                </div>
                                <div className="text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                    {project.completionTime}
                                </div>
                            </div>
                            <p className="text-zinc-300 leading-relaxed text-lg font-light border-l-2 border-emerald-500/50 pl-4">
                                {project.description}
                            </p>
                        </div>

                        {/* Client Info */}
                        <div className="bg-zinc-800/30 p-5 rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-1">Client</p>
                                <p className="text-white font-bold text-lg">{project.client}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                {project.client.charAt(0)}
                            </div>
                        </div>

                        {/* Technologies */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <FaCode className="w-4 h-4 text-blue-400" />
                                Technologies Used
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.map((tech, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-sm border border-zinc-700 hover:border-blue-500/50 hover:text-blue-400 transition-colors duration-300 cursor-default">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <FaChartLine className="w-4 h-4 text-emerald-400" />
                                Key Results
                            </h3>
                            <div className="space-y-3">
                                {project.results?.map((result, index) => (
                                    <div key={index} className="flex items-start gap-3 text-zinc-300 bg-zinc-800/30 p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors duration-300">
                                        <div className="mt-0.5 p-1 bg-emerald-500/20 rounded-full">
                                            <FaCheck className="w-3 h-3 text-emerald-400" />
                                        </div>
                                        <span className="font-medium">{result}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group">
                                <FaRocket className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                                Start Similar Project
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

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => (
    <motion.div
        className="group relative overflow-hidden rounded-3xl shadow-2xl h-[450px] cursor-pointer border border-white/5 bg-zinc-900"
        variants={itemVariants}
        whileHover={{ y: -10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={onClick}
    >
        {/* Image with Zoom Effect */}
        <div className="absolute inset-0 overflow-hidden">
            <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full -translate-y-20 translate-x-20 blur-2xl group-hover:bg-emerald-500/30 transition-colors duration-500" />

        {/* Growth Badge */}
        {project.growthMetrics && (
            <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10 flex items-center gap-2 transform group-hover:scale-105 transition-transform duration-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {project.growthMetrics}
            </div>
        )}

        {/* Project Number */}
        <div className="absolute top-6 right-6 w-12 h-12 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 transition-colors duration-300">
            <span className="text-white/80 font-bold font-heading text-lg">{(index + 1).toString().padStart(2, '0')}</span>
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                {/* Category */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-emerald-500/20">
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

                    <button className="flex items-center gap-2 text-white font-bold text-sm group/btn">
                        View Case Study
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-emerald-500 transition-colors duration-300">
                            <FaArrowRight className="w-3 h-3 group-hover/btn:-rotate-45 transition-transform duration-300" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

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
            <motion.section
                className="py-32 px-4 relative overflow-hidden bg-luxury-black"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
            >
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-luxury-black to-luxury-black" />
                    <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Section Header */}
                    <motion.div variants={itemVariants} className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 glass-effect rounded-full px-6 py-2 mb-8 border border-white/5">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm font-bold text-emerald-400 tracking-widest uppercase">Featured Work</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight text-white">
                            Crafting Digital <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 animate-gradient-x">
                                Masterpieces
                            </span>
                        </h2>

                        <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
                            Explore our portfolio of award-winning projects where we blend
                            <span className="text-white font-medium"> strategic thinking</span> with
                            <span className="text-white font-medium"> creative excellence</span> to drive real business growth.
                        </p>
                    </motion.div>

                    {/* Enhanced Filter Tabs */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-16 overflow-x-auto px-4 pb-4">
                        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl p-2 inline-flex gap-2 border border-white/5 shadow-xl">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    onClick={() => handleFilterChange(category)}
                                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden ${activeFilter === category
                                        ? 'text-white shadow-lg'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
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
                                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === category ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
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
                                className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-white/5 border-dashed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                    <FaFolderOpen className="w-10 h-10 text-zinc-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
                                <p className="text-zinc-500">We couldn't find any projects in this category.</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Enhanced Call to Action */}
                    <motion.div variants={itemVariants} className="text-center">
                        <div className="relative overflow-hidden rounded-[3rem] p-12 lg:p-20 border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />

                            <div className="relative z-10 max-w-4xl mx-auto">
                                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 font-heading">
                                    Ready to Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Your Success Story?</span>
                                </h3>
                                <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                    Join our portfolio of successful projects. Let's discuss how we can bring
                                    your vision to life with innovative solutions and exceptional results.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <motion.button
                                        onClick={(e) => { e.preventDefault(); navigate('case-studies'); }}
                                        className="group inline-flex items-center justify-center gap-3 bg-white text-black font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-zinc-100 transition-all duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FaBriefcase className="w-5 h-5" />
                                        View Full Portfolio
                                    </motion.button>
                                    <motion.button
                                        onClick={() => navigate('/contact')}
                                        className="group inline-flex items-center justify-center gap-3 bg-transparent border border-white/20 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-white/10 transition-all duration-300"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FaCommentDots className="w-5 h-5" />
                                        Start Your Project
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

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
