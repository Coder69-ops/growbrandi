import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import {
    FaCode, FaPalette, FaChartLine, FaBullhorn, FaVideo, FaHeadset, FaComments,
    FaBuilding, FaCogs, FaBriefcase, FaUsers, FaRocket, FaNewspaper,
    FaChevronDown, FaBars, FaTimes, FaPaperPlane
} from 'react-icons/fa';

interface HeaderProps {
    // No props needed - using router directly
}

interface MegaMenuData {
    services: Array<{
        route: string;
        title: string;
        description: string;
        icon: React.ElementType;
    }>;
    company: Array<{
        route: string;
        title: string;
        description: string;
        icon: React.ElementType;
    }>;
}

const megaMenuData: MegaMenuData = {
    services: [
        {
            route: '/services/brand-growth',
            title: 'Brand Growth',
            description: 'Scale with high-performance ads on TikTok, Meta & Google',
            icon: FaChartLine
        },
        {
            route: '/services/social-media-content',
            title: 'Social Media Content',
            description: 'Engaging video editing and post creation',
            icon: FaVideo
        },
        {
            route: '/services/ui-ux-design',
            title: 'UI/UX Design',
            description: 'User-centered design that drives engagement',
            icon: FaPalette
        },
        {
            route: '/services/web-development',
            title: 'Web Development',
            description: 'Custom web solutions using cutting-edge technologies',
            icon: FaCode
        },
        {
            route: '/services/virtual-assistance',
            title: 'Virtual Assistance',
            description: 'Professional support for admin and operations',
            icon: FaHeadset
        },
        {
            route: '/services/customer-support',
            title: 'Customer Support',
            description: '24/7 support to ensure customer satisfaction',
            icon: FaComments
        }
    ],
    company: [
        {
            route: '/about',
            title: 'About Us',
            description: 'Learn about our mission and team',
            icon: FaBuilding
        },
        {
            route: '/process',
            title: 'Our Process',
            description: 'Discover our proven methodology',
            icon: FaCogs
        },
        {
            route: '/case-studies',
            title: 'Case Studies',
            description: 'Real client success stories',
            icon: FaBriefcase
        },
        {
            route: '/team',
            title: 'Our Team',
            description: 'Meet the experts behind our success',
            icon: FaUsers
        },
        {
            route: '/careers',
            title: 'Careers',
            description: 'Join our innovative team',
            icon: FaRocket
        },
        {
            route: '/blog',
            title: 'Blog',
            description: 'Insights and industry expertise',
            icon: FaNewspaper
        }
    ]
};

const NavLink: React.FC<{
    route: string;
    currentRoute: string;
    navigate: (route: string) => void;
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
            className={`relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px] flex items-center ${isActive
                ? 'text-blue-600 dark:text-white bg-blue-50 dark:bg-white/10 shadow-sm dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                } ${className}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
        </button>
    );
};

const MegaMenuSection: React.FC<{
    title: string;
    items: Array<{
        route: string;
        title: string;
        description: string;
        icon: React.ElementType;
    }>;
    currentRoute: string;
    navigate: (route: string) => void;
    closeMegaMenu: () => void;
}> = ({ title, items, currentRoute, navigate, closeMegaMenu }) => {
    return (
        <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 px-2">{title}</h3>
            <div className="space-y-1">
                {items.map((item) => (
                    <button
                        key={item.route}
                        onClick={() => {
                            navigate(item.route);
                            closeMegaMenu();
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${currentRoute === item.route
                            ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/20 dark:border-blue-500/30'
                            : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${currentRoute === item.route
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                : 'bg-slate-100 dark:bg-white/10 group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20'
                                }`}>
                                <item.icon className={`w-5 h-5 ${currentRoute === item.route ? 'text-white' : 'text-slate-600 dark:text-white group-hover:text-blue-600 dark:group-hover:text-white'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold text-sm mb-1 ${currentRoute === item.route ? 'text-blue-600 dark:text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white'
                                    }`}>
                                    {item.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div >
    );
};

