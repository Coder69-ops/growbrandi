import React, { useState, useEffect } from 'react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { Play, Square, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TimeTrackingWidget = () => {
    const { activeEntry, stopTimer, startTimer, loading } = useTimeTracking();
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        let interval: any;
        if (activeEntry && activeEntry.startTime) {
            interval = setInterval(() => {
                const start = activeEntry.startTime.toDate ? activeEntry.startTime.toDate() : new Date(activeEntry.startTime.seconds * 1000);
                const now = new Date();
                const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
                setElapsed(diff);
            }, 1000);
        } else {
            setElapsed(0);
        }
        return () => clearInterval(interval);
    }, [activeEntry]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {activeEntry ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-slate-900 border border-slate-700 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[300px]"
                    >
                        <div className="relative">
                            <span className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></span>
                            <div className="bg-blue-600 p-2.5 rounded-full relative z-10">
                                <Clock size={20} className="text-white animate-pulse" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="text-xs text-slate-400 font-medium mb-0.5">Current Session</p>
                            <h3 className="text-xl font-mono font-bold tracking-wider text-blue-400">
                                {formatTime(elapsed)}
                            </h3>
                            {activeEntry.description && (
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{activeEntry.description}</p>
                            )}
                        </div>

                        <button
                            onClick={() => stopTimer()}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-xl transition-colors group border border-red-500/20"
                            title="Stop Timer"
                        >
                            <Square size={18} className="fill-current" />
                        </button>
                    </motion.div>
                ) : (
                    <motion.button
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => startTimer(undefined, undefined, "General Work")}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-2 group"
                    >
                        <Play size={24} className="fill-current ml-1" />
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">
                            Start Timer
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};
