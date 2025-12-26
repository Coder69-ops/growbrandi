import React from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { BlockSettings } from '../../../types/pageBuilder';
import { getSectionClasses, getContainerClasses, getContentClasses, getCardClasses, getBackgroundEffects } from '../blockUtils';

interface CTABlockProps {
    content: {
        title?: string;
        description?: string;
        buttonText?: string;
        buttonLink?: string;
        backgroundImage?: string;
    };
    settings?: BlockSettings & {
        style?: 'default' | 'gradient' | 'minimal';
        buttonStyle?: 'primary' | 'gradient' | 'outline';
        showBadge?: boolean;
    };
}

export const CTABlock: React.FC<CTABlockProps> = ({ content, settings }) => {
    const buttonStyle = settings?.buttonStyle || 'primary';
    const showBadge = settings?.showBadge !== false;

    const buttonClasses = {
        primary: 'bg-slate-900 dark:bg-white text-white dark:text-black',
        gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
        outline: 'border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white bg-transparent'
    };

    return (
        <section className={getSectionClasses(settings)}>
            {/* Background Effects */}
            {getBackgroundEffects(settings, 'blue')}

            <div className="relative z-10">
                <div className={getContainerClasses(settings)}>
                    <div className={getContentClasses(settings)}>
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20" />

                            {/* Card */}
                            <div className={`relative ${getCardClasses(settings)} p-12 md:p-16 text-center shadow-2xl`}>
                                {/* Badge */}
                                {showBadge && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
                                        <Sparkles className="w-4 h-4" />
                                        Limited Time Offer
                                    </div>
                                )}

                                {/* Title */}
                                {content.title && (
                                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-['Outfit']">
                                        {content.title}
                                    </h2>
                                )}

                                {/* Description */}
                                {content.description && (
                                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-light">
                                        {content.description}
                                    </p>
                                )}

                                {/* CTA Button */}
                                {content.buttonText && (
                                    <a
                                        href={content.buttonLink || '#'}
                                        className={`inline-flex items-center gap-2 px-8 py-4 ${buttonClasses[buttonStyle]} rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300`}
                                    >
                                        <Zap className="w-5 h-5" />
                                        {content.buttonText}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
