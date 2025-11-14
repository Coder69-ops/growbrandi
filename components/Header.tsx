import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, Route } from './Router';

interface HeaderProps {
    // No props needed - using router directly
}

interface MegaMenuData {
    services: Array<{
        route: Route;
        title: string;
        description: string;
        icon: string;
    }>;
    company: Array<{
        route: Route;
        title: string;
        description: string;
        icon: string;
    }>;
}

const megaMenuData: MegaMenuData = {
    services: [
        {
            route: 'web-development',
            title: 'Web Development',
            description: 'Custom web solutions using cutting-edge technologies',
            icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
        },
        {
            route: 'ui-ux-design',
            title: 'UI/UX Design',
            description: 'User-centered design that drives engagement',
            icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 5H5v12a2 2 0 002 2h0a2 2 0 002-2V5H7z'
        },
        {
            route: 'brand-strategy',
            title: 'Brand Strategy',
            description: 'Strategic brand development and positioning',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        },
        {
            route: 'seo-optimization',
            title: 'SEO Optimization',
            description: 'Advanced SEO strategies for better rankings',
            icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
        },
        {
            route: 'digital-marketing',
            title: 'Digital Marketing',
            description: 'Comprehensive marketing strategies for growth',
            icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
        },
        {
            route: 'ai-solutions',
            title: 'AI Solutions',
            description: 'Cutting-edge AI integration and automation',
            icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
        }
    ],
    company: [
        {
            route: 'about',
            title: 'About Us',
            description: 'Learn about our mission and team',
            icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            route: 'process',
            title: 'Our Process',
            description: 'Discover our proven methodology',
            icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
        },
        {
            route: 'case-studies',
            title: 'Case Studies',
            description: 'Real client success stories',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        },
        {
            route: 'team',
            title: 'Our Team',
            description: 'Meet the experts behind our success',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        },
        {
            route: 'careers',
            title: 'Careers',
            description: 'Join our innovative team',
            icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8'
        },
        {
            route: 'blog',
            title: 'Blog',
            description: 'Insights and industry expertise',
            icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
        }
    ]
};

const NavLink: React.FC<{
    route: Route;
    currentRoute: Route;
    navigate: (route: Route) => void;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}> = ({ route, currentRoute, navigate, children, onClick, className = "" }) => {
    const isActive = currentRoute === route;
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                navigate(route);
                if (onClick) onClick();
            }}
            className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                    ? 'text-white bg-gradient-to-r from-emerald-500/30 to-blue-500/30 shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
            } ${className}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
            {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full" />
            )}
        </button>
    );
};

