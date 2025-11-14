import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route, options?: NavigationOptions) => void;
  goBack: () => void;
  goForward: () => void;
  replace: (route: Route) => void;
  history: Route[];
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  previousRoute: Route | null;
}

interface NavigationOptions {
  replace?: boolean;
  scroll?: boolean | { top: number; behavior?: 'smooth' | 'auto' };
  state?: any;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>('home');
  const [history, setHistory] = useState<Route[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previousRoute, setPreviousRoute] = useState<Route | null>(null);

  // Valid routes for validation
  const VALID_ROUTES: Route[] = [
    'home', 'about', 'process', 'case-studies', 'careers', 'blog', 'contact', 'services', 'portfolio', 'team',
    'web-development', 'ui-ux-design', 'brand-strategy', 'seo-optimization', 
    'digital-marketing', 'ai-solutions', 'privacy-policy', 'terms-of-service', 'cookie-policy'
  ];

  // Convert route to clean URL path
  const getPathFromRoute = (route: Route): string => {
    return routeConfig[route]?.path || '/';
  };

  // Convert URL path to route
  const getRouteFromPath = (path: string): Route => {
    const routeEntry = Object.entries(routeConfig).find(([_, config]) => config.path === path);
    return (routeEntry?.[0] as Route) || 'home';
  };

  // Initialize from current URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const initialRoute = getRouteFromPath(currentPath);
    
    if (VALID_ROUTES.includes(initialRoute) && initialRoute !== currentRoute) {
      setCurrentRoute(initialRoute);
      setHistory([initialRoute]);
      setHistoryIndex(0);
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      const route = getRouteFromPath(path);
      
      if (VALID_ROUTES.includes(route)) {
        setPreviousRoute(currentRoute);
        setCurrentRoute(route);
        
        // Update document title
        document.title = `${routeConfig[route].title} - GrowBrandi`;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentRoute]);

  // Enhanced navigation function
  const navigate = (route: Route, options: NavigationOptions = {}) => {
    const { replace = false, scroll = true, state = null } = options;
    
    console.log(`Router: Navigating from ${currentRoute} to ${route}`);
    
    if (route === currentRoute && !replace) {
      console.log('Router: Already on target route, skipping navigation');
      return;
    }

    if (!VALID_ROUTES.includes(route)) {
      console.error(`Router: Invalid route ${route}`);
      return;
    }
    
    setIsLoading(true);
    setPreviousRoute(currentRoute);
    
    // Update internal state
    setCurrentRoute(route);
    
    if (!replace) {
      const newHistory = [...history.slice(0, historyIndex + 1), route];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    // Update browser URL and history
    const path = getPathFromRoute(route);
    const title = `${routeConfig[route].title} - GrowBrandi`;
    
    if (replace) {
      window.history.replaceState({ route, ...state }, title, path);
    } else {
      window.history.pushState({ route, ...state }, title, path);
    }
    
    // Update document title
    document.title = title;
    
    // Handle scrolling
    if (scroll) {
      const scrollOptions = typeof scroll === 'boolean' 
        ? { top: 0, behavior: 'smooth' as const }
        : scroll;
      window.scrollTo(scrollOptions);
    }
    
    setIsLoading(false);
    
    // Track analytics and performance
    const metadata = getRouteMetadata(route);
    trackPageView(route, metadata);
    
    console.log(`Router: Navigation complete to ${route} at ${path}`);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const targetRoute = history[newIndex];
      
      setHistoryIndex(newIndex);
      setPreviousRoute(currentRoute);
      setCurrentRoute(targetRoute);
      
      window.history.back();
    } else {
      // Fallback to browser history
      window.history.back();
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const targetRoute = history[newIndex];
      
      setHistoryIndex(newIndex);
      setPreviousRoute(currentRoute);
      setCurrentRoute(targetRoute);
      
      window.history.forward();
    } else {
      // Fallback to browser history
      window.history.forward();
    }
  };

