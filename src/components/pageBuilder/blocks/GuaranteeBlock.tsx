import React from 'react';
import { Shield, CheckCircle2, Award, RefreshCw } from 'lucide-react';

interface GuaranteeBlockProps {
    content: {
        title?: string;
        subtitle?: string;
        guaranteeText?: string;
        features?: string[];
        badgeText?: string;
    };
    settings?: {
        style?: 'shield' | 'badge' | 'seal';
        showIcon?: boolean;
    };
}

export const GuaranteeBlock: React.FC<GuaranteeBlockProps> = ({ content, settings }) => {
    const showIcon = settings?.showIcon !== false;

    return (
        <section className="relative py-16 overflow-hidden bg-slate-50 dark:bg-[#09090b] transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay brightness-100 contrast-150" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20" />
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Main Card */}
                    <div className="relative">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-10 animate-pulse"></div>

                        <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-blue-200 dark:border-blue-800/50">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                {/* Icon/Badge Side */}
                                <div className="flex justify-center">
                                    {showIcon && (
                                        <div className="relative">
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>

                                            {/* Shield */}
                                            <div className="relative w-48 h-48 flex items-center justify-center">
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-spin-slow opacity-20"></div>
                                                <div className="relative w-40 h-40 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                                                    <Shield className="w-24 h-24 text-white" strokeWidth={1.5} />
                                                </div>
                                            </div>

                                            {/* Badge Text */}
                                            {content.badgeText && (
                                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl whitespace-nowrap">
                                                    {content.badgeText}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Content Side */}
                                <div>
                                    {content.title && (
                                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-['Outfit']">
                                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                {content.title}
                                            </span>
                                        </h2>
                                    )}

                                    {content.subtitle && (
                                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 font-light">
                                            {content.subtitle}
                                        </p>
                                    )}

                                    {content.guaranteeText && (
                                        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800/50 mb-6">
                                            <p className="text-slate-700 dark:text-slate-300 font-medium text-lg leading-relaxed">
                                                {content.guaranteeText}
                                            </p>
                                        </div>
                                    )}

                                    {/* Features */}
                                    {content.features && content.features.length > 0 && (
                                        <div className="space-y-3">
                                            {content.features.map((feature, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Badge */}
                            <div className="mt-8 pt-8 border-t-2 border-blue-100 dark:border-blue-900/50">
                                <div className="flex flex-wrap items-center justify-center gap-6">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Award className="w-5 h-5 text-blue-600" />
                                        <span className="font-semibold">100% Risk-Free</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <RefreshCw className="w-5 h-5 text-purple-600" />
                                        <span className="font-semibold">Easy Returns</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        <span className="font-semibold">Secure & Trusted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
