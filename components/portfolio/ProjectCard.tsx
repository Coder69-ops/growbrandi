import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaChartLine } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Project } from '../../types';
import { getLocalizedField } from '../../src/utils/localization';

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    className?: string; // Allow custom classes for grid spans
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, className = "" }) => {
    const { t, i18n } = useTranslation();

    // Helper to get text: if it's a translation key, use t(), otherwise use getLocalizedField
    const getText = (field: any, isCategory: boolean = false) => {
        if (!field) return '';

        // If it's a multi-lang object, use it directly
        if (typeof field === 'object') return getLocalizedField(field, i18n.language);

        // If it's a string, it might be a key or raw text
        if (typeof field === 'string') {
            if (isCategory) {
                // For categories, we know the prefix
                const key = `services.${field}.title`;
                const translated = t(key);
                // If translation fails (returns key), return the capitalized raw string
                return translated === key ? field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : translated;
            }
            // For other strings, if it contains dots it's likely a key
            if (field.includes('.')) return t(field);
            return field; // Return as is to avoid missingKey warnings
        }
        return String(field);
    };

    return (
        <motion.div
            variants={itemVariants}
            onClick={onClick}
            className={`group relative h-[500px] w-full cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none ${className}`}
        >
            {/* Background Image with Parallax-like scale */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 dark:opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
            </div>

            {/* Content Content - Always Visible Elements */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">

                {/* Top Header: Tags & Metrics */}
                <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-white/90 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider shadow-sm">
                        {getText(project.category, true)}
                    </span>

                    {project.growthMetrics && (
                        <div className="flex items-center gap-2 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm transform group-hover:translate-y-[-2px] transition-transform">
                            <FaChartLine />
                            {getText(project.growthMetrics)}
                        </div>
                    )}
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-none font-heading opacity-100 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                        {getText(project.title)}
                    </h3>

                    <p className="text-slate-200 dark:text-zinc-300 text-sm md:text-base line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 mb-6 font-medium">
                        {getText(project.description)}
                    </p>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between border-t border-white/20 pt-6 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <div className="flex -space-x-2">
                            {project.technologies?.slice(0, 4).map((tech, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-[10px] text-slate-700 dark:text-zinc-300 font-bold" title={t(tech)}>
                                    {t(tech).charAt(0)}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                            {t('portfolio.params.view_case_study')} <FaArrowRight className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
