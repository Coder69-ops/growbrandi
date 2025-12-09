import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
    FaTimes,
    FaChartLine,
    FaExchangeAlt,
    FaStar,
    FaCheck,
    FaCode,
    FaWhatsapp,
    FaAws,
    FaMobileAlt,
    FaRocket
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { getLocalizedField } from '../../src/utils/localization';
import { useLocalizedPath } from '../../src/hooks/useLocalizedPath';

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

// Helper to get logo for technology
// (Duplicated to avoid circular deps for now, ideal to move to utils)
const getTechLogo = (tech: string) => {
    const t = tech.toLowerCase();
    let src = '';

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
    else if (t.includes('meta') || t.includes('facebook')) src = '/logos/meta.svg';
    else if (t.includes('typescript')) src = '/logos/typescript.svg';
    else if (t.includes('figma')) src = '/logos/figma.svg';
    else if (t.includes('tailwind')) src = '/logos/tailwindcss.svg';
    else if (t.includes('openai') || t.includes('ai')) src = '/logos/openai.svg';

    if (src) {
        return <img src={src} alt={tech} className="w-6 h-6 object-contain" />;
    }

    // Fallback icons
    if (t.includes('aws')) return <FaAws className="text-[#FF9900] text-2xl" />;
    if (t.includes('mobile')) return <FaMobileAlt className="text-slate-400 text-2xl" />;
    return <FaCode className="text-slate-400 text-2xl" />;
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
    const { t, i18n } = useTranslation();
    const { getLocalizedPath } = useLocalizedPath();
    if (!isOpen || !project) return null;

    // Helper to get text: if it's a translation key, use t(), otherwise use getLocalizedField
    const getText = (field: any) => {
        if (!field) return '';
        if (typeof field === 'string') return t(field); // Legacy: translation key
        return getLocalizedField(field, i18n.language); // New: multi-lang object
    };

    // Robust category helper
    const getCategoryLabel = (category: any) => {
        if (typeof category === 'string' && category.startsWith('services.')) return t(category);
        if (typeof category === 'string') return t(`services.${category}.title`);
        return getText(category);
    };

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            {/* Enhanced Backdrop */}
            <div className="absolute inset-0 bg-slate-900/95 dark:bg-black/95 backdrop-blur-xl" />

            {/* Modal Content */}
            <motion.div
                className="relative w-full max-w-7xl h-[90vh] bg-white dark:bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button layer */}
                <div className="absolute top-6 right-6 z-50">
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full bg-black/10 dark:bg-white/10 text-white hover:bg-red-500 hover:text-white backdrop-blur-md transition-all duration-300"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">

                    {/* Hero Section */}
                    <div className="relative h-[400px] md:h-[500px]">
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="container mx-auto"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-600/20">
                                        {getCategoryLabel(project.category)}
                                    </span>
                                    {project.growthMetrics && (
                                        <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-sm font-bold shadow-lg shadow-emerald-500/20">
                                            <FaChartLine /> {getText(project.growthMetrics)}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/10">
                                        <img src="/logos/trustpilot--logo.png" alt="Trustpilot" className="h-6 w-auto brightness-0 invert" />
                                        <span className="text-white text-sm font-bold">5.0</span>
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 font-heading">{getText(project.title)}</h2>
                                <p className="text-lg md:text-xl text-slate-300 max-w-2xl font-light">{getText(project.description)}</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="container mx-auto p-6 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            {/* Left Column: Details & Tech */}
                            <div className="lg:col-span-8 space-y-12">

                                {/* Key Results Cards */}
                                {project.results && project.results.length > 0 && (
                                    <section>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                            <FaRocket className="text-blue-500" /> {t('portfolio.params.key_impact')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {project.results.map((result, i) => (
                                                <div key={i} className="group relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <FaRocket className="text-6xl text-blue-500 transform rotate-45" />
                                                    </div>
                                                    <div className="relative z-10 flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0 group-hover:scale-110 transition-transform">
                                                            <FaChartLine className="text-xl" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Impact {i + 1}</h4>
                                                            <p className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{getText(result)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Before/After Section */}
                                {project.beforeImage && project.afterImage && (
                                    <section>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                            <FaExchangeAlt className="text-blue-500" /> {t('portfolio.params.transformation')}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{t('portfolio.params.before')}</p>
                                                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 opacity-70">
                                                    <img src={project.beforeImage} alt="Before transformation" className="w-full h-48 object-cover grayscale" />
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-lg" />
                                                <p className="relative z-10 text-sm font-bold text-blue-500 uppercase tracking-wider mb-3">{t('portfolio.params.after_our_magic')}</p>
                                                <div className="relative z-10 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-2xl">
                                                    <img src={project.afterImage} alt="After transformation" className="w-full h-48 object-cover" />
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* Tech Stack */}
                                <section>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                        <FaCode className="text-blue-500" /> {t('portfolio.params.tech_stack')}
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {project.technologies?.map((tech, i) => (
                                            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-sm hover:border-blue-500/50 transition-colors">
                                                <span className="flex-shrink-0">{getTechLogo(tech)}</span>
                                                <span className="font-bold text-slate-700 dark:text-zinc-300">{t(tech)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                            </div>

                            {/* Right Column: Meta & Actions */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-slate-50 dark:bg-zinc-900 rounded-3xl p-8 border border-slate-200 dark:border-white/5 sticky top-6">
                                    <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">{t('portfolio.params.project_metadata')}</h4>

                                    <div className="space-y-6">
                                        <div className="group">
                                            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{t('portfolio.params.client')}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400 text-lg font-bold border border-slate-200 dark:border-white/10">
                                                    {getText(project.client).charAt(0)}
                                                </div>
                                                <p className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{getText(project.client)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{t('portfolio.params.timeline')}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <p className="text-xl font-bold text-slate-900 dark:text-white">{getText(project.completionTime)}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-500/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t('portfolio.params.verified_review')}</p>
                                                <div className="flex text-yellow-500 text-xs">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-2xl font-black text-slate-900 dark:text-white">5.0</span>
                                                <img src="/logos/trustpilot--logo.png" alt="Trustpilot" className="h-5 w-auto" />
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-emerald-200/60 font-medium">Top rated on Trustpilot</p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-200 dark:bg-white/10 my-8" />

                                    <div className="space-y-3">
                                        <h4 className="font-bold text-slate-900 dark:text-white">{t('portfolio.params.ready_for_results')}</h4>
                                        <button
                                            onClick={() => window.open('https://wa.me/15551234567', '_blank')}
                                            className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
                                        >
                                            <FaWhatsapp className="text-xl" /> {t('portfolio.params.chat_whatsapp')}
                                        </button>
                                        <Link to={getLocalizedPath('/contact')} className="block">
                                            <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-bold border border-transparent hover:scale-[1.02] transition-transform">
                                                {t('portfolio.params.book_consultation')}
                                            </button>
                                        </Link>
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
