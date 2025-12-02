import React from 'react';
import { motion } from 'framer-motion';

const AILoader = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-xl transition-all duration-500 rounded-3xl">
        <div className="relative flex flex-col items-center z-10">
            <motion.div
                className="relative mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-30 blur-xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                <div className="relative w-32 h-32 bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                    <img
                        src="/growbrandi-logo.png"
                        alt="GrowBrandi"
                        className="w-20 h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />
                </div>
            </motion.div>

            <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden relative mb-4">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: '50%' }}
                />
            </div>

            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <span className="text-zinc-400 text-sm font-medium tracking-[0.2em] uppercase">Analyzing Data</span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-blue-400 text-sm"
                >
                    ●
                </motion.span>
            </motion.div>
        </div>
    </div>
);

export default AILoader;
