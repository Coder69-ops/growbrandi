import React from 'react';
import { Loader2 } from 'lucide-react';

interface AdminLoaderProps {
    message?: string;
}

export const AdminLoader: React.FC<AdminLoaderProps> = ({ message = 'Loading content...' }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-500">
            <div className="relative">
                {/* Ambient glow */}
                <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />

                {/* Glass container */}
                <div className="relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/20 dark:border-white/10 shadow-xl shadow-blue-500/10 ring-1 ring-black/5">
                    <Loader2 size={40} className="text-blue-600 dark:text-blue-400 animate-spin" strokeWidth={2.5} />
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200 animate-pulse">
                    {message}
                </p>
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce delay-0" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce delay-150" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce delay-300" />
                </div>
            </div>
        </div>
    );
};
