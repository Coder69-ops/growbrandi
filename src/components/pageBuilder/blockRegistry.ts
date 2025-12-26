import React from 'react';
import {
    Rocket,
    Grid3x3,
    MessageSquare,
    Megaphone,
    FileText,
    Image as ImageIcon,
    Video,
    BarChart3,
    Users,
    Building2,
    HelpCircle,
    Mail,
    Briefcase,
    DollarSign,
    Space,
    Clock,
    TrendingDown,
    Shield,
    PlayCircle
} from 'lucide-react';
import { BlockRegistryItem, BlockType } from '../../types/pageBuilder';

// Import block components
import { HeroBlock } from './blocks/HeroBlock';
import { FeaturesBlock } from './blocks/FeaturesBlock';
import { TestimonialsBlock } from './blocks/TestimonialsBlock';
import { CTABlock, TextBlock, ImageBlock } from './blocks';
import { CountdownTimerBlock, PricingComparisonBlock, GuaranteeBlock, VideoTestimonialBlock } from './blocks';

// Simple placeholder components for blocks that don't have separate files yet
// These will be replaced with actual implementations later
const VideoBlock: React.FC<any> = () => null;
const StatsBlock: React.FC<any> = () => null;
const TeamBlock: React.FC<any> = () => null;
const LogosBlock: React.FC<any> = () => null;
const FAQBlock: React.FC<any> = () => null;
const FormBlock: React.FC<any> = () => null;
const ServicesBlock: React.FC<any> = () => null;
const PricingBlock: React.FC<any> = () => null;
const SpacerBlock: React.FC<any> = () => null;

