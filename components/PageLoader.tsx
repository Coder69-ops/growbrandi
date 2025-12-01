import React from 'react';
import { motion } from 'framer-motion';

const PageLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-luxury-black/90 backdrop-blur-xl transition-all duration-500">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
            </div>

            <div className="relative flex flex-col items-center z-10">
                {/* Logo Container with Glow */}
                <motion.div
                    className="relative mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {/* Rotating Gradient Ring */}
                    <motion.div
                        className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-30 blur-md"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />

                    {/* Brand Logo */}
                    <div className="relative w-24 h-24 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                        <img
                            src="https://ik.imagekit.io/nltb2bcz4/growbrandi.png"
                            alt="GrowBrandi"
                            className="w-16 h-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                </motion.div>

                {/* Sophisticated Loading Bar */}
                <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            repeatDelay: 0.2
                        }}
                        style={{ width: '50%' }}
                    />
                </div>

                {/* Elegant Text */}
                <motion.div
                    className="mt-4 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="text-zinc-500 text-xs font-medium tracking-[0.2em] uppercase">Initializing</span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                        className="text-blue-400 text-xs"
                    >
                        ●
                    </motion.span>
                </motion.div>
            </div>
        </div>
    );
};

export default PageLoader;
