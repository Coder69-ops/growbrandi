// Utility functions for block customization
import { CommonBlockSettings } from '../types/pageBuilder';

// Padding mappings
const paddingMap = {
    none: 'py-0',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
    '2xl': 'py-24'
};

const paddingTopMap = {
    none: 'pt-0',
    sm: 'pt-8',
    md: 'pt-12',
    lg: 'pt-16',
    xl: 'pt-20',
    '2xl': 'pt-24'
};

const paddingBottomMap = {
    none: 'pb-0',
    sm: 'pb-8',
    md: 'pb-12',
    lg: 'pb-16',
    xl: 'pb-20',
    '2xl': 'pb-24'
};

// Margin mappings
const marginTopMap = {
    none: 'mt-0',
    sm: 'mt-8',
    md: 'mt-12',
    lg: 'mt-16',
    xl: 'mt-20',
    '2xl': 'mt-24'
};

const marginBottomMap = {
    none: 'mb-0',
    sm: 'mb-8',
    md: 'mb-12',
    lg: 'mb-16',
    xl: 'mb-20',
    '2xl': 'mb-24'
};

// Max width mappings
const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
};

// Text alignment mappings
const textAlignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
};

// Border radius mappings
const borderRadiusMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full'
};

// Shadow mappings
const shadowMap = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
};

// Background gradient mappings
const gradientMap = {
    none: '',
    blue: 'bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-blue-500/20',
    purple: 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-purple-500/20',
    green: 'bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 dark:from-green-500/20 dark:via-emerald-500/20 dark:to-green-500/20',
    red: 'bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 dark:from-red-500/20 dark:via-orange-500/20 dark:to-red-500/20',
    custom: ''
};

/**
 * Generate section classes based on common block settings
 */
export const getSectionClasses = (settings?: CommonBlockSettings): string => {
    const classes: string[] = ['relative', 'overflow-hidden', 'bg-slate-50', 'dark:bg-[#09090b]', 'transition-colors', 'duration-300'];

    // Padding
    if (settings?.paddingTop) {
        classes.push(paddingTopMap[settings.paddingTop]);
    } else if (settings?.paddingBottom) {
        classes.push(paddingBottomMap[settings.paddingBottom]);
    } else {
        // Default padding
        classes.push('py-16');
    }

    // Margin
    if (settings?.marginTop) classes.push(marginTopMap[settings.marginTop]);
    if (settings?.marginBottom) classes.push(marginBottomMap[settings.marginBottom]);

    // Background color
    if (settings?.backgroundColor) {
        classes.push(settings.backgroundColor);
    }

    // Custom class
    if (settings?.customClass) {
        classes.push(settings.customClass);
    }

    return classes.join(' ');
};

/**
 * Generate container classes based on common block settings
 */
export const getContainerClasses = (settings?: CommonBlockSettings): string => {
    const classes: string[] = ['container', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8'];

    return classes.join(' ');
};

/**
 * Generate content wrapper classes
 */
export const getContentClasses = (settings?: CommonBlockSettings): string => {
    const classes: string[] = [];

    // Max width
    if (settings?.maxWidth) {
        classes.push(maxWidthMap[settings.maxWidth]);
    } else {
        classes.push('max-w-7xl');
    }

    // Text alignment
    if (settings?.textAlign) {
        classes.push(textAlignMap[settings.textAlign]);
    }

    // Content alignment
    if (settings?.contentAlign === 'center') {
        classes.push('mx-auto');
    } else if (settings?.contentAlign === 'right') {
        classes.push('ml-auto');
    }

    return classes.join(' ');
};

/**
 * Generate card classes
 */
export const getCardClasses = (settings?: CommonBlockSettings): string => {
    const classes: string[] = ['relative', 'bg-white/60', 'dark:bg-white/5', 'backdrop-blur-lg'];

    // Border radius
    if (settings?.borderRadius) {
        classes.push(borderRadiusMap[settings.borderRadius]);
    } else {
        classes.push('rounded-2xl');
    }

    // Shadow
    if (settings?.shadow) {
        classes.push(shadowMap[settings.shadow]);
    } else {
        classes.push('shadow-xl');
    }

    // Border
    if (settings?.showBorder !== false) {
        classes.push('border', settings?.borderColor || 'border-slate-200/50 dark:border-white/10');
    }

    return classes.join(' ');
};

/**
 * Generate background effects JSX
 */
export const getBackgroundEffects = (settings?: CommonBlockSettings, gradientColor?: string) => {
    const showOrbs = settings?.showBackgroundOrbs !== false;
    const showNoise = settings?.showNoiseTexture !== false;
    const gradient = settings?.backgroundGradient || gradientColor;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Noise Texture */}
            {showNoise && (
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay brightness-100 contrast-150" />
            )}

            {/* Gradient Overlay */}
            {gradient && gradient !== 'none' && (
                <div className={`absolute inset-0 ${gradientMap[gradient as keyof typeof gradientMap] || gradient}`} />
            )}

            {/* Gradient Orbs */}
            {showOrbs && (
                <>
                    <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                </>
            )}
        </div>
    );
};
