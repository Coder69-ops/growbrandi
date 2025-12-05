import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminPageLayoutProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    showBack?: boolean;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
    title,
    description,
    children,
    actions,
    showBack = false
}) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 max-w-7xl mx-auto anime-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-start gap-4">
                    {showBack && (
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
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
            <div className="min-h-[600px]">
                {children}
            </div>
        </div>
    );
};
