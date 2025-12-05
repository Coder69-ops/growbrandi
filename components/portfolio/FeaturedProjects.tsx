import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../../constants';
import { Project } from '../../types';
import { ProjectModal } from './ProjectModal';
import {
    FaFolderOpen,
    FaArrowRight,
    FaChartLine,
    FaAws,
    FaMobileAlt,
    FaCode,
    FaRocket,
    FaStar
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Helper to get logo for technology
const getTechLogo = (tech: string) => {
    const t = tech.toLowerCase();
    let src = '';

    // Mapping logic
    if (t.includes('react')) src = '/logos/react.svg';
    else if (t.includes('node')) src = '/logos/nodedotjs.svg';
    else if (t.includes('shopify')) src = '/logos/shopify.svg';
    else if (t.includes('wordpress')) src = '/logos/wordpress.svg';
    else if (t.includes('next')) src = '/logos/nextdotjs.svg';
    else if (t.includes('vue')) src = '/logos/vue.svg';
    else if (t.includes('firebase')) src = '/logos/firebase.svg';
    else if (t.includes('python')) src = '/logos/python.svg';
    else if (t.includes('stripe')) src = '/logos/stripe.svg';
    else if (t.includes('google')) src = '/logos/google.svg';
    else if (t.includes('meta')) src = '/logos/meta.svg';
    else if (t.includes('facebook')) src = '/logos/facebook.svg';
    else if (t.includes('typescript')) src = '/logos/typescript.svg';
    else if (t.includes('figma')) src = '/logos/figma.svg';
    else if (t.includes('tailwind')) src = '/logos/tailwindcss.svg';
    else if (t.includes('openai') || t.includes('ai')) src = '/logos/openai.svg';

    if (src) {
        return <img src={src} alt={tech} className="w-5 h-5 object-contain" />;
    }

    // Fallback icons
    if (t.includes('aws')) return <FaAws className="text-[#FF9900] text-xl" />;
    if (t.includes('mobile')) return <FaMobileAlt className="text-slate-400 text-xl" />;
    return <FaCode className="text-slate-400 text-xl" />;
};

const ShowcaseItem: React.FC<{
    project: Project;
    index: number;
    onClick: () => void;
}> = ({ project, index, onClick }) => {
    const { t } = useTranslation();
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 md:gap-16 items-center mb-32 relative`}
        >
            {/* Background Decoration */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? '-left-20' : '-right-20'} w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none`} />

            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative group perspective-1000">
                <div
                    onClick={onClick}
                    className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 cursor-pointer transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-1"
                >
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-auto object-cover aspect-[4/3]"
                    />


                </div>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 relative z-10">
                <div className="flex flex-col h-full justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                            {t(project.category)}
                        </span>
                        <div className="h-px flex-grow bg-slate-200 dark:bg-white/10" />
                        <span className="text-sm font-semibold text-slate-500 dark:text-zinc-500">{t(project.client)}</span>
                    </div>

                    {/* Trustpilot Result Badge */}
                    <div className="flex text-yellow-400 text-sm">

                    </div>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">{t('portfolio.params.rated')} {project.rating}/5 {t('portfolio.params.on')}</span>
                <img src="/logos/trustpilot--logo.png" alt="Trustpilot" className="h-6 w-auto grayscale-0" />

                <h2
                    onClick={onClick}
                    className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 font-heading cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {t(project.title)}
                </h2>

                <p className="text-lg text-slate-600 dark:text-zinc-400 mb-8 leading-relaxed">
                    {t(project.description)}
                </p>

                {/* Results Grid - "Make Meaningful" */}
                {project.results && project.results.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {project.results.slice(0, 2).map((res, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="flex items-start gap-3">
                                    <FaRocket className="text-blue-500 mt-1 flex-shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{t(res)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tech Stack - "Use Logos" */}
                <div className="mb-10">
                    <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 mb-3 uppercase tracking-wider">{t('portfolio.params.powered_by')}</p>
                    <div className="flex flex-wrap gap-3">
                        {project.technologies?.map((tech, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-600 dark:text-zinc-400 font-medium hover:border-blue-500/50 hover:text-blue-500 transition-colors shadow-sm" title={t(tech)}>
                                {getTechLogo(tech)}
                                <span>{t(tech)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons - "Funnel" */}
                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={onClick}
                        className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-lg shadow-blue-500/20"
                    >
                        {t('portfolio.params.view_case_study')} <FaArrowRight />
                    </button>
                    <Link to="/contact">
                        <button className="px-8 py-4 rounded-full font-bold border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                            {t('portfolio.params.want_site_like_this')}
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export const FeaturedProjects: React.FC = () => {
    const { t } = useTranslation();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('All');

    const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

    const displayedProjects = activeFilter === 'All'
        ? PROJECTS
        : PROJECTS.filter(p => p.category === activeFilter);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleFilterChange = (category: string) => {
        setActiveFilter(category);
    };

    return (
        <>
            <section className="py-20 px-4 bg-slate-50 dark:bg-black transition-colors duration-300 min-h-screen">
                <div className="container mx-auto max-w-7xl">

                    {/* Filter Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-wrap justify-center gap-3 mb-24 relative z-30 sticky top-24 lg:top-0 bg-slate-50/80 dark:bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 lg:border-none lg:bg-transparent"
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleFilterChange(category)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border cursor-pointer ${activeFilter === category
                                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white shadow-lg transform scale-105'
                                    : 'bg-white dark:bg-zinc-900 text-slate-500 border-slate-200 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {t(category)}
                                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${activeFilter === category ? 'bg-white/20 text-white dark:text-black dark:bg-black/10' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400'}`}>
                                    {category === 'All' ? PROJECTS.length : PROJECTS.filter(p => p.category === category).length}
                                </span>
                            </button>
                        ))}
                    </motion.div>

                    {/* Projects Showcase Stream */}
                    <div className="mb-24 px-4 lg:px-0">
                        <AnimatePresence mode="wait">
                            {displayedProjects.length > 0 ? (
                                <div>
                                    {displayedProjects.map((project, index) => (
                                        <ShowcaseItem
                                            key={project.title}
                                            project={project}
                                            index={index}
                                            onClick={() => handleProjectClick(project)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-32 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl"
                                >
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FaFolderOpen className="w-10 h-10 text-slate-400 dark:text-zinc-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('portfolio.no_projects.title')}</h3>
                                    <p className="text-slate-500 dark:text-zinc-500">{t('portfolio.no_projects.description')}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Lead Magnet / Trust Signifier */}
                    <div className="border-t border-slate-200 dark:border-white/10 pt-20 text-center">
                        <p className="text-slate-500 dark:text-zinc-500 mb-10 font-medium tracking-[0.2em] text-xs">{t('hero.trusted_by')}</p>
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0">
                            {/* Use Real Logos Here */}
                            {[
                                { name: 'Google', src: '/logos/google.svg' },
                                { name: 'Microsoft', src: '/logos/microsoft.svg' },
                                { name: 'Amazon', src: '/logos/amazon.svg' },
                                { name: 'Spotify', src: '/logos/spotify.svg' },
                                { name: 'Tesla', src: '/logos/tesla.svg' },
                                { name: 'Netflix', src: '/logos/netflix.svg' }
                            ].map((brand, i) => (
                                <img
                                    key={i}
                                    src={brand.src}
                                    alt={brand.name}
                                    className="h-8 md:h-10 object-contain"
                                />
                            ))}
                        </div>
                    </div>

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
