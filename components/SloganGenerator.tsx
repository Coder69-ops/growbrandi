import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaBolt, FaCopy } from 'react-icons/fa';
import { generateSlogan } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { useSiteContentData } from '../src/hooks/useSiteContent';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const SloganGenerator: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { getText, content } = useSiteContentData();
    const [keywords, setKeywords] = useState('');
    const [slogans, setSlogans] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const lang = i18n.language as any; // Cast to avoid type issues or import SupportedLanguage

    const handleGenerate = async () => {
        if (!keywords.trim()) {
            setError(t('slogan_generator.error_empty'));
            return;
        }
        setIsLoading(true);
        setError('');
        setSlogans([]);
        try {
            const result = await generateSlogan(keywords);
            setSlogans(result);
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.section
            className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-luxury-black transition-colors duration-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: "-100px" }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-luxury-black transition-colors duration-300" />

            {/* Dynamic Background Image */}
            {content?.tools?.slogan?.bg_image && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${content.tools.slogan.bg_image})` }}
                />
            )}
            {/* Overlay if bg image is present */}
            {content?.tools?.slogan?.bg_image && (
                <div className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm" />
            )}

            {/* Removed overlay gradient for dark luxury theme */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-5xl relative z-10">
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-2 mb-6">
                        <FaMagic className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {getText('tools.slogan.badge', lang) || t('slogan_generator.badge')}
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 px-4 sm:px-0 text-slate-900 dark:text-white">
                        {getText('tools.slogan.title', lang) || t('slogan_generator.title_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">{getText('tools.slogan.highlight', lang) || t('slogan_generator.title_highlight')}</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                        {getText('tools.slogan.description', lang) || t('slogan_generator.description')}
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl"
                >
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">
                                {t('slogan_generator.input_label')}
                            </label>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder={t('slogan_generator.input_placeholder')}
                                className="w-full bg-white dark:bg-zinc-800/50 border border-slate-300 dark:border-zinc-600 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                        </div>
                        <div className="flex items-end">
                            <motion.button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner />
                                        <span>{t('slogan_generator.generating')}</span>
                                    </>
                                ) : (
                                    <>
                                        <FaBolt className="w-5 h-5" />
                                        <span>{t('slogan_generator.generate_button')}</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6"
                        >
                            <p className="text-red-400 text-center">{error}</p>
                        </motion.div>
                    )}

                    {slogans.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <h3 className="text-2xl font-bold text-gradient text-center mb-6">
                                ✨ Your GrowBrandi-Generated Slogans
                            </h3>
                            <div className="grid gap-4">
                                {slogans.map((slogan, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group glass-effect p-6 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg text-slate-800 dark:text-white font-medium flex-1">
                                                "{slogan}"
                                            </p>
                                            <button className="opacity-0 group-hover:opacity-100 ml-4 p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-200">
                                                <FaCopy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default SloganGenerator;
