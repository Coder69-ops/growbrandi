import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    variant?: 'default' | 'circle' | 'card';
}

const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'default', ...props }) => {
    // Base styles with shimmer gradient
    const baseStyles = "relative overflow-hidden bg-slate-200/80 dark:bg-zinc-800/80 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent dark:before:via-white/10 isolate";

    const variants = {
        default: "rounded-md",
        circle: "rounded-full",
        card: "rounded-xl",
    };

    return (
        <div
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        />
    );
};

export { Skeleton };
