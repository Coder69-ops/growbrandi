import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { BlockSettings } from '../../../types/pageBuilder';
import { getSectionClasses, getContainerClasses, getContentClasses, getCardClasses, getBackgroundEffects } from '../blockUtils';

interface CountdownTimerBlockProps {
    content: {
        title?: string;
        subtitle?: string;
        endDate?: string;
        urgencyText?: string;
    };
    settings?: BlockSettings & {
        timerSize?: 'sm' | 'md' | 'lg';
        showDays?: boolean;
        accentColor?: 'red' | 'orange' | 'blue' | 'purple';
    };
}

export const CountdownTimerBlock: React.FC<CountdownTimerBlockProps> = ({ content, settings }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const timerSize = settings?.timerSize || 'md';
    const showDays = settings?.showDays !== false;
    const accentColor = settings?.accentColor || 'red';

    const colorMap = {
        red: { gradient: 'from-red-600 to-orange-600', bg: 'from-red-500 to-orange-500' },
        orange: { gradient: 'from-orange-600 to-yellow-600', bg: 'from-orange-500 to-yellow-500' },
        blue: { gradient: 'from-blue-600 to-cyan-600', bg: 'from-blue-500 to-cyan-500' },
        purple: { gradient: 'from-purple-600 to-pink-600', bg: 'from-purple-500 to-pink-500' }
    };

    const sizeMap = {
        sm: { text: 'text-3xl md:text-4xl', box: 'p-3 md:p-4 min-w-[60px] md:min-w-[80px]' },
        md: { text: 'text-4xl md:text-5xl', box: 'p-4 md:p-6 min-w-[80px] md:min-w-[100px]' },
        lg: { text: 'text-5xl md:text-6xl', box: 'p-6 md:p-8 min-w-[100px] md:min-w-[120px]' }
    };

    useEffect(() => {
        if (!content.endDate) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(content.endDate!) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [content.endDate]);

    return (
        <section className={getSectionClasses(settings)}>
            {/* Background Effects */}
            {getBackgroundEffects(settings, accentColor)}

            <div className="relative z-10">
                <div className={getContainerClasses(settings)}>
                    <div className={`${getContentClasses(settings)} text-center`}>
                        {/* Icon */}
                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${colorMap[accentColor].bg} text-white rounded-full mb-4 animate-pulse shadow-lg`}>
                            <Zap className="w-8 h-8" />
                        </div>

                        {/* Title */}
                        {content.title && (
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 font-['Outfit']">
                                {content.title}
                            </h2>
                        )}

                        {/* Subtitle */}
                        {content.subtitle && (
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-light">
                                {content.subtitle}
                            </p>
                        )}

                        {/* Countdown */}
                        <div className="flex items-center justify-center gap-4 md:gap-6 mb-6">
                            {showDays && timeLeft.days > 0 && (
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r ${colorMap[accentColor].bg} rounded-2xl blur opacity-50`}></div>
                                        <div className={`relative bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl ${sizeMap[timerSize].box} shadow-xl border border-slate-200/50 dark:border-white/20`}>
                                            <span className={`${sizeMap[timerSize].text} font-bold bg-gradient-to-r ${colorMap[accentColor].gradient} bg-clip-text text-transparent`}>
                                                {timeLeft.days.toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2 uppercase tracking-wide">
                                        Days
                                    </span>
                                </div>
                            )}

                            {['hours', 'minutes', 'seconds'].map((unit) => (
                                <div key={unit} className="flex flex-col items-center">
                                    <div className="relative">
                                        <div className={`absolute inset-0 bg-gradient-to-r ${colorMap[accentColor].bg} rounded-2xl blur opacity-50`}></div>
                                        <div className={`relative bg-white/80 dark:bg-white/10 backdrop-blur-lg rounded-2xl ${sizeMap[timerSize].box} shadow-xl border border-slate-200/50 dark:border-white/20`}>
                                            <span className={`${sizeMap[timerSize].text} font-bold bg-gradient-to-r ${colorMap[accentColor].gradient} bg-clip-text text-transparent`}>
                                                {timeLeft[unit as keyof typeof timeLeft].toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2 uppercase tracking-wide">
                                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Urgency Text */}
                        {content.urgencyText && (
                            <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colorMap[accentColor].gradient} text-white rounded-full font-semibold shadow-lg animate-bounce`}>
                                <Clock className="w-5 h-5" />
                                {content.urgencyText}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
