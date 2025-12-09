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
    | 'brand-strategy'
    | 'seo-optimization'
    | 'digital-marketing'
    | 'ai-solutions'
    | 'privacy-policy'
    | 'terms-of-service'
    | 'cookie-policy'
    | 'services' // Services overview page
    | 'portfolio' // Portfolio overview
    | 'team'; // Team page

// Route categories for better organization
export const ROUTE_CATEGORIES = {
    MAIN: ['home', 'about', 'contact', 'services', 'portfolio', 'team'] as Route[],
    SERVICES: ['web-development', 'ui-ux-design', 'brand-strategy', 'seo-optimization', 'digital-marketing', 'ai-solutions'] as Route[],
    COMPANY: ['about', 'process', 'careers', 'blog', 'team'] as Route[],
    LEGAL: ['privacy-policy', 'terms-of-service', 'cookie-policy'] as Route[],
} as const;

// Enhanced route configuration with SEO-friendly URLs, metadata, and breadcrumbs
export const routeConfig: Record<Route, {
    title: string;
    path: string;
    description?: string;
    keywords?: string[];
    category?: string;
    breadcrumb?: string[];
}> = {
    'home': {
        title: 'Home',
        path: '/',
        description: 'AI-Powered Digital Agency - Transform your business with cutting-edge solutions',
        keywords: ['digital agency', 'AI solutions', 'web development', 'GrowBrandi'],
        category: 'main'
    },
    'about': {
        title: 'About Us',
        path: '/about',
        description: 'Learn about GrowBrandi - Our mission, vision, and the team behind your success',
        keywords: ['about GrowBrandi', 'digital agency team', 'company mission'],
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
    'web-development': {
        title: 'Web Development Services',
        path: '/services/web-development',
        description: 'Custom web development solutions using cutting-edge technologies',
        keywords: ['web development', 'custom websites', 'React', 'Node.js'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'Web Development']
    },
    'ui-ux-design': {
        title: 'UI/UX Design Services',
        path: '/services/ui-ux-design',
        description: 'User-centered design solutions that drive engagement and conversions',
        keywords: ['UI design', 'UX design', 'user experience', 'interface design'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'UI/UX Design']
    },
    'brand-strategy': {
        title: 'Brand Strategy Services',
        path: '/services/brand-strategy',
        description: 'Strategic brand development and positioning for market success',
        keywords: ['brand strategy', 'brand development', 'brand positioning', 'marketing'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'Brand Strategy']
    },
    'seo-optimization': {
        title: 'SEO Optimization Services',
        path: '/services/seo-optimization',
        description: 'Advanced SEO strategies to improve your search engine rankings',
        keywords: ['SEO', 'search optimization', 'Google ranking', 'organic traffic'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'SEO Optimization']
    },
    'digital-marketing': {
        title: 'Digital Marketing Services',
        path: '/services/digital-marketing',
        description: 'Comprehensive digital marketing strategies for business growth',
        keywords: ['digital marketing', 'social media', 'PPC', 'content marketing'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'Digital Marketing']
    },
    'ai-solutions': {
        title: 'AI Solutions Services',
        path: '/services/ai-solutions',
        description: 'Cutting-edge AI integration and automation solutions for businesses',
        keywords: ['AI solutions', 'artificial intelligence', 'automation', 'machine learning'],
        category: 'services',
        breadcrumb: ['Home', 'Services', 'AI Solutions']
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
