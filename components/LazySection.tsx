import React, { useState, useEffect, useRef, Suspense } from 'react';

interface LazySectionProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const LazySection: React.FC<LazySectionProps> = ({ children, fallback = null }) => {
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
            { rootMargin: '300px' } // Load 300px before it comes into view
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref}>
            {isVisible ? (
                <Suspense fallback={fallback}>{children}</Suspense>
            ) : (
                fallback || <div className="min-h-[100px]" />
            )}
        </div>
    );
};

export default LazySection;
