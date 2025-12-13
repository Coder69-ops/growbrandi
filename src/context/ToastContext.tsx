import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Send, Bell } from 'lucide-react';

interface ToastBase {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'notification';
}

interface StandardToast extends ToastBase {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationData extends ToastBase {
    type: 'notification';
    title: string;
    subtitle?: string;
    message: string;
    avatar?: string;
    role?: string;
    onReply?: (text: string) => Promise<void>;
    onClick?: () => void;
}

type Toast = StandardToast | NotificationData;

interface ToastContextType {
    showToast: (message: string, type?: StandardToast['type'], action?: StandardToast['action']) => void;
    showNotification: (data: Omit<NotificationData, 'id' | 'type'>) => void;
    showConfirm: (message: string, onConfirm: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

const ToastItem: React.FC<{ toast: Toast, removeToast: (id: string) => void }> = ({ toast, removeToast }) => {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation when replying
        if (!replyText.trim() || sending) return;

        if (toast.type === 'notification' && toast.onReply) {
            setSending(true);
            try {
                await toast.onReply(replyText);
                setReplyText('');
                // Don't remove immediately? User might want to see it sent?
                // Standard behavior: remove notification after reply.
                removeToast(toast.id);
            } catch (error) {
                console.error("Reply failed", error);
                setSending(false);
            }
        }
    };

    const handleClick = () => {
        if (toast.type === 'notification' && toast.onClick) {
            toast.onClick();
            removeToast(toast.id);
        }
    };

    if (toast.type === 'notification') {
        return (
            <div
                onClick={handleClick}
                className={`w-full max-w-md bg-white dark:bg-[#0f172a] border border-indigo-100 dark:border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden pointer-events-auto animate-in slide-in-from-top-5 fade-in duration-300 ring-1 ring-black/5 ${toast.onClick ? 'cursor-pointer hover:ring-indigo-500/30 transition-shadow' : ''}`}
            >
                {/* Header */}
                <div className="p-4 pb-3 flex items-start gap-3 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
                    <div className="relative shrink-0">
                        {toast.avatar ? (
                            <img src={toast.avatar} alt={toast.title} className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                {toast.title[0]?.toUpperCase()}
                            </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 border-2 border-white dark:border-slate-900">
                            <Bell size={8} className="text-white fill-current" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{toast.title}</h4>
                            {toast.role && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                                    {toast.role}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{toast.subtitle || 'New Message'}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-4 pb-3">
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/50">
                        {toast.message}
                    </p>
                </div>

                {/* Reply Footer */}
                {toast.onReply && (
                    <form onSubmit={handleReply} className="px-4 pb-4 flex gap-2" onClick={e => e.stopPropagation()}>
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Reply..."
                            className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!replyText.trim() || sending}
                            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20 active:scale-95"
                        >
                            <Send size={16} className={replyText.trim() ? "translate-x-0.5 transition-transform" : ""} />
                        </button>
                    </form>
                )}
            </div>
        );
    }

    // Standard Toast
    const getIcon = (type: StandardToast['type']) => {
        switch (type) {
            case 'success': return <CheckCircle className="flex-shrink-0" size={20} />;
            case 'error': return <AlertCircle className="flex-shrink-0" size={20} />;
            case 'warning': return <AlertTriangle className="flex-shrink-0" size={20} />;
            default: return <Info className="flex-shrink-0" size={20} />;
        }
    };

    const getColors = (type: StandardToast['type']) => {
        switch (type) {
            case 'success':
                return 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100';
            case 'error':
                return 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/40 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-100';
            case 'warning':
                return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-100';
            default:
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-blue-200 dark:border-blue-800/50 text-blue-900 dark:text-blue-100';
        }
    };

    return (
        <div
            className={`${getColors(toast.type)} border backdrop-blur-xl rounded-xl shadow-2xl p-4 flex items-start gap-3 pointer-events-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl animate-in slide-in-from-top-5 fade-in duration-500 w-full max-w-md`}
        >
            <div className="mt-0.5">
                {getIcon(toast.type)}
            </div>
            <div className="flex-1 text-sm font-medium leading-relaxed">
                {(toast as any).message}
            </div>
            {(toast as StandardToast).action ? (
                <div className="flex gap-2 items-center">
                    <button
                        onClick={(toast as StandardToast).action?.onClick}
                        className={`px-4 py-2 rounded-lg font-semibold text-xs shadow-md transition-all duration-200 hover:scale-105 active:scale-95 ${toast.type === 'warning'
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-current'
                            }`}
                    >
                        {(toast as StandardToast).action?.label}
                    </button>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => removeToast(toast.id)}
                    className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: StandardToast['type'] = 'info', action?: StandardToast['action']) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: StandardToast = { id, message, type, action };
        setToasts(prev => [...prev, toast]);
        if (!action) setTimeout(() => removeToast(id), 5000);
    }, [removeToast]);

    const showNotification = useCallback((data: Omit<NotificationData, 'id' | 'type'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: NotificationData = { id, type: 'notification', ...data };
        setToasts(prev => [...prev, toast]);
        setTimeout(() => removeToast(id), 12000); // 12 seconds for rich notifications
    }, [removeToast]);

    const showConfirm = useCallback((message: string, onConfirm: () => void) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: StandardToast = {
            id,
            message,
            type: 'warning',
            action: {
                label: 'Confirm',
                onClick: () => {
                    onConfirm();
                    removeToast(id);
                }
            }
        };
        setToasts(prev => [...prev, toast]);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast, showConfirm, showNotification }}>
            {children}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-3 w-full max-w-md pointer-events-none items-center">
                {toasts.map(toast => (
                    <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
