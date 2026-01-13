import React, { useState, useEffect, useRef, Suspense } from 'react';

interface LazySectionProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    minHeight?: string; // Add minHeight prop to prevent CLS
    className?: string;
}

const LazySection: React.FC<LazySectionProps> = ({ children, fallback = null, minHeight = '100px', className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '600px' } // Load 600px before it comes into view
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={className} style={{ minHeight: !isVisible ? minHeight : undefined }}>
            {isVisible ? (
                children
            ) : (
                fallback || <div style={{ height: minHeight }} />
            )}
        </div>
    );
};

export default LazySection;
