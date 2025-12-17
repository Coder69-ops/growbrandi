import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaBriefcase, FaWhatsapp } from 'react-icons/fa';
import { Project } from '../types';
import { useContent } from '../src/hooks/useContent';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';
// import { CONTACT_INFO } from '../constants'; // Removed
import { BackgroundEffects } from './ui/BackgroundEffects';
import { GlassCard } from './ui/GlassCard';
import { SectionHeading } from './ui/SectionHeading';
import { ProjectCard } from './portfolio/ProjectCard';
import { ProjectModal } from './portfolio/ProjectModal';
import { Skeleton } from './ui/Skeleton';

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

// --- Enhanced Projects Preview Section ---
const ProjectsPreview: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { getLocalizedPath } = useLocalizedPath();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('All');

    // Use dynamic content with fallback
    const { data: projectsData, loading } = useContent<Project>(
        'projects',
        { localizedFields: ['title', 'description', 'category'] }
    );

    // const contactSettings = CONTACT_INFO; // Removed

    const categories = ['All', ...Array.from(new Set(projectsData.map(p => p.category)))];

    // Direct derivation for filtering
    const displayedProjects = activeFilter === 'All'
        ? projectsData
        : projectsData.filter(p => p.category === activeFilter);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleFilterChange = (category: string) => {
        setActiveFilter(category);
    };

    return (
        <>
            <section className="relative py-16 md:py-32 overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
                <BackgroundEffects />

                <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        badge={t('projects_preview.badge')}
                        title={t('projects_preview.title')}
                        highlight="Masterpieces"
                        description={t('projects_preview.description')}
                    />

                    {/* Enhanced Filter Tabs - Added z-index */}
                    {!loading && (
                        <motion.div variants={itemVariants} className="flex justify-center mb-16 overflow-x-auto px-4 pb-4 relative z-20">
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
                                            {category === 'All' ? t('projects_preview.filter_all') : t(`services.${category}.title`)}
                                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === category ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'}`}>
                                                {category === 'All' ? projectsData.length : projectsData.filter(p => p.category === category).length}
                                            </span>
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Enhanced Projects Grid */}
                    <div className="mb-24">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="aspect-[4/3] rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
                                        <Skeleton className="w-full h-full absolute inset-0 rounded-none bg-slate-200/50 dark:bg-zinc-800/50" />
                                        <div className="absolute top-6 left-6 right-6">
                                            <Skeleton className="h-6 w-1/3 rounded-full mb-2" />
                                            <Skeleton className="h-4 w-1/2 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                className={`grid gap-8 ${displayedProjects.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
                                    displayedProjects.length === 2 ? 'grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto' :
                                        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                                    }`}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <AnimatePresence mode="wait">
                                    {displayedProjects.map((project, index) => (
                                        <motion.div
                                            key={project.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <ProjectCard
                                                project={project}
                                                onClick={() => handleProjectClick(project)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {/* No Projects Found */}
                        {!loading && displayedProjects.length === 0 && (
                            <motion.div
                                className="text-center py-24 bg-slate-100 dark:bg-zinc-900/30 rounded-3xl border border-slate-200 dark:border-white/5 border-dashed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="w-20 h-20 bg-white dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-sm dark:shadow-none">
                                    <FaFolderOpen className="w-10 h-10 text-slate-400 dark:text-zinc-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('projects_preview.no_projects')}</h3>
                                <p className="text-slate-600 dark:text-zinc-400">{t('projects_preview.no_projects_desc')}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Enhanced Call to Action */}
                    <motion.div variants={itemVariants} className="text-center">
                        <GlassCard className="p-12 lg:p-20 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200/50 dark:border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-blue-500/10 dark:to-purple-500/10" />
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[80px]" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[80px]" />

                            <div className="relative z-10 max-w-4xl mx-auto">
                                <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 font-heading">
                                    {t('projects_preview.cta_title_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-500">{t('projects_preview.cta_title_highlight')}</span>
                                </h3>
                                <p className="text-xl text-slate-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                                    {t('projects_preview.cta_description')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <button
                                        onClick={(e) => { e.preventDefault(); navigate(getLocalizedPath('/portfolio')); }}
                                        className="group inline-flex items-center justify-center gap-3 bg-slate-900 text-white dark:bg-white dark:text-black font-bold py-4 px-10 rounded-full text-lg shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300"
                                    >
                                        <FaBriefcase className="w-5 h-5" />
                                        {t('projects_preview.cta_portfolio')}
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://wa.me/15551234567`, '_blank')}
                                        className="group inline-flex items-center justify-center gap-3 bg-transparent border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300"
                                    >
                                        <FaWhatsapp className="w-5 h-5 text-green-600 dark:text-green-500" />
                                        {t('projects_preview.cta_whatsapp')}
                                    </button>
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

