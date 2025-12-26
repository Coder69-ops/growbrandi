import React from 'react';
import { Play, Star, Quote } from 'lucide-react';

interface VideoTestimonialBlockProps {
    content: {
        sectionTitle?: string;
        testimonials?: Array<{
            name: string;
            role?: string;
            company?: string;
            videoUrl?: string;
            thumbnail?: string;
            quote?: string;
            rating?: number;
        }>;
    };
    settings?: {
        columns?: number;
        showRating?: boolean;
    };
}

export const VideoTestimonialBlock: React.FC<VideoTestimonialBlockProps> = ({ content, settings }) => {
    const columns = settings?.columns || 3;
    const showRating = settings?.showRating !== false;

    return (
        <section className="relative py-20 overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay brightness-100 contrast-150" />
                <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="absolute bottom-[30%] right-[20%] w-[500px] h-[500px] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <div className="relative z-10 container mx-auto px-4">
                {/* Section Header */}
                {content.sectionTitle && (
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-['Outfit']">
                            {content.sectionTitle}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                    </div>
                )}

                {/* Testimonials Grid */}
                <div className={`grid md:grid-cols-${Math.min(columns, 3)} gap-8 max-w-7xl mx-auto`}>
                    {content.testimonials?.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200/50 dark:border-white/10 hover:border-slate-300/50 dark:hover:border-white/20"
                        >
                            {/* Video Thumbnail */}
                            {testimonial.videoUrl && (
                                <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                    {testimonial.thumbnail ? (
                                        <img
                                            src={testimonial.thumbnail}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                            <Play className="w-16 h-16 text-white opacity-50" />
                                        </div>
                                    )}

                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                        <a
                                            href={testimonial.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-16 h-16 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl"
                                        >
                                            <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">
                                {/* Quote */}
                                {testimonial.quote && (
                                    <div className="relative mb-6">
                                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-500/20" />
                                        <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed pl-4 font-light">
                                            "{testimonial.quote}"
                                        </p>
                                    </div>
                                )}

                                {/* Rating */}
                                {showRating && testimonial.rating && (
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

                                {/* Author Info */}
                                <div className="border-t border-slate-200 dark:border-white/10 pt-4">
                                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                                        {testimonial.name}
                                    </h4>
                                    {testimonial.role && (
                                        <p className="text-purple-600 dark:text-purple-400 font-medium">
                                            {testimonial.role}
                                        </p>
                                    )}
                                    {testimonial.company && (
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                                            {testimonial.company}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Decorative Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full transform translate-x-16 -translate-y-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
