import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Wand2, Loader2, AlertCircle } from 'lucide-react';

interface ContentGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (target: string, tone: string, context: string) => Promise<void>;
    isGenerating: boolean;
}

export const ContentGeneratorModal: React.FC<ContentGeneratorModalProps> = ({ isOpen, onClose, onGenerate, isGenerating }) => {
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState('Professional');
    const [context, setContext] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!isOpen || !mounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!targetAudience.trim()) {
            setError('Please describe your target audience.');
            return;
        }

        try {
            await onGenerate(targetAudience, tone, context);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to generate content. Please try again.');
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={!isGenerating ? onClose : undefined} />

            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Wand2 className="text-violet-500" size={20} />
                        Auto Generate Content
                    </h2>
                    {!isGenerating && (
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Target Audience / Goal
                            </label>
                            <textarea
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                placeholder="e.g. B2B SaaS Founders looking to scale revenue..."
                                className="w-full h-24 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-violet-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all"
                                disabled={isGenerating}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Tone of Voice
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Professional', 'Friendly', 'Persuasive', 'Minimalist'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setTone(t)}
                                        disabled={isGenerating}
                                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${tone === t
                                                ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/30'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Additional Context (Optional)
                            </label>
                            <textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="Key benefits to highlight, specific limitations to mention..."
                                className="w-full h-20 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-violet-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 resize-none transition-all"
                                disabled={isGenerating}
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isGenerating}
                            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            {isGenerating ? 'Generating...' : 'Generate Content'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
