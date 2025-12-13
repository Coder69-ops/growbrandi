import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalType = 'success' | 'error';

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: ModalType;
    title: string;
    message: string;
    autoCloseDuration?: number; // Duration in ms
}

const StatusModalComponent: React.FC<StatusModalProps> = ({ isOpen, onClose, type, title, message, autoCloseDuration = 2000 }) => {
    // Auto-close effect for success messages
    useEffect(() => {
        if (isOpen && type === 'success') {
            const timer = setTimeout(() => {
                onClose();
            }, autoCloseDuration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, type, onClose, autoCloseDuration]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                            duration: 0.3
                        }}
                        className="relative w-full max-w-sm overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl shadow-2xl shadow-slate-500/10 dark:shadow-black/50"
                    >
                        {/* Progress Bar for Auto-close */}
                        {type === 'success' && (
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: autoCloseDuration / 1000, ease: "linear" }}
                                className="absolute top-0 left-0 h-1 bg-green-500/50 z-20"
                            />
                        )}

                        <div className="p-8 flex flex-col items-center text-center relative">
                            {/* Decorative Background */}
                            <div className={`absolute top-0 inset-x-0 h-32 opacity-10 bg-gradient-to-b ${type === 'success'
                                ? 'from-green-500 to-transparent'
                                : 'from-red-500 to-transparent'
                                } pointer-events-none`} />

                            {/* Icon Wrapper */}
                            <div className="relative mb-6">
                                {/* Pulse Effect */}
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0.5 }}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`absolute inset-0 rounded-full blur-xl ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                />
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                    className={`relative z-10 p-4 rounded-2xl ${type === 'success'
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 ring-1 ring-green-500/20'
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-1 ring-red-500/20'
                                        }`}
                                >
                                    {type === 'success' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                                </motion.div>
                            </div>

                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 mb-2">
                                    {title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-[260px] mx-auto">
                                    {message}
                                </p>
                            </motion.div>

                            {/* Action Button (Only for errors or if user wants to dismiss early) */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8 w-full"
                            >
                                <button
                                    onClick={onClose}
                                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all transform active:scale-95 ${type === 'success'
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                                        : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30'
                                        }`}
                                >
                                    {type === 'success' ? 'Dismiss' : 'Try Again'}
                                </button>
                            </motion.div>
                        </div>

                        {/* Close Button Top Right */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export const useStatusModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<{ type: ModalType; title: string; message: string }>({
        type: 'success',
        title: '',
        message: ''
    });

    const showSuccess = useCallback((title: string, message: string) => {
        setConfig({ type: 'success', title, message });
        setIsOpen(true);
    }, []);

    const showError = useCallback((title: string, message: string) => {
        setConfig({ type: 'error', title, message });
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const StatusModal = useCallback(() => (
        <StatusModalComponent
            isOpen={isOpen}
            onClose={close}
            type={config.type}
            title={config.title}
            message={config.message}
        />
    ), [isOpen, config, close]);

    return {
        showSuccess,
        showError,
        StatusModal
    };
};
