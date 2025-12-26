import React from 'react';
import { Star, Quote } from 'lucide-react';
import { BlockSettings } from '../../../types/pageBuilder';
import { getSectionClasses, getContainerClasses, getContentClasses, getCardClasses, getBackgroundEffects } from '../blockUtils';

interface TestimonialItem {
    content: string;
    author: string;
    role: string;
    company?: string;
    image?: string;
    rating?: number;
}

interface TestimonialsBlockProps {
    content: {
        sectionTitle?: string;
        testimonials: TestimonialItem[];
    };
    settings?: BlockSettings & {
        columns?: 1 | 2 | 3;
        showRatings?: boolean;
        showImages?: boolean;
        cardStyle?: 'elevated' | 'flat' | 'bordered';
    };
}

export const TestimonialsBlock: React.FC<TestimonialsBlockProps> = ({ content, settings }) => {
    const columns = settings?.columns || 3;
    const showRatings = settings?.showRatings !== false;
    const showImages = settings?.showImages !== false;

    const gridColsMap = {
        1: 'grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3'
    };

    return (
        <section className={getSectionClasses(settings)}>
            {/* Background Effects */}
            {getBackgroundEffects(settings, 'green')}

            <div className="relative z-10">
                <div className={getContainerClasses(settings)}>
                    {/* Section Header */}
                    {content.sectionTitle && (
                        <div className={`${getContentClasses(settings)} mb-16`}>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-['Outfit']">
                                {content.sectionTitle}
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                        </div>
                    )}

                    {/* Testimonials Grid */}
                    <div className={`grid ${gridColsMap[columns]} gap-8`}>
                        {content.testimonials?.map((testimonial, index) => (
                            <div
                                key={index}
                                className={`relative ${getCardClasses(settings)} p-8 hover:shadow-2xl hover:border-slate-300/50 dark:hover:border-white/20 transition-all duration-300`}
                            >
                                {/* Quote Icon */}
                                <div className="absolute top-6 right-6 opacity-10">
                                    <Quote className="w-16 h-16 text-slate-900 dark:text-white" />
                                </div>

                                <div className="relative">
                                    {/* Rating */}
                                    {showRatings && testimonial.rating && (
                                        <div className="flex items-center gap-1 mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < testimonial.rating!
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-slate-300 dark:text-slate-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Content */}
                                    <p className="text-slate-700 dark:text-slate-300 mb-6 italic leading-relaxed font-light">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Author Info */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                                        {showImages && testimonial.image && (
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.author}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-white/20"
                                            />
                                        )}
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">
                                                {testimonial.author}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {testimonial.role}
                                                {testimonial.company && ` • ${testimonial.company}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
