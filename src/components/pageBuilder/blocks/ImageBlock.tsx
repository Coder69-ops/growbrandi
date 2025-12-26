import React from 'react';
import { BlockSettings } from '../../../types/pageBuilder';
import { getSectionClasses, getContainerClasses, getContentClasses, getBackgroundEffects } from '../blockUtils';

interface ImageBlockProps {
    content: {
        url?: string;
        alt?: string;
        caption?: string;
    };
    settings?: BlockSettings & {
        size?: 'small' | 'medium' | 'large' | 'full';
        aspectRatio?: 'auto' | 'square' | 'video' | 'wide' | 'portrait';
        objectFit?: 'cover' | 'contain' | 'fill';
        showCaption?: boolean;
        enableZoom?: boolean;
    };
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ content, settings }) => {
    const size = settings?.size || 'large';
    const aspectRatio = settings?.aspectRatio || 'auto';
    const objectFit = settings?.objectFit || 'cover';
    const showCaption = settings?.showCaption !== false;
    const enableZoom = settings?.enableZoom !== false;

    const sizeClasses = {
        small: 'max-w-md',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
        full: 'max-w-full'
    };

    const aspectRatioClasses = {
        auto: '',
        square: 'aspect-square',
        video: 'aspect-video',
        wide: 'aspect-[21/9]',
        portrait: 'aspect-[3/4]'
    };

    const objectFitClasses = {
        cover: 'object-cover',
        contain: 'object-contain',
        fill: 'object-fill'
    };

    if (!content.url) {
        return (
            <section className={getSectionClasses(settings)}>
                <div className={getContainerClasses(settings)}>
                    <div className="max-w-4xl mx-auto text-center p-12 border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-lg">
                        <p className="text-slate-500 dark:text-slate-400">No image selected</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={getSectionClasses(settings)}>
            {/* Background Effects */}
            {getBackgroundEffects(settings)}

            <div className="relative z-10">
                <div className={getContainerClasses(settings)}>
                    <div className={getContentClasses(settings)}>
                        <div className={`${sizeClasses[size]}`}>
                            <div className="relative group">
                                {/* Glow Effect */}
                                {enableZoom && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                )}

                                {/* Image */}
                                <div className={aspectRatioClasses[aspectRatio]}>
                                    <img
                                        src={content.url}
                                        alt={content.alt || ''}
                                        className={`relative w-full h-full ${objectFitClasses[objectFit]} shadow-2xl rounded-2xl border border-slate-200 dark:border-white/10 transition-transform duration-300 ${enableZoom ? 'group-hover:scale-[1.02]' : ''
                                            }`}
                                    />
                                </div>

                                {/* Caption */}
                                {showCaption && content.caption && (
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-slate-600 dark:text-slate-400 italic font-light">
                                            {content.caption}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
