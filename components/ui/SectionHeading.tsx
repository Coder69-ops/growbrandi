import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeadingProps {
    badge: string;
    title: string;
    highlight: string;
    description?: string;
    align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ badge, title, highlight, description, align = 'center' }) => {
    return (
        <div className={`flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} mb-16 relative z-10`}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 w-fit mb-6 backdrop-blur-md"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tracking-wide uppercase">{badge}</span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 font-['Outfit'] text-slate-900 dark:text-white"
            >
                {title} <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
                    {highlight}
                </span>
            </motion.h2>

            {description && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light"
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
};
