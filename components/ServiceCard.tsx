import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaExpand, FaInfoCircle, FaClock, FaUser, FaCode, FaChartLine, FaArrowRight, FaTimes, FaBriefcase } from 'react-icons/fa';
import { PROJECTS } from '../constants';
import { Project } from '../types';

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

// --- StarRating Component ---
const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-slate-600'}`}
                />
            ))}
        </div>
    );
};

// --- Enhanced ProjectCard Component ---
const ProjectCard: React.FC<{ project: Project; onViewDetails: (project: Project) => void }> = ({ project, onViewDetails }) => (
    <motion.div
        className="glass-effect rounded-3xl overflow-hidden group relative"
        variants={itemVariants}
        whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.4 } }}
    >
        {/* Featured Badge */}
        {project.rating >= 4.9 && (
            <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FaStar className="w-3 h-3" />
                    FEATURED
                </div>
            </div>
        )}

        <div className="relative overflow-hidden">
            <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                    <FaExpand className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                    <FaInfoCircle className="w-4 h-4" />
                </button>
            </div>

            {/* Category Badge */}
            <div className="absolute bottom-4 left-4">
                <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {project.category}
                </span>
            </div>

            {/* Completion Time */}
            {project.completionTime && (
                <div className="absolute bottom-4 right-4">
                    <span className="bg-slate-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm flex items-center gap-2">
                        <FaClock className="w-4 h-4" />
                        {project.completionTime}
                    </span>
                </div>
            )}
        </div>

        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white group-hover:text-gradient transition-colors duration-300 mb-3">
                        {project.title}
                    </h3>
                    {project.client && (
                        <div className="flex items-center gap-2 mb-3">
                            <FaUser className="w-4 h-4 text-emerald-400" />
                            <p className="text-emerald-400 font-medium">{project.client}</p>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end">
                    <StarRating rating={project.rating} />
                    <span className="text-yellow-400 text-sm font-medium mt-1">{project.rating}</span>
                </div>
            </div>

            <p className="text-slate-300 leading-relaxed mb-6">{project.description}</p>

            {project.technologies && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <FaCode className="w-4 h-4" />
                        Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                            <span key={index} className="bg-slate-800/50 text-slate-300 px-3 py-2 rounded-lg text-sm font-medium border border-slate-700 hover:border-emerald-500/50 transition-colors">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {project.results && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                        <FaChartLine className="w-4 h-4" />
                        Key Results
                    </h4>
                    <div className="space-y-2">
                        {project.results.slice(0, 3).map((result, index) => (
                            <div key={index} className="flex items-center text-sm text-slate-300">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 flex-shrink-0" />
                                {result}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <motion.button
                onClick={() => onViewDetails(project)}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <span>View Full Case Study</span>
                <FaArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
        </div>
    </motion.div>
);

// --- Project Modal Component ---
const ProjectModal: React.FC<{ project: Project | null; isOpen: boolean; onClose: () => void }> = ({ project, isOpen, onClose }) => {
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
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
                className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative">
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>

                    {/* Project Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                {project.category}
                            </span>
                            {project.completionTime && (
                                <span className="bg-slate-900/80 text-white px-4 py-2 rounded-full text-sm">
                                    {project.completionTime}
                                </span>
                            )}
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">{project.title}</h2>
                        {project.client && (
                            <p className="text-emerald-400 font-medium text-lg">Client: {project.client}</p>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Project Details */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">Project Overview</h3>
                                <p className="text-slate-300 leading-relaxed text-lg">{project.description}</p>
                            </div>

                            {project.technologies && (
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.technologies.map((tech, index) => (
                                            <span key={index} className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg font-medium border border-slate-700">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Client Rating</h3>
                                    <div className="flex items-center gap-3">
                                        <StarRating rating={project.rating} />
                                        <span className="text-yellow-400 font-bold text-xl">{project.rating}</span>
                                    </div>
                                </div>
                                <motion.button
                                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Similar Project
                                </motion.button>
                            </div>
                        </div>

                        {/* Results & Impact */}
                        <div className="space-y-8">
                            {project.results && (
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-6">Results & Impact</h3>
                                    <div className="space-y-4">
                                        {project.results.map((result, index) => (
                                            <motion.div
                                                key={index}
                                                className="glass-effect p-4 rounded-xl"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                                                    <span className="text-slate-300 font-medium">{result}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Project Info */}
                            <div className="glass-effect p-6 rounded-xl">
                                <h3 className="text-xl font-semibold text-white mb-4">Project Timeline</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Planning & Strategy</span>
                                        <span className="text-emerald-400 font-medium">Week 1-2</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Design & Development</span>
                                        <span className="text-emerald-400 font-medium">Week 3-6</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Testing & Launch</span>
                                        <span className="text-emerald-400 font-medium">Week 7-8</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Enhanced ProjectsPage Component ---
export const ProjectsPage: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('rating');

    const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

    const filteredProjects = PROJECTS
        .filter(project => filter === 'All' || project.category === filter)
        .sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            return 0;
        });

    const handleViewDetails = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };



    return (
        <>
            <section className="py-24 px-4 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/70" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute top-2/3 left-2/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Header */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 mb-8">
                                <FaBriefcase className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-400 tracking-wide">OUR PORTFOLIO</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                                Projects That <span className="text-gradient">Drive Results</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                                Discover how we've helped businesses achieve extraordinary growth through
                                <span className="text-emerald-400 font-semibold"> innovative digital solutions</span> and
                                <span className="text-blue-400 font-semibold">strategic thinking</span>.
                            </p>
                        </motion.div>
                    </div>



                    {/* Filter and Sort Controls */}
                    <motion.div
                        className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${filter === category
                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                                            : 'glass-effect text-slate-300 hover:text-white hover:bg-slate-700/50'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-4">
                            <span className="text-slate-400 font-medium">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="glass-effect text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-emerald-400 focus:outline-none"
                            >
                                <option value="rating">Rating</option>
                                <option value="title">Title</option>
                            </select>
                        </div>
                    </motion.div>

                    {/* Projects Grid */}
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.title}
                                    project={project}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Ready to Start Your <span className="text-gradient">Next Project?</span>
                            </h2>
                            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Let's discuss how we can help you achieve similar results with a custom digital solution
                                tailored to your business needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Start Your Project
                                </motion.button>
                                <motion.button
                                    className="glass-effect text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-700/50 transition-all duration-300 border border-slate-600 hover:border-emerald-400"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Schedule Consultation
                                </motion.button>
                            </div>
                        </div>
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