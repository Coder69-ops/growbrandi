import { useLocation } from 'react-router-dom';

// Define the available routes with enhanced typing
export type Route =
    | 'home'
    | 'about'
    | 'process'
    | 'case-studies'
    | 'careers'
    | 'blog'
    | 'contact'
    | 'web-development'
    | 'ui-ux-design'
    | 'brand-growth'
    | 'social-media-content'
    | 'virtual-assistance'
    | 'customer-support'
    | 'privacy-policy'
    | 'terms-of-service'
    | 'cookie-policy'
    | 'services' // Services overview page
    | 'portfolio' // Portfolio overview
    | 'team'; // Team page

// Route categories for better organization
export const ROUTE_CATEGORIES = {
    MAIN: ['home', 'about', 'contact', 'services', 'portfolio', 'team'] as Route[],
    SERVICES: ['brand-growth', 'social-media-content', 'ui-ux-design', 'web-development', 'virtual-assistance', 'customer-support'] as Route[],
    COMPANY: ['about', 'process', 'careers', 'blog', 'team'] as Route[],
    LEGAL: ['privacy-policy', 'terms-of-service', 'cookie-policy'] as Route[],
} as const;

// Enhanced route configuration with SEO-friendly URLs, metadata, and breadcrumbs
export interface RouteMetadata {
    title: string;
    path: string;
    description?: string;
    keywords?: string[];
    category?: string;
    breadcrumb?: string[];
}

export const routeConfig: Record<Route, RouteMetadata> = {
    'home': {
        title: 'Home',
        path: '/',
        description: 'Growth Digital Agency - Transform your business with cutting-edge solutions',
        keywords: ['digital agency', 'AI solutions', 'web development', 'GrowBrandi'],
        category: 'main'
    },
    'about': {
        title: 'About Us',
        path: '/about',
        description: 'Learn about Growth Digital Agency - Our mission, vision, and the team behind your success',
        keywords: ['about Growth Digital Agency', 'digital agency team', 'company mission'],
        category: 'company',
        breadcrumb: ['Home', 'About']
    },
    'services': {
        title: 'Our Services',
        path: '/services',
        description: 'Comprehensive digital services including web development, design, SEO, and AI solutions',
        keywords: ['digital services', 'web development', 'SEO', 'design'],
        category: 'main'
    },
    'portfolio': {
        title: 'Portfolio',
        path: '/portfolio',
        description: 'Explore our successful projects and case studies across various industries',
        keywords: ['portfolio', 'case studies', 'projects', 'client work'],
        category: 'main'
    },
    'team': {
        title: 'Our Team',
        path: '/team',
        description: 'Meet the creative minds and experts behind GrowBrandi\'s success',
        keywords: ['team', 'experts', 'developers', 'designers'],
        category: 'company'
    },
    'process': {
        title: 'Our Process',
        path: '/process',
        description: 'Discover our proven methodology for delivering exceptional digital solutions',
        keywords: ['process', 'methodology', 'workflow', 'project management'],
        category: 'company',
        breadcrumb: ['Home', 'Process']
    },
    'case-studies': {
        title: 'Case Studies',
        path: '/case-studies',
        description: 'Real client success stories and project outcomes from GrowBrandi',
        keywords: ['case studies', 'success stories', 'client results', 'portfolio'],
        category: 'main',
        breadcrumb: ['Home', 'Case Studies']
    },
    'careers': {
        title: 'Careers',
        path: '/careers',
        description: 'Join our team of innovative professionals at GrowBrandi',
        keywords: ['careers', 'jobs', 'hiring', 'team opportunities'],
        category: 'company',
        breadcrumb: ['Home', 'Careers']
    },
    'blog': {
        title: 'Blog',
        path: '/blog',
        description: 'Insights, trends, and expertise from the GrowBrandi team',
        keywords: ['blog', 'insights', 'digital trends', 'expertise'],
        category: 'content',
        breadcrumb: ['Home', 'Blog']
    },
    'contact': {
        title: 'Contact Us',
        path: '/contact',
        description: 'Get in touch with GrowBrandi for your next digital project',
        keywords: ['contact', 'get in touch', 'consultation', 'project inquiry'],
        category: 'main'
    },
    'brand-growth': {
        title: 'Brand Growth Services',
        path: '/services/brand-growth',
        description: 'Accelerate your brand\'s growth with data-driven strategies and campaigns',
        keywords: ['brand growth', 'growth marketing', 'scaling', 'business strategy'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'Brand Growth']
    },
    'social-media-content': {
        title: 'Social Media Content',
        path: '/services/social-media-content',
        description: 'Engaging social media content creation and management',
        keywords: ['social media', 'content creation', 'instagram', 'tiktok', 'marketing'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'Social Media Content']
    },
    'ui-ux-design': {
        title: 'UI/UX Design Services',
        path: '/services/ui-ux-design',
        description: 'User-centered design solutions that drive engagement and conversions',
        keywords: ['UI design', 'UX design', 'user experience', 'interface design'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'UI/UX Design']
    },
    'web-development': {
        title: 'Web Development Services',
        path: '/services/web-development',
        description: 'Custom web development solutions using cutting-edge technologies',
        keywords: ['web development', 'custom websites', 'React', 'Node.js'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'Web Development']
    },
    'virtual-assistance': {
        title: 'Virtual Assistance',
        path: '/services/virtual-assistance',
        description: 'Professional virtual assistance to streamline your business operations',
        keywords: ['virtual assistant', 'admin support', 'business operations', 'remote help'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'Virtual Assistance']
    },
    'customer-support': {
        title: 'Customer Support Services',
        path: '/services/customer-support',
        description: 'Dedicated customer support teams to delight your users 24/7',
        keywords: ['customer support', 'help desk', 'customer service', 'support team'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'Customer Support']
    },
    'privacy-policy': {
        title: 'Privacy Policy',
        path: '/legal/privacy-policy',
        description: 'GrowBrandi privacy policy and data protection information',
        keywords: ['privacy policy', 'data protection', 'GDPR', 'privacy'],
        category: 'legal',
        breadcrumb: ['Home', 'Legal', 'Privacy Policy']
    },
    'terms-of-service': {
        title: 'Terms of Service',
        path: '/legal/terms-of-service',
        description: 'Terms and conditions for using GrowBrandi services',
        keywords: ['terms of service', 'terms and conditions', 'legal'],
        category: 'legal',
        breadcrumb: ['Home', 'Legal', 'Terms of Service']
    },
    'cookie-policy': {
        title: 'Cookie Policy',
        path: '/legal/cookie-policy',
        description: 'Information about how GrowBrandi uses cookies and tracking',
        keywords: ['cookie policy', 'cookies', 'tracking', 'privacy'],
        category: 'legal',
        breadcrumb: ['Home', 'Legal', 'Cookie Policy']
    },
};

