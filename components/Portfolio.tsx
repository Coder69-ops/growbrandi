import React from 'react';
import { useTranslation } from 'react-i18next';
import { PortfolioHero } from './portfolio/PortfolioHero';
import { FeaturedProjects } from './portfolio/FeaturedProjects';
import { GlassCard } from './ui/GlassCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

export const PortfolioPage: React.FC = () => {
    const { t } = useTranslation();
    const { getLocalizedPath } = useLocalizedPath();

    return (
        <>


            <main className="bg-slate-50 dark:bg-black min-h-screen transition-colors duration-300">
                <PortfolioHero />

                {/* Visual Divide / Trust Indicator Mockup */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                <FeaturedProjects />

                {/* CTA Section - Redesigned to be wider and more impactful */}
                <section className="py-32 px-4 relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
                    <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10 pointer-events-none" />
                    <div className="container mx-auto max-w-5xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h2 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight font-heading">
                                {t('portfolio.cta.title_prefix', 'Ready to scale')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">
                                    {t('portfolio.cta.title_highlight', 'your vision?')}
                                </span>
                            </h2>
                            <p className="text-slate-600 dark:text-zinc-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light">
                                {t('portfolio.cta.description', "Top brands trust us to build their digital presence. Join the elite circle of businesses we've transformed.")}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link to={getLocalizedPath('/contact')}>
                                    <button className="group relative px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-lg rounded-full hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20">
                                        {t('common.start_project', 'Start Your Project')}
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <button
                                    onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                                    className="px-10 py-5 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white font-bold text-lg rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                                >
                                    {t('common.chat_whatsapp', 'Chat on WhatsApp')}
                                </button>
                            </div>

                            {/* Trust Badge Row */}
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 opacity-80">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">{t('common.guarantee', '100% Satisfaction Guarantee')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">{t('common.secure_payments', 'Secure Payments')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">{t('common.support_247', '24/7 Support')}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default PortfolioPage;