export const BLOCK_REGISTRY: Record<BlockType, BlockRegistryItem> = {
    hero: {
        component: HeroBlock,
        icon: Rocket,
        label: 'Hero Section',
        category: 'Layout',
        description: 'Large hero banner with title, description, and CTA',
        defaultContent: {
            en: {
                title: 'Welcome to Your Business',
                description: 'Transform your digital presence with our expert solutions',
                ctaText: 'Get Started',
                ctaLink: '#contact'
            }
        },
        defaultSettings: {
            variant: 'centered',
            showBackground: true
        }
    },

    features: {
        component: FeaturesBlock,
        icon: Grid3x3,
        label: 'Features Grid',
        category: 'Content',
        description: 'Grid of features with icons and descriptions',
        defaultContent: {
            en: {
                sectionTitle: 'What We Offer',
                sectionDescription: 'Comprehensive solutions for your business',
                features: [
                    {
                        icon: 'Zap',
                        title: 'Fast Performance',
                        description: 'Lightning-fast load times and smooth interactions'
                    },
                    {
                        icon: 'Shield',
                        title: 'Secure & Reliable',
                        description: 'Enterprise-grade security for your peace of mind'
                    },
                    {
                        icon: 'Sparkles',
                        title: 'Beautiful Design',
                        description: 'Stunning interfaces that users love'
                    }
                ]
            }
        },
        defaultSettings: {
            columns: 3,
            variant: 'cards'
        }
    },

    testimonials: {
        component: TestimonialsBlock,
        icon: MessageSquare,
        label: 'Testimonials',
        category: 'Content',
        description: 'Customer testimonials and reviews',
        defaultContent: {
            en: {
                sectionTitle: 'What Our Clients Say',
                testimonials: [
                    {
                        content: 'Working with this team transformed our business. Highly recommended!',
                        author: 'John Doe',
                        role: 'CEO',
                        company: 'Tech Corp',
                        rating: 5
                    }
                ]
            }
        },
        defaultSettings: {
            variant: 'carousel',
            showRatings: true
        }
    },

    cta: {
        component: CTABlock,
        icon: Megaphone,
        label: 'Call to Action',
        category: 'Layout',
        description: 'Prominent call-to-action section',
        defaultContent: {
            en: {
                title: 'Ready to Get Started?',
                description: 'Join thousands of satisfied customers today',
                buttonText: 'Start Your Journey',
                buttonLink: '#contact'
            }
        },
        defaultSettings: {
            variant: 'centered',
            showBackground: true
        }
    },

    text: {
        component: TextBlock,
        icon: FileText,
        label: 'Text Content',
        category: 'Content',
        description: 'Rich text content area',
        defaultContent: {
            en: {
                content: '<p>Add your content here. Supports <strong>rich text formatting</strong>.</p>'
            }
        },
        defaultSettings: {
            align: 'left',
            maxWidth: '4xl'
        }
    },

    image: {
        component: ImageBlock,
        icon: ImageIcon,
        label: 'Image',
        category: 'Media',
        description: 'Single image with caption',
        defaultContent: {
            en: {
                url: '',
                alt: 'Image description',
                caption: 'Image caption'
            }
        },
        defaultSettings: {
            size: 'large',
            rounded: true
        }
    },

    video: {
        component: VideoBlock,
        icon: Video,
        label: 'Video',
        category: 'Media',
        description: 'Embedded video player',
        defaultContent: {
            en: {
                url: '',
                title: 'Video Title',
                description: 'Video description'
            }
        },
        defaultSettings: {
            autoplay: false,
            controls: true
        }
    },

    stats: {
        component: StatsBlock,
        icon: BarChart3,
        label: 'Statistics',
        category: 'Business',
        description: 'Key business metrics and stats',
        defaultContent: {
            en: {
                sectionTitle: 'Our Impact',
                stats: [
                    { value: '500+', label: 'Projects Completed', icon: 'Briefcase' },
                    { value: '98%', label: 'Client Satisfaction', icon: 'Star' },
                    { value: '10+', label: 'Years Experience', icon: 'Award' }
                ]
            }
        },
        defaultSettings: {
            variant: 'grid',
            columns: 3
        }
    },

    team: {
        component: TeamBlock,
        icon: Users,
        label: 'Team Members',
        category: 'Content',
        description: 'Team member profiles',
        defaultContent: {
            en: {
                sectionTitle: 'Meet Our Team',
                sectionDescription: 'The people behind our success',
                members: [
                    {
                        name: 'Jane Smith',
                        role: 'CEO & Founder',
                        bio: 'Leading with passion and innovation'
                    }
                ]
            }
        },
        defaultSettings: {
            columns: 3,
            showSocial: true
        }
    },

    logos: {
        component: LogosBlock,
        icon: Building2,
        label: 'Logo Cloud',
        category: 'Business',
        description: 'Partner and client logos',
        defaultContent: {
            en: {
                sectionTitle: 'Trusted By Industry Leaders',
                logos: []
            }
        },
        defaultSettings: {
            variant: 'grid',
            grayscale: true
        }
    },

    faq: {
        component: FAQBlock,
        icon: HelpCircle,
        label: 'FAQ',
        category: 'Content',
        description: 'Frequently asked questions',
        defaultContent: {
            en: {
                sectionTitle: 'Frequently Asked Questions',
                faqs: [
                    {
                        question: 'What is your refund policy?',
                        answer: 'We offer a 30-day money-back guarantee on all services.'
                    }
                ]
            }
        },
        defaultSettings: {
            variant: 'accordion',
            defaultExpanded: false
        }
    },

    form: {
        component: FormBlock,
        icon: Mail,
        label: 'Contact Form',
        category: 'Forms',
        description: 'Customizable contact form',
        defaultContent: {
            en: {
                title: 'Get In Touch',
                description: 'Fill out the form below and we\'ll get back to you',
                fields: [
                    { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
                    { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
                    { type: 'textarea', label: 'Message', placeholder: 'Your message', required: true }
                ],
                submitButtonText: 'Send Message',
                successMessage: 'Thanks! We\'ll be in touch soon.'
            }
        },
        defaultSettings: {
            submitTo: 'contact@growbrandi.com'
        }
    },

    services: {
        component: ServicesBlock,
        icon: Briefcase,
        label: 'Services',
        category: 'Business',
        description: 'Service offerings display',
        defaultContent: {
            en: {
                sectionTitle: 'Our Services',
                sectionDescription: 'Comprehensive solutions tailored to your needs',
                services: [
                    {
                        icon: 'Rocket',
                        title: 'Service Name',
                        description: 'Service description goes here',
                        price: 'Starting at $999'
                    }
                ]
            }
        },
        defaultSettings: {
            columns: 3,
            showPricing: true
        }
    },

    pricing: {
        component: PricingBlock,
        icon: DollarSign,
        label: 'Pricing Tables',
        category: 'Business',
        description: 'Pricing tiers and plans',
        defaultContent: {
            en: {
                sectionTitle: 'Simple, Transparent Pricing',
                sectionDescription: 'Choose the plan that fits your needs',
                tiers: [
                    {
                        name: 'Starter',
                        price: '$49',
                        period: '/month',
                        description: 'Perfect for small businesses',
                        features: ['Feature 1', 'Feature 2', 'Feature 3'],
                        ctaText: 'Get Started',
                        ctaLink: '#contact'
                    }
                ]
            }
        },
        defaultSettings: {
            variant: 'cards',
            billingToggle: false
        }
    },

    spacer: {
        component: SpacerBlock,
        icon: Space,
        label: 'Spacer',
        category: 'Utility',
        description: 'Vertical spacing between blocks',
        defaultContent: {
            en: {
                height: 80
            }
        },
        defaultSettings: {}
    },

    // Promotional Blocks
    countdownTimer: {
        component: CountdownTimerBlock,
        icon: Clock,
        label: 'Countdown Timer',
        category: 'Business',
        description: 'Urgency countdown timer for limited offers',
        defaultContent: {
            en: {
                title: 'Limited Time Offer!',
                subtitle: 'Hurry! This deal ends soon',
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                urgencyText: 'Don\'t Miss Out!'
            }
        },
        defaultSettings: {
            style: 'modern',
            showDays: true
        }
    },

    pricingComparison: {
        component: PricingComparisonBlock,
        icon: TrendingDown,
        label: 'Pricing Comparison',
        category: 'Business',
        description: 'Show regular vs sale price with savings',
        defaultContent: {
            en: {
                title: 'Special Offer Price',
                subtitle: 'Limited time savings on our premium service',
                regularPrice: 997,
                salePrice: 497,
                currency: '$',
                badge: 'SPECIAL OFFER',
                features: [
                    'Full access to all features',
                    'Priority customer support',
                    '30-day money-back guarantee',
                    'Free lifetime updates'
                ],
                ctaText: 'Claim Your Discount',
                ctaLink: '#order'
            }
        },
        defaultSettings: {
            showSavings: true,
            highlightDeal: true
        }
    },

    guarantee: {
        component: GuaranteeBlock,
        icon: Shield,
        label: 'Money-Back Guarantee',
        category: 'Business',
        description: 'Build trust with guarantee section',
        defaultContent: {
            en: {
                title: '100% Money-Back Guarantee',
                subtitle: 'Try risk-free for 30 days',
                guaranteeText: 'If you\'re not completely satisfied with your purchase, simply let us know within 30 days and we\'ll give you a full refund—no questions asked.',
                badgeText: '30-Day Guarantee',
                features: [
                    'No risk trial period',
                    'Easy refund process',
                    'Keep all bonuses',
                    'Cancel anytime'
                ]
            }
        },
        defaultSettings: {
            style: 'shield',
            showIcon: true
        }
    },

    videoTestimonial: {
        component: VideoTestimonialBlock,
        icon: PlayCircle,
        label: 'Video Testimonials',
        category: 'Content',
        description: 'Showcase customer video testimonials',
        defaultContent: {
            en: {
                sectionTitle: 'What Our Customers Say',
                testimonials: [
                    {
                        name: 'Sarah Johnson',
                        role: 'Marketing Director',
                        company: 'Tech Solutions Inc.',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        thumbnail: '',
                        quote: 'This product completely transformed our business. Highly recommended!',
                        rating: 5
                    },
                    {
                        name: 'Michael Chen',
                        role: 'CEO',
                        company: 'Growth Ventures',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        thumbnail: '',
                        quote: 'The results speak for themselves. Amazing value!',
                        rating: 5
                    }
                ]
            }
        },
        defaultSettings: {
            columns: 2,
            showRating: true
        }
    }
};

// Helper function to get block info
export const getBlockInfo = (type: BlockType): BlockRegistryItem => {
    return BLOCK_REGISTRY[type];
};

// Helper to get all blocks by category
export const getBlocksByCategory = () => {
    const categories: Record<string, Array<{ type: BlockType; info: BlockRegistryItem }>> = {};

    (Object.keys(BLOCK_REGISTRY) as BlockType[]).forEach(type => {
        const info = BLOCK_REGISTRY[type];
        if (!categories[info.category]) {
            categories[info.category] = [];
        }
        categories[info.category].push({ type, info });
    });

    return categories;
};
