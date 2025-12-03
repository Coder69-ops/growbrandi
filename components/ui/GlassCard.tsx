import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, ...props }) => {
    return (
        <motion.div
            className={`
                relative overflow-hidden
                bg-white/80 dark:bg-slate-900/60 
                backdrop-blur-md 
                border border-slate-200/50 dark:border-white/10 
                shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                rounded-2xl
                ${hoverEffect ? 'hover:shadow-2xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300' : ''}
                ${className}
            `}
            {...props}
        >
            {/* Inner Glow for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

            {children}
        </motion.div>
    );
};
