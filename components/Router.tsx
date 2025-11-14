import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the available routes
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
  | 'cookie-policy';

interface RouterContextType {
  currentRoute: Route;
  navigate: (route: Route) => void;
  goBack: () => void;
  history: Route[];
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

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const route = event.state?.route || 'home';
      setCurrentRoute(route);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialize from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1) as Route;
    if (hash && hash !== currentRoute) {
      setCurrentRoute(hash);
      setHistory([hash]);
    }
  }, []);

  const navigate = (route: Route) => {
    if (route === currentRoute) return;
    
    setCurrentRoute(route);
    setHistory(prev => [...prev, route]);
    
    // Update URL hash
    window.location.hash = route;
    
    // Update browser history
    window.history.pushState({ route }, '', `#${route}`);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousRoute = newHistory[newHistory.length - 1];
      
      setHistory(newHistory);
      setCurrentRoute(previousRoute);
      
      // Update URL hash
      window.location.hash = previousRoute;
      
      // Update browser history
      window.history.back();
    }
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, goBack, history }}>
      {children}
    </RouterContext.Provider>
  );
};

// Route mapping for cleaner URLs and titles
export const routeConfig: Record<Route, { title: string; path: string }> = {
  'home': { title: 'Home', path: '/' },
  'about': { title: 'About Us', path: '/about' },
  'process': { title: 'Our Process', path: '/process' },
  'case-studies': { title: 'Case Studies', path: '/case-studies' },
  'careers': { title: 'Careers', path: '/careers' },
  'blog': { title: 'Blog', path: '/blog' },
  'contact': { title: 'Contact', path: '/contact' },
  'web-development': { title: 'Web Development', path: '/services/web-development' },
  'ui-ux-design': { title: 'UI/UX Design', path: '/services/ui-ux-design' },
  'brand-strategy': { title: 'Brand Strategy', path: '/services/brand-strategy' },
  'seo-optimization': { title: 'SEO Optimization', path: '/services/seo-optimization' },
  'digital-marketing': { title: 'Digital Marketing', path: '/services/digital-marketing' },
  'ai-solutions': { title: 'AI Solutions', path: '/services/ai-solutions' },
  'privacy-policy': { title: 'Privacy Policy', path: '/legal/privacy-policy' },
  'terms-of-service': { title: 'Terms of Service', path: '/legal/terms-of-service' },
  'cookie-policy': { title: 'Cookie Policy', path: '/legal/cookie-policy' },
};