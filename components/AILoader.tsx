import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AILoaderProps {
    /** Optional custom loading steps to cycle through. Defaults to generic AI steps. */
    steps?: string[];
    /** Duration in ms to show each step before cycling. Default 2000ms. */
    stepDuration?: number;
    /** Optional title override. Defaults to 'System Processing'. */
    title?: string;
    className?: string;
}

const DEFAULT_STEPS = [
    "Initializing Neural Net...",
    "Analyzing Data Patterns...",
    "Optimizing Parameters...",
    "Synthesizing Results...",
    "Finalizing Output..."
];

const AILoader: React.FC<AILoaderProps> = ({
    steps = DEFAULT_STEPS,
    stepDuration = 2000,
    title = "System Processing",
    className = ""
}) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % steps.length);
        }, stepDuration);
        return () => clearInterval(interval);
    }, [steps, stepDuration]);

    return (
        <div className={`absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-[#09090b]/90 backdrop-blur-xl transition-all duration-500 rounded-[2.5rem] overflow-hidden ${className}`}>
            {/* Background Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative flex flex-col items-center z-10 w-full max-w-sm px-8">
                {/* Central "Neural Core" Animation */}
                <div className="relative mb-12 w-32 h-32 flex items-center justify-center">
                    {/* Pulsing Glow */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-blue-500/30 rounded-full blur-2xl"
                    />

                    {/* Rotating Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-blue-500/20 border-t-blue-500/60"
                        style={{ padding: '4px' }}
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full border border-violet-500/20 border-b-violet-500/60"
                    />

                    {/* Floating Logo */}
                    <div className="relative z-10 w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 dark:border-white/5 backdrop-blur-xl">
                        <img
                            src="/growbrandi-logo.png"
                            alt="GrowBrandi"
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                </div>

                {/* Progress Bar "Data Stream" */}
                <div className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden relative mb-6">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/2"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Dynamic Text Status */}
                <div className="h-8 relative w-full flex justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute flex items-center flex-col"
                        >
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 dark:text-zinc-500 mb-1 block text-center">
                                {title}
                            </span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200 whitespace-nowrap">
                                {steps[currentStep]}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AILoader;
