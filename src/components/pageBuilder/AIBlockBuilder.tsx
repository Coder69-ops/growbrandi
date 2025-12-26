import React, { useState } from 'react';
import { X, Wand2, Sparkles, Loader } from 'lucide-react';

interface AIBlockBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onBlockCreated: (blockData: any) => void;
}

export const AIBlockBuilder: React.FC<AIBlockBuilderProps> = ({ isOpen, onClose, onBlockCreated }) => {
    const [description, setDescription] = useState('');
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!description.trim()) {
            setError('Please describe the block you want to create');
            return;
        }

        setGenerating(true);
        setError(null);

        try {
            // For now, create a simple text block from the description
            // TODO: Integrate with actual AI service when available
            const blockData = {
                type: 'text',
                label: 'Custom Block',
                content: {
                    en: {
                        content: `<p>${description}</p>`
                    }
                },
                settings: {}
            };

            // Return the block data to the parent
            onBlockCreated(blockData);
            setDescription('');
            onClose();
        } catch (err: any) {
            console.error('Error generating block:', err);
            setError(err.message || 'Failed to generate block. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-zinc-700 bg-gradient-to-r from-primary/10 to-accent/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
                                <Wand2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Block Builder</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Describe your block and let AI create it</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-lg transition"
                        >
                            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Description Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Describe the block you want to create
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Example: A pricing section with 3 tiers (Basic, Pro, Enterprise) for a SaaS product, each with bullet points of features and a call-to-action button"
                                rows={4}
                                className="w-full px-4 py-3 bg-white dark:bg-zinc-700 border border-slate-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white resize-none"
                                disabled={generating}
                            />
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                💡 Tip: Be specific about content, layout, and purpose for best results
                            </p>
                        </div>

                        {/* Examples */}
                        <div className="p-4 bg-slate-50 dark:bg-zinc-700/50 rounded-lg">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Example descriptions:
                            </p>
                            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 ml-6 list-disc">
                                <li>"A hero section for a fitness app with motivating headline and signup button"</li>
                                <li>"Features grid showing 4 benefits of our eco-friendly product"</li>
                                <li>"Testimonials carousel with 3 customer reviews including ratings"</li>
                                <li>"Call-to-action banner encouraging users to start a free trial"</li>
                            </ul>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button
                                onClick={onClose}
                                disabled={generating}
                                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-lg transition disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={generating || !description.trim()}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generating ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-4 h-4" />
                                        Generate Block
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
