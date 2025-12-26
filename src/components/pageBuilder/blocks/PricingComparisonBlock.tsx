import React from 'react';
import { TrendingDown, Check, Sparkles } from 'lucide-react';
import { BlockSettings } from '../../../types/pageBuilder';
import { getSectionClasses, getContainerClasses, getContentClasses, getCardClasses, getBackgroundEffects } from '../blockUtils';

interface PricingComparisonBlockProps {
    content: {
        title?: string;
        subtitle?: string;
        regularPrice?: number;
        salePrice?: number;
        currency?: string;
        savings?: string;
        features?: string[];
        ctaText?: string;
        ctaLink?: string;
        badge?: string;
    };
    settings?: BlockSettings & {
        showSavings?: boolean;
        highlightDeal?: boolean;
        layout?: 'horizontal' | 'vertical';
        priceSize?: 'sm' | 'md' | 'lg';
    };
}

export const PricingComparisonBlock: React.FC<PricingComparisonBlockProps> = ({ content, settings }) => {
    const currency = content.currency || '$';
    const regularPrice = content.regularPrice || 0;
    const salePrice = content.salePrice || 0;
    const savingsAmount = regularPrice - salePrice;
    const savingsPercent = regularPrice > 0 ? Math.round((savingsAmount / regularPrice) * 100) : 0;
    const showSavings = settings?.showSavings !== false;
    const layout = settings?.layout || 'horizontal';
    const priceSize = settings?.priceSize || 'md';

    const priceSizeMap = {
        sm: { regular: 'text-2xl md:text-3xl', sale: 'text-4xl md:text-5xl' },
        md: { regular: 'text-3xl md:text-4xl', sale: 'text-5xl md:text-6xl' },
        lg: { regular: 'text-4xl md:text-5xl', sale: 'text-6xl md:text-7xl' }
    };

    return (
        <section className={getSectionClasses(settings)}>
            {/* Background Effects */}            {getBackgroundEffects(settings, 'green')}

            <div className="relative z-10">
                <div className={getContainerClasses(settings)}>
                    <div className={getContentClasses(settings)}>
                        {/* Header */}
                        <div className="text-center mb-12">
                            {content.badge && (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
                                    <Sparkles className="w-4 h-4" />
                                    {content.badge}
                                </div>
                            )}

                            {content.title && (
                                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 font-['Outfit']">
                                    {content.title}
                                </h2>
                            )}

                            {content.subtitle && (
                                <p className="text-xl text-slate-600 dark:text-slate-400 font-light">
                                    {content.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Pricing Card */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

                            <div className={`relative ${getCardClasses(settings)} shadow-2xl overflow-hidden`}>
                                {/* Savings Badge */}
                                {showSavings && savingsPercent > 0 && (
                                    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-red-600 rounded-full blur opacity-50 animate-pulse"></div>
                                            <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-full shadow-xl">
                                                <div className="text-sm font-medium">SAVE</div>
                                                <div className="text-2xl font-bold">{savingsPercent}%</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8 md:p-12">
                                    {/* Price Comparison */}
                                    <div className={`flex items-center justify-center gap-6 mb-8 ${layout === 'vertical' ? 'flex-col' : ''}`}>
                                        <div className="text-center">
                                            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
                                                Regular Price
                                            </div>
                                            <div className="relative">
                                                <div className={`${priceSizeMap[priceSize].regular} font-bold text-slate-400 dark:text-slate-600`}>
                                                    {currency}{regularPrice.toLocaleString()}
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-full h-1 bg-red-600 transform -rotate-12"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <TrendingDown className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />

                                        <div className="text-center">
                                            <div className="text-sm text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wide font-semibold">
                                                Special Price
                                            </div>
                                            <div className={`${priceSizeMap[priceSize].sale} font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}>
                                                {currency}{salePrice.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Savings Amount */}
                                    {showSavings && savingsAmount > 0 && (
                                        <div className="text-center mb-8">
                                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                                <span className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                                                    You save {currency}{savingsAmount.toLocaleString()}!
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Features */}
                                    {content.features && content.features.length > 0 && (
                                        <div className="mb-8">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {content.features.map((feature, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mt-0.5">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="text-slate-700 dark:text-slate-300">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* CTA Button */}
                                    {content.ctaText && (
                                        <div className="text-center">
                                            <a
                                                href={content.ctaLink || '#'}
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                            >
                                                {content.ctaText}
                                                <Sparkles className="w-5 h-5" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
