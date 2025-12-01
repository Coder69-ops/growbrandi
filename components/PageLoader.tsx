import React from 'react';
import { motion } from 'framer-motion';

const PageLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                {/* Logo Container */}
                <motion.div
                    className="w-16 h-16 mb-4 relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Pulsing Rings */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-500/30"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    />

                    {/* Center Logo/Icon Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full shadow-lg shadow-emerald-500/20">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </motion.div>

                {/* Loading Text */}
                <motion.p
                    className="text-zinc-400 text-sm font-medium tracking-wider uppercase"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Loading
                </motion.p>
            </div>
        </div>
    );
};

export default PageLoader;
