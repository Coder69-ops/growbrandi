import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateSlogan } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

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
    const [keywords, setKeywords] = useState('');
    const [slogans, setSlogans] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!keywords.trim()) {
            setError('Please enter some keywords.');
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
            className="py-24 px-4 relative overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: "-100px" }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-5xl relative z-10">
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-6 py-2 mb-6">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-emerald-400">GROWBRANDI SMART TOOL</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 px-4 sm:px-0">
                        Try Our <span className="text-gradient">AI Slogan Generator</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                        Experience the power of AI in action! Enter a few keywords about your business
                        and watch our intelligent system craft compelling slogans tailored to your brand.
                    </p>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl"
                >
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-300 mb-3">
                                Enter Keywords
                            </label>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="e.g., sustainable, innovative, coffee, community, growth"
                                className="w-full bg-slate-800/50 border border-slate-600 rounded-2xl px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                        </div>
                        <div className="flex items-end">
                            <motion.button
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-emerald-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3"
                                whileHover={{ scale: 1.02, y: -1 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner />
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <span>Generate Slogans</span>
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
                                        className="group glass-effect p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg text-white font-medium flex-1">
                                                "{slogan}"
                                            </p>
                                            <button className="opacity-0 group-hover:opacity-100 ml-4 p-2 rounded-lg hover:bg-emerald-500/20 transition-all duration-200">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
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
