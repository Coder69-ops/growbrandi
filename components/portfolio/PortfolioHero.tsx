import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BackgroundEffects } from '../ui/BackgroundEffects';

export const PortfolioHero: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="relative pt-40 pb-32 px-4 bg-slate-50 dark:bg-black overflow-hidden selection:bg-blue-500/30 transition-colors duration-300">
            {/* Ambient Background */}
            <BackgroundEffects />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100/50 dark:bg-white/5 border border-blue-200 dark:border-white/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
                        {t('portfolio.hero.badge', 'Selected Works 2024')}
                    </span>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight font-heading leading-[1.1]">
                        {t('portfolio.hero.title_prefix', 'Digital')}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 animate-gradient-x">
                            {t('portfolio.hero.title_highlight', 'Excellence')}
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                        {t('portfolio.hero.description', "We don't just build websites; we craft digital empires. Explore a collection of our most impactful work.")}
                    </p>

                    {/* Stats / Trust Markers */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto border-t border-slate-200 dark:border-white/10 pt-12">
                        {[
                            { label: t('stats.revenue', 'Revenue Generated'), value: "$50M+" },
                            { label: t('stats.projects', 'Successful Projects'), value: "150+" },
                            { label: t('stats.retention', 'Client Retention'), value: "98%" },
                            { label: t('stats.awards', 'Awards Won'), value: "25+" },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                            >
                                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 font-heading">{stat.value}</div>
                                <div className="text-xs text-slate-500 dark:text-zinc-500 uppercase tracking-wider font-semibold">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
