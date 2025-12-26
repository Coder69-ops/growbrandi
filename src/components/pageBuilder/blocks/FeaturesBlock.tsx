import React from 'react';
import { Check } from 'lucide-react';
import { BlockSettings } from '../../../types/pageBuilder';
import { getSectionClasses, getContainerClasses, getContentClasses, getCardClasses, getBackgroundEffects } from '../blockUtils';

interface FeatureItem {
    icon: string;
    title: string;
    description: string;
}

interface FeaturesBlockProps {
    content: {
        sectionTitle?: string;
        sectionDescription?: string;
        features: FeatureItem[];
    };
    settings?: BlockSettings & {
        columns?: 1 | 2 | 3 | 4;
        cardStyle?: 'glass' | 'solid' | 'outlined';
        iconSize?: 'sm' | 'md' | 'lg';
        showIcons?: boolean;
    };
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({ content, settings }) => {
    const columns = settings?.columns || 3;
    const cardStyle = settings?.cardStyle || 'glass';
    const iconSize = settings?.iconSize || 'md';
    const showIcons = settings?.showIcons !== false;

    const iconSizeMap = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-16 h-16'
    };

    const gridColsMap = {
        1: 'grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4'
    };

    return (
        <section className={getSectionClasses(settings)}>
            {/* Background Effects */}
            {getBackgroundEffects(settings, 'purple')}

            <div className="relative z-10">
                <div className={getContainerClasses(settings)}>
                    {/* Section Header */}
                    {(content.sectionTitle || content.sectionDescription) && (
                        <div className={`${getContentClasses(settings)} mb-16`}>
                            {content.sectionTitle && (
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-['Outfit']">
                                    {content.sectionTitle}
                                </h2>
                            )}
                            {content.sectionDescription && (
                                <p className="text-lg text-slate-600 dark:text-slate-400 font-light">
                                    {content.sectionDescription}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Features Grid */}
                    <div className={`grid ${gridColsMap[columns]} gap-8`}>
                        {content.features?.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative ${getCardClasses(settings)} p-8 hover:shadow-2xl hover:border-slate-300/50 dark:hover:border-white/20 transition-all duration-300`}
                            >
                                {/* Glow Effect on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl blur-xl transition-all duration-300" />

                                <div className="relative">
                                    {/* Icon */}
                                    {feature.icon && showIcons && (
                                        <div className="mb-6">
                                            <div className={`inline-flex items-center justify-center ${iconSizeMap[iconSize]} bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <span className="text-2xl">{feature.icon}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-['Outfit']">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
