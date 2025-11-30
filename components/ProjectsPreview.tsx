import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaChartLine, FaExchangeAlt, FaStar, FaCheck, FaBriefcase, FaArrowRight, FaCommentDots, FaFolderOpen } from 'react-icons/fa';
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl p-8"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-600/50 transition-all z-20"
                >
                    <FaTimes className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Project Visuals */}
                    <div className="space-y-6">
                        <div className="relative">
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                {project.category}
                            </div>
                            {project.growthMetrics && (
                                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                    <FaChartLine className="w-5 h-5" />
                                    {project.growthMetrics}
                                </div>
                            )}
                        </div>

                        {/* Before/After Comparison */}
                        {project.beforeImage && project.afterImage && (
                            <div className="glass-effect p-6 rounded-2xl">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <FaExchangeAlt className="w-5 h-5 text-emerald-400" />
                                    Transformation
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Before</p>
                                        <img src={project.beforeImage} alt="Before" className="w-full h-32 object-cover rounded-xl opacity-70 grayscale" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs text-emerald-400 uppercase font-bold tracking-wider">After</p>
                                        <img src={project.afterImage} alt="After" className="w-full h-32 object-cover rounded-xl border-2 border-emerald-500/50" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Project Details */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={`w-5 h-5 ${i < Math.floor(project.rating) ? 'text-yellow-400' : 'text-zinc-600'}`} />
                                    ))}
                                    <span className="text-zinc-300 ml-2">{project.rating}</span>
                                </div>
                                <div className="text-emerald-400 font-semibold">{project.completionTime}</div>
                            </div>
                            <p className="text-zinc-300 leading-relaxed text-lg">{project.description}</p>
                        </div>

                        {/* Client Info */}
                        <div className="glass-effect p-4 rounded-xl border border-zinc-700/50">
                            <h3 className="text-white font-semibold mb-2">Client</h3>
                            <p className="text-emerald-400 font-medium text-lg">{project.client}</p>
                        </div>

                        {/* Technologies */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies?.map((tech, index) => (
                                    <span key={index} className="px-3 py-1 bg-zinc-700/50 text-zinc-300 rounded-full text-sm border border-zinc-600">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">Key Results</h3>
                            <div className="space-y-3">
                                {project.results?.map((result, index) => (
                                    <div key={index} className="flex items-center gap-3 text-zinc-300 bg-zinc-800/30 p-3 rounded-xl">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                                            <FaCheck className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <span className="font-medium">{result}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-xl font-bold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg shadow-emerald-500/20">
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
        className="group relative overflow-hidden rounded-3xl shadow-2xl h-96 cursor-pointer"
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ duration: 0.3 }}
        onClick={onClick}
    >
        <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full -translate-y-16 translate-x-16" />

        {/* Growth Badge (New) */}
        {project.growthMetrics && (
            <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10 flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                <FaChartLine className="w-4 h-4" />
                {project.growthMetrics}
            </div>
        )}

        {/* Project Number */}
        <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <span className="text-white font-bold text-lg">{(index + 1).toString().padStart(2, '0')}</span>
        </div>

        {/* Project Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {/* Category and Time */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider">
                        {project.category}
                    </span>
                    <span className="text-zinc-300 text-sm font-medium">{project.completionTime}</span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                    {project.title}
                </h3>

                <p className="text-zinc-300 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-relaxed line-clamp-2">
                    {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-zinc-700/50 text-zinc-300 rounded text-xs border border-zinc-600">
                            {tech}
                        </span>
                    ))}
                </div>

                {/* Rating and Client */}
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-4 border-t border-zinc-700/50">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={`w-4 h-4 ${i < Math.floor(project.rating) ? 'text-yellow-400' : 'text-zinc-600'}`} />
                            ))}
                        </div>
                    </div>
                    <span className="text-white text-sm font-medium">{project.client}</span>
                </div>
            </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
                className="py-24 px-4 relative overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 bg-luxury-black" />
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
                <div className="absolute top-2/3 right-1/4 w-64 h-64 bg-blue-500/6 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Section Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16 lg:mb-20">
                        <div className="inline-flex items-center gap-3 glass-effect rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 mb-6 sm:mb-8 mx-4 sm:mx-0">
                            <FaBriefcase className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                            <span className="text-xs sm:text-sm font-bold text-emerald-400 tracking-wide">FEATURED PROJECTS</span>
                            <FaStar className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
                            Portfolio of <span className="text-gradient">Exceptional Work</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-300 max-w-5xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0">
                            Discover our most impactful projects that showcase
                            <span className="text-emerald-400 font-semibold"> innovative solutions, cutting-edge design,</span> and
                            <span className="text-blue-400 font-semibold">measurable business results</span> across various industries.
                        </p>
                    </motion.div>

                    {/* Enhanced Filter Tabs */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-8 sm:mb-12 lg:mb-16 overflow-x-auto px-4 sm:px-0">
                        <div className="glass-effect rounded-2xl p-1 sm:p-2 inline-flex gap-1 sm:gap-2 min-w-max">
                            {categories.map((category, index) => (
                                <motion.button
                                    key={category}
                                    onClick={() => handleFilterChange(category)}
                                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${activeFilter === category
                                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                                        : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {category}
                                    {category !== 'All' && (
                                        <span className="ml-2 px-2 py-0.5 bg-zinc-600/50 rounded-full text-xs">
                                            {PROJECTS.filter(p => p.category === category).length}
                                        </span>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Enhanced Projects Grid */}
                    <motion.div layout className="mb-20">
                        <motion.div
                            className={`grid gap-8 ${displayedProjects.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
                                displayedProjects.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto' :
                                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                }`}
                            variants={containerVariants}
                            layout
                        >
                            <AnimatePresence>
                                {displayedProjects.map((project, index) => (
                                    <motion.div
                                        key={project.title}
                                        variants={itemVariants}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
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
                                className="text-center py-16"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-24 h-24 bg-zinc-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaFolderOpen className="w-12 h-12 text-zinc-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">No Projects Found</h3>
                                <p className="text-zinc-400">Try selecting a different category to see more projects.</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Enhanced Call to Action */}
                    <motion.div variants={itemVariants} className="text-center">
                        <div className="glass-effect rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Create <span className="text-gradient">Your Success Story?</span>
                            </h3>
                            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Join our portfolio of successful projects. Let's discuss how we can bring
                                your vision to life with innovative solutions and exceptional results.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <motion.button
                                    onClick={(e) => { e.preventDefault(); navigate('case-studies'); }}
                                    className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaBriefcase className="w-5 h-5" />
                                    View Full Portfolio
                                    <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                                <motion.button
                                    className="group inline-flex items-center justify-center gap-3 bg-zinc-700 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-zinc-600 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FaCommentDots className="w-5 h-5" />
                                    Start Your Project
                                </motion.button>
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
