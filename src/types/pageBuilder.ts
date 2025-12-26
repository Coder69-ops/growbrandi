import { Timestamp } from 'firebase/firestore';

// Multi-language content type
export type MultiLangContent = {
    en: string;
    es?: string;
    fr?: string;
    de?: string;
};

// Page status
export type PageStatus = 'draft' | 'published';

// Block types
export type BlockType =
    | 'hero'
    | 'features'
    | 'testimonials'
    | 'cta'
    | 'text'
    | 'image'
    | 'video'
    | 'stats'
    | 'team'
    | 'logos'
    | 'faq'
    | 'form'
    | 'services'
    | 'pricing'
    | 'spacer'
    | 'countdownTimer'
    | 'pricingComparison'
    | 'guarantee'
    | 'videoTestimonial';

// SEO Metadata
export interface PageSEO {
    title: MultiLangContent;
    description: MultiLangContent;
    keywords: string[];
    ogImage?: string;
    noIndex?: boolean;
}

// Common block settings that all blocks can use
export interface CommonBlockSettings {
    // Layout & Positioning
    textAlign?: 'left' | 'center' | 'right';
    contentAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'center' | 'bottom';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';

    // Spacing
    paddingTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    marginTop?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    marginBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

    // Styling
    backgroundColor?: string; // Tailwind class or custom color
    backgroundGradient?: 'none' | 'blue' | 'purple' | 'green' | 'red' | 'custom';
    borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
    showBorder?: boolean;
    borderColor?: string;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

    // Animation
    animateOnScroll?: boolean;
    animationType?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom' | 'none';

    // Effects
    showBackgroundOrbs?: boolean;
    showNoiseTexture?: boolean;
    customClass?: string;
}

// Generic block settings structure
export interface BlockSettings extends Partial<CommonBlockSettings> {
    [key: string]: any;
}

// Generic block content structure
export interface BlockContent {
    en: any;
    es?: any;
    fr?: any;
    de?: any;
}

// Page Block
export interface PageBlock {
    id: string;
    type: BlockType;
    order: number;
    enabled: boolean;
    settings: BlockSettings;
    content: BlockContent;
}

// Page Settings
export interface PageSettings {
    showHeader: boolean;
    showFooter: boolean;
    showBreadcrumbs: boolean;
    customCSS?: string;
}

// Custom Page Document
export interface CustomPage {
    id: string;
    slug: string;
    title: MultiLangContent;
    status: PageStatus;
    seo: PageSEO;
    blocks: PageBlock[];
    settings: PageSettings;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
    lastEditedBy: string;
}

// Specific block content types

export interface HeroBlockContent {
    title: string;
    description: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage?: string;
    tagPill?: string;
}

export interface FeatureItem {
    icon: string;
    title: string;
    description: string;
}

export interface FeaturesBlockContent {
    sectionTitle?: string;
    sectionDescription?: string;
    features: FeatureItem[];
}

export interface TestimonialItem {
    content: string;
    author: string;
    role: string;
    company?: string;
    image?: string;
    rating?: number;
}

export interface TestimonialsBlockContent {
    sectionTitle?: string;
    testimonials: TestimonialItem[];
}

export interface CTABlockContent {
    title: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage?: string;
}

export interface TextBlockContent {
    content: string; // Rich text/HTML
}

export interface ImageBlockContent {
    url: string;
    alt: string;
    caption?: string;
}

export interface VideoBlockContent {
    url: string;
    thumbnailUrl?: string;
    title?: string;
    description?: string;
}

export interface StatItem {
    value: string;
    label: string;
    icon?: string;
}

export interface StatsBlockContent {
    sectionTitle?: string;
    stats: StatItem[];
}

export interface TeamMemberItem {
    name: string;
    role: string;
    image?: string;
    bio?: string;
    social?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
}

export interface TeamBlockContent {
    sectionTitle?: string;
    sectionDescription?: string;
    members: TeamMemberItem[];
}

export interface LogosBlockContent {
    sectionTitle?: string;
    logos: Array<{
        url: string;
        alt: string;
        link?: string;
    }>;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQBlockContent {
    sectionTitle?: string;
    faqs: FAQItem[];
}

export interface FormBlockContent {
    title?: string;
    description?: string;
    fields: Array<{
        type: 'text' | 'email' | 'textarea' | 'select';
        label: string;
        placeholder?: string;
        required: boolean;
        options?: string[]; // For select fields
    }>;
    submitButtonText: string;
    successMessage?: string;
}

export interface ServiceItem {
    icon: string;
    title: string;
    description: string;
    price?: string;
    features?: string[];
}

export interface ServicesBlockContent {
    sectionTitle?: string;
    sectionDescription?: string;
    services: ServiceItem[];
}

export interface PricingTier {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
    ctaLink?: string;
}

export interface PricingBlockContent {
    sectionTitle?: string;
    sectionDescription?: string;
    tiers: PricingTier[];
}

export interface SpacerBlockContent {
    height: number; // in pixels
}

// Block registry item type
export interface BlockRegistryItem {
    component: React.ComponentType<any>;
    configComponent?: React.ComponentType<any>;
    icon: any; // Lucide icon component
    label: string;
    category: 'Layout' | 'Content' | 'Media' | 'Forms' | 'Business' | 'Utility';
    description?: string;
    defaultContent: any;
    defaultSettings?: BlockSettings;
}
