import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMagic, FaCalculator, FaChartLine, FaArrowRight, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { estimateProject, analyzeBusinessGrowth } from '../services/geminiService';
import AILoader from './AILoader';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';

interface ServiceAIWidgetProps {
    serviceTitle: string;
    compact?: boolean; // For use in modals or smaller spaces
}

const ServiceAIWidget: React.FC<ServiceAIWidgetProps> = ({ serviceTitle, compact = false }) => {
    const navigate = useNavigate();
    const { getLocalizedPath } = useLocalizedPath();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [step, setStep] = useState<'input' | 'result'>('input');

    // Determine widget type based on service title
    const isDevelopment = /Web|App|Development|Code|Software/i.test(serviceTitle);
    const isStrategy = /Strategy|Consulting|Brand|Growth|Marketing/i.test(serviceTitle);

    // Default to 'General' if neither
    const widgetType = isDevelopment ? 'estimator' : (isStrategy ? 'analyzer' : 'planner');

    // Form State
    const [input1, setInput1] = useState(''); // Project Type OR Industry
    const [input2, setInput2] = useState(''); // Budget OR Revenue
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');

    const handleAnalyze = async () => {
        if (!input1 || !input2) return;
        setLoading(true);

        try {
            let aiResult;
            if (widgetType === 'estimator') {
                aiResult = await estimateProject({
                    projectType: input1,
                    features: ['Standard Features'], // Simplified for quick quote
                    timeline: 'Flexible',
                    budget: input2,
                    industry: 'General',
                    serviceContext: serviceTitle
                });
            } else {
                aiResult = await analyzeBusinessGrowth({
                    currentRevenue: input2,
                    industry: input1,
                    marketPosition: 'Growing',
                    digitalPresence: 'Moderate',
                    competitorsLevel: 'Moderate',
                    serviceContext: serviceTitle
                });
            }
            setResult(aiResult);
            setStep('result');
        } catch (error) {
            console.error("AI Analysis failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProceed = () => {
        navigate(getLocalizedPath('/contact'), {
            state: {
                source: widgetType,
                data: result,
                service: serviceTitle,
                userInfo: {
                    name: clientName,
                    email: clientEmail
                },
                autoSend: false // Let them review the message
            }
        });
    };

    // Configuration based on type
    const config = {
        estimator: {
            title: "Get an Instant Quote",
            subtitle: " AI-powered estimation in seconds",
            icon: <FaCalculator className="w-5 h-5" />,
            input1Label: "What are you building?",
            input1Placeholder: "e.g. E-commerce Store, Portfolio...",
            input2Label: "Estimated Budget",
            input2Placeholder: "e.g. $1k-5k",
            buttonText: "Calculate Cost",
            resultTitle: "Estimated Cost",
            resultValue: result?.estimatedCost || "Calculating...",
            summary: result?.executiveSummary,
            negotiable: true
        },
        analyzer: {
            title: "Analyze Growth Potential",
            subtitle: "See how much you could grow",
            icon: <FaChartLine className="w-5 h-5" />,
            input1Label: "Your Industry",
            input1Placeholder: "e.g. Fashion, SaaS...",
            input2Label: "Current Monthly Revenue",
            input2Placeholder: "e.g. $10k",
            buttonText: "Analyze Potential",
            resultTitle: "Growth Potential",
            resultValue: result?.growthPotential || "Analyzing...",
            summary: result?.executiveSummary,
            negotiable: false
        },
        planner: {
            title: "Plan Your Success",
            subtitle: "Get a custom roadmap",
            icon: <FaMagic className="w-5 h-5" />,
            input1Label: "Business Type",
            input1Placeholder: "e.g. Startup, Agency...",
            input2Label: "Main Goal",
            input2Placeholder: "e.g. More Leads",
            buttonText: "Create Plan",
            resultTitle: "Recommended Strategy",
            resultValue: result?.consultationType || "Planning...",
            summary: result?.executiveSummary,
            negotiable: false
        }
    }[widgetType];

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl transition-colors duration-300 ${compact ? 'p-4 md:p-6' : 'p-4 md:p-8 lg:p-10'}`}>
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <AnimatePresence>
                {loading && <AILoader />}
            </AnimatePresence>

            <AnimatePresence mode='wait'>
                {step === 'input' ? (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="relative z-10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400">
                                {config.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{config.title}</h3>
                        </div>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm mb-6">{config.subtitle}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5">{config.input1Label}</label>
                                <input
                                    type="text"
                                    value={input1}
                                    onChange={(e) => setInput1(e.target.value)}
                                    placeholder={config.input1Placeholder}
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-1.5">{config.input2Label}</label>
                                <input
                                    type="text"
                                    value={input2}
                                    onChange={(e) => setInput2(e.target.value)}
                                    placeholder={config.input2Placeholder}
                                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
                                />
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !input1 || !input2}
                                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {config.buttonText} <FaArrowRight className="w-3 h-3" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 text-center flex flex-col items-center justify-center h-full"
                    >
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                            <FaCheckCircle className="w-5 h-5" />
                        </div>

                        <h3 className="text-slate-500 dark:text-zinc-400 text-xs uppercase tracking-widest font-bold mb-2">{config.resultTitle}</h3>

                        <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                            {config.resultValue}
                        </div>

                        {config.negotiable && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-bold mb-4 uppercase tracking-wide">
                                <FaMagic className="w-3 h-3" /> Flexible & Negotiable
                            </div>
                        )}

                        {config.summary && (
                            <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
                                {config.summary}
                            </p>
                        )}

                        <div className="w-full space-y-3 mb-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 text-sm"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 text-sm"
                            />
                        </div>

                        <div className="w-full space-y-3">
                            <button
                                onClick={handleProceed}
                                disabled={!clientName || !clientEmail}
                                className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3 sm:py-4 rounded-xl hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Discuss This Quote <FaArrowRight className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => setStep('input')}
                                className="text-slate-500 dark:text-zinc-500 text-xs sm:text-sm hover:text-slate-900 dark:hover:text-white transition-colors py-2"
                            >
                                Recalculate
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServiceAIWidget;
