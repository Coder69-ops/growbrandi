import React from 'react';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={`animate-pulse rounded-md bg-muted ${className}`}
            {...props}
        />
    );
};

export function SkeletonText({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`h-4 bg-gray-200 rounded ${className}`} {...props} />
    )
}

export function SkeletonCircle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`rounded-full bg-gray-200 ${className}`} {...props} />
    )
}

export default Skeleton;
