import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { BlockSettings } from '../../../types/pageBuilder';
import { getSectionClasses, getContainerClasses, getContentClasses, getBackgroundEffects } from '../blockUtils';

interface HeroBlockProps {
    content: {
        title?: string;
        description?: string;
        ctaText?: string;
        ctaLink?: string;
        backgroundImage?: string;
        tagPill?: string;
    };
    settings?: BlockSettings & {
        style?: 'default' | 'centered' | 'split';
        titleSize?: 'sm' | 'md' | 'lg' | 'xl';
        showImage?: boolean;
    };
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ content, settings }) => {
    const style = settings?.style || 'default';
    const titleSize = settings?.titleSize || 'lg';

    const titleSizeMap = {
        sm: 'text-4xl sm:text-5xl lg:text-6xl',
        md: 'text-5xl sm:text-6xl lg:text-7xl',
        lg: 'text-6xl sm:text-7xl lg:text-8xl',
        xl: 'text-7xl sm:text-8xl lg:text-9xl'
    };

    return (
        <section className={getSectionClasses(settings)}>
            {/* Background Image (if provided) */}
            {content.backgroundImage && settings?.showImage !== false && (
                <>
                    <div
                        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                        style={{
                            backgroundImage: `url(${content.backgroundImage})`,
                            opacity: 1
                        }}
                    />
                    <div className="absolute inset-0 z-0 pointer-events-none bg-white/80 dark:bg-black/80 backdrop-blur-sm" />
                </>
            )}

            {/* Background Effects */}
            {getBackgroundEffects(settings, 'blue')}

            {/* Content */}
            <div className="relative z-10">
                <div className={getContainerClasses(settings)}>
                    <div className={`${getContentClasses(settings)} ${style === 'centered' ? 'text-center' : ''}`}>
                        {/* Tag Pill */}
                        {content.tagPill && (
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 w-fit mb-6 backdrop-blur-md ${style === 'centered' ? 'mx-auto' : ''
                                }`}>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 tracking-wide uppercase">
                                    {content.tagPill}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        {content.title && (
                            <h1 className={`${titleSizeMap[titleSize]} font-bold tracking-tight leading-[1.1] mb-6 font-['Outfit']`}>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">
                                    {content.title}
                                </span>
                            </h1>
                        )}

                        {/* Description */}
                        {content.description && (
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-10 font-light">
                                {content.description}
                            </p>
                        )}

                        {/* CTA Button */}
                        {content.ctaText && (
                            <div className={`flex items-center gap-4 ${style === 'centered' ? 'justify-center' : ''
                                }`}>
                                <a
                                    href={content.ctaLink || '#'}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-all"
                                >
                                    <Zap className="w-5 h-5 fill-white dark:fill-black" />
                                    {content.ctaText}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
