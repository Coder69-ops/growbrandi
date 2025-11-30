import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartPie, FaHourglassHalf, FaLightbulb, FaWhatsapp } from 'react-icons/fa';

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
            className="py-24 px-4 relative overflow-hidden bg-luxury-black"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1, margin: "-100px" }}
            variants={containerVariants}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-luxury-black" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5" />
            <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 glass-effect rounded-full px-4 sm:px-6 py-2 mb-6 mx-4 sm:mx-0">
                        <FaChartPie className="w-4 h-4 text-purple-400 animate-pulse" />
                        <span className="text-xs sm:text-sm font-medium text-purple-400">GROWBRANDI BUSINESS INTELLIGENCE</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 px-4 sm:px-0">
                        Get Your Free <span className="text-gradient">Digital Health Audit</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
                        Unlock actionable insights to scale your business. Enter your details below to get a personalized growth score and expert recommendation.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
                    {/* Input Form */}
                    <motion.div
                        variants={itemVariants}
                        className="glass-effect rounded-3xl p-6 md:p-8 space-y-6"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">Business Details</h3>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Website URL</label>
                            <input
                                type="text"
                                placeholder="e.g., www.yourbusiness.com"
                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={websiteUrl}
                                onChange={(e) => setWebsiteUrl(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Industry</label>
                            <select
                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                            >
                                <option value="">Select Industry</option>
                                {industries.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Monthly Ad Spend</label>
                            <select
                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={adSpend}
                                onChange={(e) => setAdSpend(e.target.value)}
                            >
                                <option value="">Select Range</option>
                                {adSpendRanges.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-zinc-300 mb-2">Primary Goal</label>
                            <select
                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
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
                        className="glass-effect rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-center"
                    >
                        {!showResults ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <FaHourglassHalf className="w-10 h-10 text-zinc-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Waiting for Input...</h3>
                                <p className="text-zinc-400">Fill in your business details to generate your Digital Health Score.</p>
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
                                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-zinc-700" />
                                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * insight.score) / 100} className="text-emerald-400 transition-all duration-1000 ease-out" />
                                                    </svg>
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                                        <span className="text-4xl font-black text-white">{insight.score}</span>
                                                        <span className="block text-xs text-zinc-400 uppercase tracking-wider">Score</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mt-4">Digital Health Score</h3>
                                            </div>

                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                                                <h4 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                                                    <FaLightbulb className="w-5 h-5" />
                                                    Quick Win
                                                </h4>
                                                <p className="text-zinc-200">{insight.tip}</p>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-zinc-400 text-sm mb-4">Unlock your full 15-page audit report & strategy plan.</p>
                                                <a
                                                    href="https://wa.me/8801755154194?text=I%20want%20to%20book%20a%20strategy%20call%20to%20discuss%20my%20Digital%20Health%20Score%20of%20"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-green-700 transition-all"
                                                >
                                                    <FaWhatsapp className="w-6 h-6" />
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
                        <p className="text-zinc-300 mb-6">
                            Connect with our team directly on WhatsApp for a quick consultation.
                        </p>
                        <a
                            href="https://wa.me/8801755154194"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-green-700 transition-all"
                        >
                            <FaWhatsapp className="w-5 h-5" />
                            Chat on WhatsApp
                        </a>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default AIBusinessAdvisor;