// Helper functions for enhanced routing
export const getRoutesByCategory = (category: string): Route[] => {
    return Object.entries(routeConfig)
        .filter(([_, config]) => config.category === category)
        .map(([route]) => route as Route);
};

export const isValidRoute = (route: string): route is Route => {
    return route in routeConfig;
};

export const getRouteMetadata = (route: Route, pathname?: string) => {
    const baseMetadata = routeConfig[route] || routeConfig.home;

    // Handle dynamic team member routes - Static data removed, falling back to generic metadata
    // TODO: Implement async metadata fetching for dynamic routes
    if (route === 'team' && pathname && pathname.startsWith('/team/')) {
        return {
            ...baseMetadata,
            // Fallback for dynamic routes until async fetching is implemented
            title: 'Team Member Profile',
            path: pathname
        };
    }

    return baseMetadata;
};

// Convert URL path to route
export const getRouteFromPath = (path: string): Route => {
    // Remove language prefix (e.g. /en/about -> /about)
    // RegExp looks for ^/xx/, where xx is 2 chars. 
    // This is simple but assumes 2-char codes.
    const cleanPath = path.replace(/^\/[a-z]{2}(\/|$)/, '/');

    // Handle dynamic team routes
    if (cleanPath.startsWith('/team/')) {
        return 'team';
    }

    // Normalize root path: /en -> /
    const normalizedPath = cleanPath === '' ? '/' : cleanPath;

    const routeEntry = Object.entries(routeConfig).find(([_, config]) => config.path === normalizedPath);
    return (routeEntry?.[0] as Route) || 'home';
};
