import React, { useState, useEffect } from 'react';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { Play, Square, Clock, Minimize2, Maximize2, MoreVertical, X } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const TimeTrackingWidget = () => {
    const { activeEntry, stopTimer, startTimer, loading } = useTimeTracking();
    const [elapsed, setElapsed] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [taskTitle, setTaskTitle] = useState('');

    useEffect(() => {
        let interval: any;
        if (activeEntry && activeEntry.startTime) {
            // Calculate initial diff
            const start = activeEntry.startTime.toDate ? activeEntry.startTime.toDate() : new Date(activeEntry.startTime.seconds * 1000);
            const now = new Date();
            const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
            setElapsed(diff);

            interval = setInterval(() => {
                const now = new Date();
                const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
                setElapsed(diff);
            }, 1000);
        } else {
            setElapsed(0);
        }
        return () => clearInterval(interval);
    }, [activeEntry]);

    // Sync Task Title
    useEffect(() => {
        if (activeEntry?.taskId) {
            const unsub = onSnapshot(doc(db, 'tasks', activeEntry.taskId), (doc) => {
                if (doc.exists()) {
                    setTaskTitle(doc.data().title);
                } else {
                    setTaskTitle(activeEntry.description || 'Unknown Task');
                }
            });
            return () => unsub();
        } else {
            setTaskTitle(activeEntry?.description || 'General Work');
        }
    }, [activeEntry?.taskId, activeEntry?.description]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return null;

    if (!activeEntry) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startTimer(undefined, undefined, "General Work")}
                    className="flex items-center gap-2 px-4 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all"
                >
                    <Play size={18} className="fill-current" />
                    <span className="font-medium pr-1">Start Timer</span>
                </motion.button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isMinimized ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="bg-slate-900 dark:bg-slate-800 text-white p-2 pr-4 rounded-full shadow-xl flex items-center gap-3 cursor-pointer border border-slate-700/50"
                        onClick={() => setIsMinimized(false)}
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center relative">
                            <Clock size={16} className="animate-pulse" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                        </div>
                        <span className="font-mono font-medium text-sm">{formatTime(elapsed)}</span>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-80"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse">
                                    <Clock size={16} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Tracking Time</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <Minimize2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1 truncate" title={taskTitle}>
                                {taskTitle}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {activeEntry.projectId ? 'Project Task' : 'No Project'} • {format(new Date(), 'MMM d, yyyy')}
                            </p>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-100 dark:border-slate-800">
                            <span className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                {formatTime(elapsed)}
                            </span>
                        </div>

                        <button
                            onClick={stopTimer}
                            className="w-full py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 group"
                        >
                            <Square size={16} className="fill-current group-hover:scale-110 transition-transform" />
                            Stop Timer
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
