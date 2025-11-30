import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

const AIBusinessAdvisor: React.FC = () => {
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedGoal, setSelectedGoal] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [adSpend, setAdSpend] = useState('');
    const [showResults, setShowResults] = useState(false);

    const industries = [
        'E-commerce', 'SaaS', 'Healthcare', 'Education', 'Real Estate',
        'Finance', 'Restaurant', 'Fitness', 'Travel', 'Technology'
    ];

    const goals = [
        'Increase Revenue', 'Build Brand Awareness', 'Generate More Leads',
        'Improve Customer Experience', 'Expand Market Reach', 'Launch New Products',
        'Optimize Operations', 'Enhance Digital Presence'
    ];

    const adSpendRanges = [
        'Under $1,000/mo', '$1,000 - $5,000/mo', '$5,000 - $10,000/mo', '$10,000+/mo'
    ];

    const calculateHealthScore = () => {
        // Simulated score calculation based on inputs
        let baseScore = 60;
        if (websiteUrl) baseScore += 10;
        if (selectedIndustry) baseScore += 5;
        if (selectedGoal) baseScore += 5;
        if (adSpend === '$5,000 - $10,000/mo' || adSpend === '$10,000+/mo') baseScore += 15;
        else if (adSpend === '$1,000 - $5,000/mo') baseScore += 10;

        return Math.min(Math.floor(baseScore + Math.random() * 10), 98);
    };

    const getQuickInsight = () => {
        if (!selectedIndustry || !selectedGoal || !websiteUrl || !adSpend) return null;

        const score = calculateHealthScore();

        const tips = {
            'E-commerce': "E-commerce stores with this spend usually see 3x ROAS on TikTok.",
            'SaaS': "SaaS companies can reduce churn by 20% with automated onboarding flows.",
            'Real Estate': "Video tours increase qualified leads by 400% for real estate listings.",
            'default': "Optimizing your conversion funnel could increase revenue by 25% within 30 days."
        };

        const tip = tips[selectedIndustry as keyof typeof tips] || tips['default'];

        return {
            score,
            tip,
            summary: `Based on your goal to "${selectedGoal}", your digital health score indicates significant room for growth.`
        };
    };

    const handleAnalyze = () => {
        if (selectedIndustry && selectedGoal && websiteUrl && adSpend) {
            setShowResults(true);
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
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-4 sm:px-6 py-2 mb-6 mx-4 sm:mx-0">
                        <svg className="w-4 h-4 text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs sm:text-sm font-medium text-purple-400">GROWBRANDI BUSINESS INTELLIGENCE</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 px-4 sm:px-0">
                        Get Your Free <span className="text-gradient">Digital Health Audit</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
                        Unlock actionable insights to scale your business. Enter your details below to get a personalized growth score and expert recommendation.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
                    {/* Input Form */}
                    <motion.div
                        variants={itemVariants}
                        className="glass-effect rounded-3xl p-8 space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Business Details</h3>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Website URL</label>
                            <input
                                type="text"
                                placeholder="e.g., www.yourbusiness.com"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Industry</label>
                            <select
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                            >
                                <option value="">Select Industry</option>
                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Monthly Ad Spend</label>
                            <select
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={adSpend}
                                onChange={(e) => setAdSpend(e.target.value)}
                            >
                                <option value="">Select Range</option>
                                {adSpendRanges.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">Primary Goal</label>
                            <select
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={selectedGoal}
                                onChange={(e) => setSelectedGoal(e.target.value)}
                            >
                                <option value="">Select Goal</option>
                                {goals.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={!websiteUrl || !selectedIndustry || !adSpend || !selectedGoal}
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Analyze My Business
                        </button>
                    </motion.div>

                    {/* Results Display */}
                    <motion.div
                        variants={itemVariants}
                        className="glass-effect rounded-3xl p-8 h-full flex flex-col justify-center"
                    >
                        {!showResults ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Waiting for Input...</h3>
                                <p className="text-slate-400">Fill in your business details to generate your Digital Health Score.</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-8"
                            >
                                {(() => {
                                    const insight = getQuickInsight();
                                    if (!insight) return null;
                                    return (
                                        <>
                                            <div className="text-center">
                                                <div className="inline-block relative">
                                                    <svg className="w-40 h-40 transform -rotate-90">
                                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700" />
                                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * insight.score) / 100} className="text-emerald-400 transition-all duration-1000 ease-out" />
                                                    </svg>
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                                        <span className="text-4xl font-black text-white">{insight.score}</span>
                                                        <span className="block text-xs text-slate-400 uppercase tracking-wider">Score</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mt-4">Digital Health Score</h3>
                                            </div>

                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                                                <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Quick Win
                                                </h4>
                                                <p className="text-slate-200">{insight.tip}</p>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-slate-400 text-sm mb-4">Unlock your full 15-page audit report & strategy plan.</p>
                                                <a
                                                    href="https://wa.me/8801755154194?text=I%20want%20to%20book%20a%20strategy%20call%20to%20discuss%20my%20Digital%20Health%20Score%20of%20"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 w-full bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all"
                                                >
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                                    </svg>
                                                    Book Strategy Call to Unlock Report
                                                </a>
                                            </div>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Call to Action (Refactored) */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mt-16"
                >
                    <div className="glass-effect rounded-2xl p-8 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Need Immediate Assistance?
                        </h3>
                        <p className="text-slate-300 mb-6">
                            Connect with our team directly on WhatsApp for a quick consultation.
                        </p>
                        <a
                            href="https://wa.me/8801755154194"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            Chat on WhatsApp
                        </a>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default AIBusinessAdvisor;
