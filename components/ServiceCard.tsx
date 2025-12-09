import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaExpand, FaInfoCircle, FaClock, FaUser, FaCode, FaChartLine, FaArrowRight, FaTimes, FaBriefcase } from 'react-icons/fa';
// import { PROJECTS } from '../constants'; // Removed
import { useContent } from '../src/hooks/useContent';
import { Project } from '../types';
import { Skeleton } from './ui/Skeleton';

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
                    className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-slate-300 dark:text-zinc-600'}`}
                />
            ))}
        </div>
    );
};

// --- Enhanced ProjectCard Component ---
const ProjectCard: React.FC<{ project: Project; onViewDetails: (project: Project) => void }> = ({ project, onViewDetails }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            className="glass-effect rounded-3xl overflow-hidden group relative border border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900"
            variants={itemVariants}
            whileHover={{ y: -12, scale: 1.03, transition: { duration: 0.4 } }}
        >
            {/* Featured Badge */}
            {project.rating >= 4.9 && (
                <div className="absolute top-4 right-4 z-20">
                    <div className="bg-white text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 tracking-wider shadow-lg">
                        <FaStar className="w-3 h-3 text-yellow-500" />
                        {t('portfolio.ui.featured')}
                    </div>
                </div>
            )}

            <div className="relative overflow-hidden h-64">
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    loading="lazy"
                    width="800"
                    height="600"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors" aria-label="Expand project image">
                        <FaExpand className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors" aria-label="View project info">
                        <FaInfoCircle className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-600/90 dark:bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {t(project.category)}
                    </span>
                </div>

                {/* Completion Time */}
                {project.completionTime && (
                    <div className="absolute bottom-4 right-4">
                        <span className="bg-slate-900/90 dark:bg-zinc-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
                            <FaClock className="w-4 h-4" aria-hidden="true" />
                            {project.completionTime}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 font-heading tracking-tight">
                            {t(project.title)}
                        </h3>
                        {project.client && (
                            <div className="flex items-center gap-2 mb-3">
                                <FaUser className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                                <p className="text-blue-600 dark:text-blue-400 font-medium">{project.client}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-end">
                        <StarRating rating={project.rating} />
                        <span className="text-yellow-500 dark:text-yellow-400 text-sm font-medium mt-1">{project.rating}</span>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mb-6 font-light line-clamp-3">{t(project.description)}</p>

                {project.technologies && (
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <FaCode className="w-4 h-4" />
                            {t('portfolio.ui.technologies')}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 4).map((tech, index) => (
                                <span key={index} className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-300 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-white/30 transition-colors">
                                    {t(tech)}
                                </span>
                            ))}
                            {project.technologies.length > 4 && (
                                <span className="bg-slate-100 dark:bg-zinc-800/50 text-slate-600 dark:text-zinc-300 px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-white/10">
                                    +{project.technologies.length - 4}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {project.results && (
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <FaChartLine className="w-4 h-4" />
                            {t('portfolio.ui.key_results')}
                        </h4>
                        <div className="space-y-2">
                            {project.results.slice(0, 2).map((result, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3 flex-shrink-0" />
                                    {t(result)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <motion.button
                    onClick={() => onViewDetails(project)}
                    className="w-full border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-300 py-3 px-6 rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 group/btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span>{t('portfolio.ui.view_case_study')}</span>
                    <FaArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </motion.div>
    );
};

// --- Project Modal Component ---
const ProjectModal: React.FC<{ project: Project | null; isOpen: boolean; onClose: () => void }> = ({ project, isOpen, onClose }) => {
    const { t } = useTranslation();
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
                className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900"
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
                        loading="lazy"
                        width="800"
                        height="600"
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
                            <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                {t(project.category)}
                            </span>
                            {project.completionTime && (
                                <span className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm border border-white/10">
                                    {project.completionTime}
                                </span>
                            )}
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2 font-heading">{t(project.title)}</h2>
                        {project.client && (
                            <p className="text-blue-400 font-medium text-lg">Client: {project.client}</p>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Project Details */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 font-heading">{t('portfolio.ui.project_overview')}</h3>
                                <p className="text-slate-600 dark:text-zinc-400 mb-8 flex-grow leading-relaxed text-lg font-light">{t(project.description)}</p>
                            </div>

                            {project.technologies && (
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 font-heading">{t('portfolio.ui.technologies_used')}</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.technologies.map((tech, index) => (
                                            <span key={index} className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-4 py-2 rounded-lg font-medium border border-slate-200 dark:border-zinc-700">
                                                {t(tech)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-zinc-800/50 rounded-2xl border border-slate-200 dark:border-white/5">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 font-heading">{t('portfolio.ui.client_rating')}</h3>
                                    <div className="flex items-center gap-3">
                                        <StarRating rating={project.rating} />
                                        <span className="text-yellow-500 dark:text-yellow-400 font-bold text-xl">{project.rating}</span>
                                    </div>
                                </div>
                                <motion.button
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {t('portfolio.ui.start_similar')}
                                </motion.button>
                            </div>
                        </div>

                        {/* Results & Impact */}
                        <div className="space-y-8">
                            {project.results && (
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-heading">{t('portfolio.ui.results_impact')}</h3>
                                    <div className="space-y-4">
                                        {project.results.map((result, index) => (
                                            <motion.div
                                                key={index}
                                                className="glass-effect p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" />
                                                    <span className="text-slate-700 dark:text-zinc-300 font-medium">{t(result)}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Project Info */}
                            <div className="glass-effect p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 font-heading">{t('portfolio.ui.project_timeline')}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                                        <span className="text-slate-500 dark:text-zinc-400">Planning & Strategy</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">Week 1-2</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                                        <span className="text-slate-500 dark:text-zinc-400">Design & Development</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">Week 3-6</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">Testing & Launch</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">Week 7-8</span>
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
    const { t } = useTranslation();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filter, setFilter] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('rating');

    // Use dynamic content
    const { data: projectsData, loading } = useContent<Project>('projects');
    const categories = ['All', ...Array.from(new Set(projectsData.map((p: any) => p.category)))];

    const filteredProjects = projectsData
        .filter((project: any) => filter === 'All' || project.category === filter)
        .sort((a, b) => {
            if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
            return 0;
        });

    const handleViewDetails = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <>
            <section className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-luxury-black transition-colors duration-300">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50 to-slate-50 dark:from-zinc-900/90 dark:via-luxury-black dark:to-luxury-black" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    {/* Enhanced Header */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-3 mb-8 border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5">
                                <FaBriefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wide">{t('portfolio.page.badge')}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight font-heading text-slate-900 dark:text-white">
                                {t('portfolio.page.title_prefix')} <span className="text-gradient">{t('portfolio.page.title_highlight')}</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-zinc-300 max-w-4xl mx-auto leading-relaxed font-light">
                                {t('portfolio.page.description')}
                                <span className="text-blue-600 dark:text-blue-400 font-semibold">{t('portfolio.page.description_highlight1')}</span> and
                                <span className="text-blue-600 dark:text-blue-400 font-semibold">{t('portfolio.page.description_highlight2')}</span>.
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
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${filter === category
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                                        : 'glass-effect text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-700/50 border border-slate-200 dark:border-white/5'
                                        }`}
                                >
                                    {category === 'All' ? t('portfolio.page.filter.all') : t(category)}
                                </button>
                            ))}
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-4">
                            <span className="text-slate-600 dark:text-zinc-400 font-medium">{t('portfolio.page.filter.sort_by')}</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                aria-label="Sort projects by"
                                className="glass-effect text-slate-900 dark:text-white px-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-600 focus:border-blue-500 focus:outline-none bg-white/50 dark:bg-zinc-900"
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
                            {loading ? (
                                <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 space-y-4">
                                            <Skeleton className="h-64 w-full" />
                                            <div className="p-8 space-y-4">
                                                <div className="flex justify-between">
                                                    <Skeleton className="h-8 w-1/2" />
                                                    <Skeleton className="h-6 w-12 rounded-full" />
                                                </div>
                                                <Skeleton className="h-20 w-full" />
                                                <Skeleton className="h-10 w-full rounded-xl" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                filteredProjects.map((project) => (
                                    <ProjectCard
                                        key={project.title}
                                        project={project}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/5">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 font-heading">
                                {t('portfolio.page.cta.title_prefix')} <span className="text-gradient">{t('portfolio.page.cta.title_highlight')}</span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-zinc-300 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
                                {t('portfolio.page.cta.description')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <motion.button
                                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {t('portfolio.page.cta.button_start')}
                                </motion.button>
                                <motion.button
                                    className="glass-effect text-slate-700 dark:text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 dark:hover:bg-zinc-700/50 transition-all duration-300 border border-slate-200 dark:border-zinc-600 hover:border-blue-500 dark:hover:border-blue-400"
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {t('portfolio.page.cta.button_schedule')}
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