  const replace = (route: Route) => {
    navigate(route, { replace: true });
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  return (
    <RouterContext.Provider value={{ 
      currentRoute, 
      navigate, 
      goBack, 
      goForward, 
      replace, 
      history, 
      canGoBack, 
      canGoForward, 
      isLoading, 
      previousRoute 
    }}>
      {children}
    </RouterContext.Provider>
  );
};

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

export const getRouteMetadata = (route: Route) => {
  return routeConfig[route] || routeConfig.home;
};

// Enhanced router hooks
export const useRouteParams = () => {
  const { currentRoute } = useRouter();
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    route: currentRoute,
    searchParams: Object.fromEntries(urlParams.entries()),
    getParam: (key: string) => urlParams.get(key),
    setParam: (key: string, value: string) => {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set(key, value);
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  };
};

export const useNavigationGuard = (shouldBlock: boolean, message?: string) => {
  useEffect(() => {
    if (!shouldBlock) return;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message || 'Are you sure you want to leave?';
      return message;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldBlock, message]);
};

export const useBreadcrumbs = () => {
  const { currentRoute } = useRouter();
  const config = routeConfig[currentRoute];
  
  return config?.breadcrumb || ['Home'];
};

// Router error boundary
interface RouterErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class RouterErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  RouterErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): RouterErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Router Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Navigation Error</h1>
            <p className="text-slate-300 mb-8">Something went wrong with the navigation.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route preloading utility
export const preloadRoute = async (route: Route) => {
  try {
    // Preload route-specific components
    switch (route) {
      case 'web-development':
        await import('../components/ServicePages');
        break;
      case 'ui-ux-design':
        await import('../components/ServicePages');
        break;
      case 'brand-strategy':
        await import('../components/ServicePages');
        break;
      case 'about':
        await import('../components/CompanyPages');
        break;
      case 'contact':
        await import('../components/ContactPage');
        break;
      // Add more cases as needed
    }
    console.log(`Preloaded route: ${route}`);
  } catch (error) {
    console.warn(`Failed to preload route ${route}:`, error);
  }
};

// Analytics integration
export const trackPageView = (route: Route, metadata: any) => {
  // Google Analytics 4
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: metadata.title,
      page_location: window.location.href,
      page_path: metadata.path,
    });
  }
  
  // Custom analytics
  console.log('Page view:', {
    route,
    path: metadata.path,
    title: metadata.title,
    timestamp: new Date().toISOString(),
  });
};

// Performance monitoring
export const measureRoutePerformance = (route: Route, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`Route ${route} loaded in ${duration.toFixed(2)}ms`);
  
  // Send to analytics if needed
  if (duration > 1000) {
    console.warn(`Slow route load detected: ${route} took ${duration.toFixed(2)}ms`);
  }
};

// Route transition animations
export const routeTransitions = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

export const routeTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

// SEO Utilities
export const generateSitemap = () => {
  const baseUrl = 'https://growbrandi.com';
  const routes = Object.keys(routeConfig) as Route[];
  
  const sitemap = routes.map(route => {
    const config = routeConfig[route];
    const path = config.path;
    
    return {
      url: `${baseUrl}${path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: route === 'home' ? 'weekly' : 'monthly',
      priority: route === 'home' ? '1.0' : '0.8',
      title: config.title,
      description: config.description,
    };
  });
  
  return sitemap;
};

// Structured data generation
export const generateStructuredData = (route: Route) => {
  const config = routeConfig[route];
  const baseUrl = 'https://growbrandi.com';
  const path = config.path;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": config.title,
    "description": config.description,
    "url": `${baseUrl}${path}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "GrowBrandi",
      "url": baseUrl,
    },
  };
  
  // Add specific structured data for different page types
  if (route.includes('service') || route === 'services') {
    structuredData["@type"] = "Service";
  } else if (route === 'about') {
    structuredData["@type"] = "AboutPage";  
  } else if (route === 'contact') {
    structuredData["@type"] = "ContactPage";
  }
  
  return structuredData;
};