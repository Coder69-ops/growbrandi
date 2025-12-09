import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminPageLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    showBack?: boolean;
    fullHeight?: boolean;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
    title,
    description,
    children,
    actions,
    showBack = false,
    fullHeight = false
}) => {
    const navigate = useNavigate();

    return (
        <div className={`mx-auto anime-fade-in relative z-10 ${fullHeight ? 'h-[calc(100vh-8rem)] flex flex-col' : 'space-y-8 max-w-7xl'}`}>
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800/60 flex-wrap ${fullHeight ? 'pb-6 shrink-0' : 'pb-8'}`}>
                <div className="flex items-start gap-5">
                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-1.5 p-2 rounded-xl bg-white dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-500 hover:text-indigo-600 transition-all shadow-sm border border-slate-200 dark:border-slate-700"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-light leading-relaxed max-w-2xl">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={`relative ${fullHeight ? 'flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50' : 'min-h-[600px]'}`}>
                {children}
            </div>
        </div>
    );
};
