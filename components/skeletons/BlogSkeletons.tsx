import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { GlassCard } from '../ui/GlassCard';

export const BlogPostSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            {/* Header Image Skeleton */}
            <div className="relative h-[60vh] bg-gradient-to-br from-slate-900 to-slate-800">
                <Skeleton className="absolute inset-0" />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 -mt-32 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Main Content Card */}
                    <GlassCard className="p-8 md:p-12 mb-8">
                        {/* Back Button */}
                        <Skeleton className="h-10 w-40 mb-6" />

                        {/* Category & Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>

                        {/* Title */}
                        <Skeleton className="h-12 w-full mb-4" />
                        <Skeleton className="h-12 w-3/4 mb-6" />

                        {/* Excerpt */}
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-5/6 mb-8" />

                        {/* Author Info */}
                        <div className="flex items-center gap-4 pb-8 border-b border-slate-200 dark:border-slate-700 mb-8">
                            <Skeleton variant="circle" className="h-12 w-12" />
                            <div className="flex-1">
                                <Skeleton className="h-5 w-32 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>

                        {/* Content Paragraphs */}
                        <div className="space-y-4 mb-8">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-10/12" />
                        </div>

                        <div className="space-y-4 mb-8">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-9/12" />
                        </div>

                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-8/12" />
                        </div>
                    </GlassCard>

                    {/* Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {/* Related Posts */}
                            <Skeleton className="h-8 w-48 mb-6" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <GlassCard key={i} className="p-4">
                                        <Skeleton variant="card" className="h-40 w-full mb-4" />
                                        <Skeleton className="h-5 w-3/4 mb-2" />
                                        <Skeleton className="h-4 w-full mb-1" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </GlassCard>
                                ))}
                            </div>
                        </div>

                        <div>
                            {/* Author Card */}
                            <GlassCard className="p-6 mb-6">
                                <Skeleton variant="circle" className="h-20 w-20 mx-auto mb-4" />
                                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                                <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-5/6" />
                            </GlassCard>

                            {/* CTA Card */}
                            <GlassCard className="p-6">
                                <Skeleton className="h-6 w-full mb-4" />
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-5/6 mb-6" />
                                <Skeleton className="h-12 w-full" />
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BlogPageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            {/* Hero Section */}
            <section className="pt-24 pb-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    {/* Section Heading */}
                    <div className="text-center mb-12">
                        <Skeleton className="h-4 w-24 mx-auto mb-4" />
                        <Skeleton className="h-12 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto mb-2" />
                        <Skeleton className="h-6 w-80 mx-auto" />
                    </div>

                    {/* Featured Post */}
                    <GlassCard className="relative overflow-hidden mb-12">
                        <div className="grid md:grid-cols-2 gap-0">
                            <Skeleton variant="card" className="h-96 md:h-full" />
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <Skeleton className="h-6 w-32 mb-4" />
                                <Skeleton className="h-10 w-full mb-2" />
                                <Skeleton className="h-10 w-3/4 mb-4" />
                                <Skeleton className="h-5 w-full mb-2" />
                                <Skeleton className="h-5 w-5/6 mb-6" />
                                <Skeleton className="h-10 w-40" />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <Skeleton className="h-12 flex-1" />
                        <Skeleton className="h-12 w-full md:w-48" />
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <GlassCard key={i} className="overflow-hidden">
                                <Skeleton variant="card" className="h-56 w-full" />
                                <div className="p-6">
                                    <Skeleton className="h-4 w-20 mb-4" />
                                    <Skeleton className="h-6 w-full mb-2" />
                                    <Skeleton className="h-6 w-4/5 mb-4" />
                                    <Skeleton className="h-4 w-full mb-1" />
                                    <Skeleton className="h-4 w-full mb-1" />
                                    <Skeleton className="h-4 w-3/4 mb-6" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Skeleton variant="circle" className="h-8 w-8" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