const MegaMenuSection: React.FC<{
    title: string;
    items: Array<{
        route: Route;
        title: string;
        description: string;
        icon: string;
    }>;
    currentRoute: Route;
    navigate: (route: Route) => void;
    closeMegaMenu: () => void;
}> = ({ title, items, currentRoute, navigate, closeMegaMenu }) => {
    return (
        <div>
            <h3 className="text-white font-bold text-lg mb-4 px-2">{title}</h3>
            <div className="space-y-1">
                {items.map((item) => (
                    <button
                        key={item.route}
                        onClick={() => {
                            navigate(item.route);
                            closeMegaMenu();
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                            currentRoute === item.route
                                ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30'
                                : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                currentRoute === item.route
                                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500'
                                    : 'bg-white/10 group-hover:bg-emerald-500/20'
                            }`}>
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold text-sm mb-1 ${
                                    currentRoute === item.route ? 'text-white' : 'text-slate-200 group-hover:text-white'
                                }`}>
                                    {item.title}
                                </h4>
                                <p className="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = () => {
    const { currentRoute, navigate } = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<'services' | 'company' | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (dropdown: 'services' | 'company') => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setActiveDropdown(dropdown);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150);
    };

    const closeMegaMenu = () => {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-white px-4 py-2 rounded-lg z-50"
            >
                Skip to main content
            </a>
            <header className="glass-effect sticky top-0 z-50 border-b border-white/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
                        {/* Enhanced Logo */}
                        <button 
                            onClick={() => navigate('home')} 
                            className="flex items-center gap-3 group hover:opacity-90 transition-all duration-200"
                            aria-label="GrowBrandi Home"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-lg blur-sm opacity-50 group-hover:opacity-70 transition-opacity" />
                                <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <span className="text-xl lg:text-2xl font-bold text-gradient block">
                                    GrowBrandi
                                </span>
                                <span className="text-xs text-emerald-400 font-medium opacity-80 hidden lg:block">
                                    AI-Powered Agency
                                </span>
                            </div>
                        </button>

                        {/* Desktop Mega Menu Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            <NavLink route="home" currentRoute={currentRoute} navigate={navigate}>
                                Home
                            </NavLink>

                            {/* Services Mega Menu */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('services')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                                    Services
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Company Mega Menu */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('company')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                                    Company
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>

                            <NavLink route="portfolio" currentRoute={currentRoute} navigate={navigate}>
                                Portfolio
                            </NavLink>
                            <NavLink route="contact" currentRoute={currentRoute} navigate={navigate}>
                                Contact
                            </NavLink>
                        </nav>

                        {/* Desktop Actions + Mobile Menu */}
                        <div className="flex items-center gap-4">
                            {/* Desktop CTA Button */}
                            <button 
                                onClick={() => navigate('contact')}
                                className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Get Started
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Toggle menu</span>
                                {isMobileMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Mega Menu Dropdown */}
                <AnimatePresence>
                    {activeDropdown && (
                        <motion.div
                            className="absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            onMouseEnter={() => handleMouseEnter(activeDropdown)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                                {activeDropdown === 'services' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {megaMenuData.services.map((service) => (
                                            <button
                                                key={service.route}
                                                onClick={() => {
                                                    navigate(service.route);
                                                    closeMegaMenu();
                                                }}
                                                className={`text-left p-4 rounded-xl transition-all duration-200 group ${
                                                    currentRoute === service.route
                                                        ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30'
                                                        : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                                                }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                        currentRoute === service.route
                                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500'
                                                            : 'bg-white/10 group-hover:bg-emerald-500/20'
                                                    }`}>
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold text-base mb-2 ${
                                                            currentRoute === service.route ? 'text-white' : 'text-slate-200 group-hover:text-white'
                                                        }`}>
                                                            {service.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-400 group-hover:text-slate-300 leading-relaxed">
                                                            {service.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {activeDropdown === 'company' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {megaMenuData.company.map((item) => (
                                            <button
                                                key={item.route}
                                                onClick={() => {
                                                    navigate(item.route);
                                                    closeMegaMenu();
                                                }}
                                                className={`text-left p-4 rounded-xl transition-all duration-200 group ${
                                                    currentRoute === item.route
                                                        ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30'
                                                        : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                                                }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                        currentRoute === item.route
                                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500'
                                                            : 'bg-white/10 group-hover:bg-emerald-500/20'
                                                    }`}>
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold text-base mb-2 ${
                                                            currentRoute === item.route ? 'text-white' : 'text-slate-200 group-hover:text-white'
                                                        }`}>
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-400 group-hover:text-slate-300 leading-relaxed">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            className="lg:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-4 py-6 max-h-[80vh] overflow-y-auto">
                                {/* Mobile Navigation Links */}
                                <div className="space-y-2 mb-6">
                                    <NavLink
                                        route="home"
                                        currentRoute={currentRoute}
                                        navigate={navigate}
                                        onClick={closeMegaMenu}
                                        className="w-full text-left"
                                    >
                                        Home
                                    </NavLink>
                                    <NavLink
                                        route="portfolio"
                                        currentRoute={currentRoute}
                                        navigate={navigate}
                                        onClick={closeMegaMenu}
                                        className="w-full text-left"
                                    >
                                        Portfolio
                                    </NavLink>
                                    <NavLink
                                        route="services"
                                        currentRoute={currentRoute}
                                        navigate={navigate}
                                        onClick={closeMegaMenu}
                                        className="w-full text-left"
                                    >
                                        Services Overview
                                    </NavLink>
                                    <NavLink
                                        route="contact"
                                        currentRoute={currentRoute}
                                        navigate={navigate}
                                        onClick={closeMegaMenu}
                                        className="w-full text-left"
                                    >
                                        Contact
                                    </NavLink>
                                </div>

                                {/* Mobile Services Section */}
                                <div className="mb-8">
                                    <MegaMenuSection
                                        title="Our Services"
                                        items={megaMenuData.services}
                                        currentRoute={currentRoute}
                                        navigate={navigate}
                                        closeMegaMenu={closeMegaMenu}
                                    />
                                </div>

                                {/* Mobile Company Section */}
                                <div className="mb-6">
                                    <MegaMenuSection
                                        title="Company"
                                        items={megaMenuData.company}
                                        currentRoute={currentRoute}
                                        navigate={navigate}
                                        closeMegaMenu={closeMegaMenu}
                                    />
                                </div>

                                {/* Mobile CTA */}
                                <button 
                                    onClick={() => {
                                        navigate('contact');
                                        closeMegaMenu();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Get Started
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;