const Header: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentRoute = location.pathname;
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
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-500 text-white px-4 py-2 rounded-lg z-50"
            >
                Skip to main content
            </a>
            <header className="glass-effect sticky top-0 z-[100] border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-luxury-black/80 backdrop-blur-md transition-colors duration-300">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
                        {/* Enhanced Logo */}
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-3 group hover:opacity-90 transition-all duration-200"
                            aria-label="GrowBrandi Home"
                        >
                            <img
                                src="/growbrandi-logo.png"
                                alt="GrowBrandi Logo"
                                loading="eager"
                                width="128"
                                height="32"
                                className="w-32 h-8 lg:w-48 lg:h-12 object-contain"
                            />
                        </button>

                        {/* Desktop Mega Menu Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            <NavLink route="/" currentRoute={currentRoute} navigate={navigate}>
                                Home
                            </NavLink>

                            {/* Services Mega Menu */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('services')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    aria-expanded={activeDropdown === 'services'}
                                    aria-haspopup="true"
                                >
                                    Services
                                    <FaChevronDown className="w-3 h-3" />
                                </button>
                            </div>

                            {/* Company Mega Menu */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('company')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    aria-expanded={activeDropdown === 'company'}
                                    aria-haspopup="true"
                                >
                                    Company
                                    <FaChevronDown className="w-3 h-3" />
                                </button>
                            </div>

                            <NavLink route="/portfolio" currentRoute={currentRoute} navigate={navigate}>
                                Portfolio
                            </NavLink>
                            <NavLink route="/contact" currentRoute={currentRoute} navigate={navigate}>
                                Contact
                            </NavLink>
                        </nav>

                        {/* Desktop Actions + Mobile Menu */}
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            {/* Desktop CTA Button */}
                            <button
                                onClick={() => navigate('/contact')}
                                className="hidden lg:flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-zinc-200 font-bold px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <FaPaperPlane className="w-4 h-4" />
                                Get Started
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span className="sr-only">Toggle menu</span>
                                {isMobileMenuOpen ? (
                                    <FaTimes className="w-6 h-6" />
                                ) : (
                                    <FaBars className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Mega Menu Dropdown */}
                <AnimatePresence>
                    {activeDropdown && (
                        <motion.div
                            className="absolute top-full left-0 right-0 bg-white/95 dark:bg-luxury-black/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-2xl z-[100]"
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
                                                className={`text-left p-4 rounded-xl transition-all duration-200 group ${currentRoute === service.route
                                                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/20 dark:border-blue-500/30'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${currentRoute === service.route
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                        : 'bg-slate-100 dark:bg-white/10 group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20'
                                                        }`}>
                                                        <service.icon className={`w-6 h-6 ${currentRoute === service.route ? 'text-white' : 'text-slate-600 dark:text-white group-hover:text-blue-600 dark:group-hover:text-white'}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold text-base mb-2 ${currentRoute === service.route ? 'text-blue-600 dark:text-white' : 'text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white'
                                                            }`}>
                                                            {service.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 leading-relaxed">
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
                                                className={`text-left p-4 rounded-xl transition-all duration-200 group ${currentRoute === item.route
                                                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/20 dark:border-blue-500/30'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${currentRoute === item.route
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                        : 'bg-slate-100 dark:bg-white/10 group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20'
                                                        }`}>
                                                        <item.icon className={`w-6 h-6 ${currentRoute === item.route ? 'text-white' : 'text-slate-600 dark:text-white group-hover:text-blue-600 dark:group-hover:text-white'}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold text-base mb-2 ${currentRoute === item.route ? 'text-blue-600 dark:text-white' : 'text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white'
                                                            }`}>
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 leading-relaxed">
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
                </AnimatePresence >

                {/* Mobile Menu */}
                <AnimatePresence>
                    {
                        isMobileMenuOpen && (
                            <motion.div
                                className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-luxury-black/95 backdrop-blur-xl"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="px-4 py-6 max-h-[80vh] overflow-y-auto">
                                    {/* Mobile Navigation Links */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-end mb-4 px-4">
                                            <ThemeToggle />
                                        </div>
                                        <NavLink
                                            route="/"
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            onClick={closeMegaMenu}
                                            className="w-full text-left"
                                        >
                                            Home
                                        </NavLink>
                                        <NavLink
                                            route="/portfolio"
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            onClick={closeMegaMenu}
                                            className="w-full text-left"
                                        >
                                            Portfolio
                                        </NavLink>
                                        <NavLink
                                            route="/services"
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            onClick={closeMegaMenu}
                                            className="w-full text-left"
                                        >
                                            Services Overview
                                        </NavLink>
                                        <NavLink
                                            route="/contact"
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
                                            navigate('/contact');
                                            closeMegaMenu();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
                                    >
                                        <FaPaperPlane className="w-5 h-5" />
                                        Get Started
                                    </button>
                                </div>
                            </motion.div>
                        )
                    }
                </AnimatePresence >
            </header >
        </>
    );
};

export default Header;
