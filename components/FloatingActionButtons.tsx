import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaComments } from 'react-icons/fa';

interface FloatingActionButtonsProps {
    onChatOpen: () => void;
    onContactOpen: () => void;
    isChatPreloaded: boolean;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
    onChatOpen,
    onContactOpen,
    isChatPreloaded,
}) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    const buttons = [
        {
            id: 'chat',
            label: isChatPreloaded ? 'AI Assistant Ready' : 'Loading AI...',
            icon: isChatPreloaded ? <FaRobot className="w-6 h-6" /> : <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />,
            onClick: onChatOpen,
            color: 'from-cyan-500 to-blue-600',
            ready: isChatPreloaded,
        },
        {
            id: 'contact',
            label: 'Smart Contact',
            icon: <FaComments className="w-5 h-5" />,
            onClick: onContactOpen,
            color: 'from-orange-500 to-red-600',
            ready: true,
        },
    ];

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col gap-3 md:gap-4 items-end">
            {buttons.map((btn, index) => (
                <div key={btn.id} className="relative flex items-center">
                    {/* Tooltip */}
                    <AnimatePresence>
                        {hoveredButton === btn.id && (
                            <motion.div
                                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                                className="absolute right-full mr-4 px-3 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white font-medium whitespace-nowrap shadow-xl"
                            >
                                {btn.label}
                                {/* Arrow */}
                                <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white/90 dark:bg-zinc-900/90 border-t border-r border-slate-200 dark:border-white/10 transform rotate-45 -translate-y-1/2" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Button */}
                    <motion.button
                        onClick={btn.onClick}
                        onMouseEnter={() => setHoveredButton(btn.id)}
                        onMouseLeave={() => setHoveredButton(null)}
                        aria-label={btn.label}
                        className={`
              relative group p-4 rounded-full shadow-lg backdrop-blur-md 
              border border-white/20 dark:border-white/10 overflow-hidden
              ${btn.id === 'chat' && !btn.ready ? 'cursor-wait' : 'cursor-pointer'}
            `}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {/* Gradient Background with Glass Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${btn.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                        {/* Icon */}
                        <div className="relative z-10 text-white drop-shadow-md">
                            {btn.icon}
                        </div>

                        {/* Status Indicator (for Chat) */}
                        {btn.id === 'chat' && btn.ready && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-400 border-2 border-cyan-600 rounded-full z-20" />
                        )}
                    </motion.button>
                </div>
            ))}
        </div>
    );
};

export default FloatingActionButtons;
