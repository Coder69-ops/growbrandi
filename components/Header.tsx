import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLocalizedPath } from '../src/hooks/useLocalizedPath';
import { useSiteSettings } from '../src/hooks/useSiteSettings';
import {
    FaCode, FaPalette, FaChartLine, FaBullhorn, FaVideo, FaHeadset, FaComments,
    FaBuilding, FaCogs, FaBriefcase, FaUsers, FaRocket, FaNewspaper,
    FaChevronDown, FaBars, FaTimes, FaPaperPlane
} from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import { db } from '../src/lib/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { getLocalizedField } from '../src/utils/localization';

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
            title: 'services.brand_growth.title',
            description: 'services.brand_growth.description',
            icon: FaChartLine
        },
        {
            route: '/services/social-media-content',
            title: 'services.social_media_content.title',
            description: 'services.social_media_content.description',
            icon: FaVideo
        },
        {
            route: '/services/ui-ux-design',
            title: 'services.ui_ux_design.title',
            description: 'services.ui_ux_design.description',
            icon: FaPalette
        },
        {
            route: '/services/web-development',
            title: 'services.web_development.title',
            description: 'services.web_development.description',
            icon: FaCode
        },
        {
            route: '/services/virtual-assistance',
            title: 'services.virtual_assistance.title',
            description: 'services.virtual_assistance.description',
            icon: FaHeadset
        },
        {
            route: '/services/customer-support',
            title: 'services.customer_support.title',
            description: 'services.customer_support.description',
            icon: FaComments
        }
    ],
    company: [
        {
            route: '/about',
            title: 'company.about_us.title',
            description: 'company.about_us.description',
            icon: FaBuilding
        },
        {
            route: '/process',
            title: 'company.process.title',
            description: 'company.process.description',
            icon: FaCogs
        },
        {
            route: '/case-studies',
            title: 'company.case_studies.title',
            description: 'company.case_studies.description',
            icon: FaBriefcase
        },
        {
            route: '/team',
            title: 'company.team.title',
            description: 'company.team.description',
            icon: FaUsers
        },
        {
            route: '/careers',
            title: 'company.careers.title',
            description: 'company.careers.description',
            icon: FaRocket
        },
        {
            route: '/blog',
            title: 'company.blog.title',
            description: 'company.blog.description',
            icon: FaNewspaper
        }
    ]
};

const NavLink: React.FC<{
    route: string;
    currentRoute: string; // This expects the full path including lang
    navigate: (route: string) => void;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}> = ({ route, currentRoute, navigate, children, onClick, className = "" }) => {
    const { getLocalizedPath } = useLocalizedPath();
    const localizedRoute = getLocalizedPath(route);

    // Check active status: exact match or partial match if not home
    // A simple check: does currentRoute equal localizedRoute?
    // Or does currentRoute start with localizedRoute for sub-paths?
    const isActive = currentRoute === localizedRoute || (route !== '/' && currentRoute.startsWith(localizedRoute));

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                navigate(localizedRoute);
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
    const { t } = useTranslation();
    const { getLocalizedPath } = useLocalizedPath();

    return (
        <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 px-2">{title}</h3>
            <div className="space-y-1">
                {items.map((item) => {
                    const localizedRoute = getLocalizedPath(item.route);
                    const isActive = currentRoute === localizedRoute;

                    return (
                        <button
                            key={item.route}
                            onClick={() => {
                                navigate(localizedRoute);
                                closeMegaMenu();
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/20 dark:border-blue-500/30'
                                : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                    : 'bg-slate-100 dark:bg-white/10 group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20'
                                    }`}>
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600 dark:text-white group-hover:text-blue-600 dark:group-hover:text-white'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-semibold text-sm mb-1 ${isActive ? 'text-blue-600 dark:text-white' : 'text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white'
                                        }`}>
                                        {t(item.title)}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 leading-relaxed">
                                        {t(item.description)}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div >
    );
};

const Header: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { getLocalizedPath } = useLocalizedPath();
    const { settings } = useSiteSettings();
    const currentRoute = location.pathname;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<'services' | 'company' | null>(null);
    const [dynamicServices, setDynamicServices] = useState<any[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch dynamic services
    useEffect(() => {
        const q = query(
            collection(db, 'services'),
            orderBy('order', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const services = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    // Include if showInMenu is not explicitly false
                    if (data.showInMenu === false) return null;

                    const IconComponent = (FaIcons as any)[data.icon] || FaBriefcase;

                    return {
                        id: doc.id,
                        route: `/services/${data.serviceId || doc.id}`,
                        title: getLocalizedField(data.title, i18n.language),
                        description: getLocalizedField(data.description, i18n.language),
                        icon: IconComponent,
                        isDynamic: true
                    };
                })
                .filter(Boolean) as any[];

            setDynamicServices(services);
        }, (error) => {
            console.error("Error fetching menu services:", error);
        });

        return () => unsubscribe();
    }, [i18n.language]);

    // Merge static company data with dynamic services
    const currentMegaMenuData = {
        services: dynamicServices.length > 0 ? dynamicServices : megaMenuData.services,
        company: megaMenuData.company
    };

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
                            onClick={() => navigate(getLocalizedPath('/'))}
                            className="flex items-center gap-3 group hover:opacity-90 transition-all duration-200"
                            aria-label="GrowBrandi Home"
                        >
                            {/* Light Mode Logo */}
                            <img
                                src={settings?.branding?.logoLight || "/growbrandi-logo.png"}
                                alt="GrowBrandi Logo"
                                loading="eager"
                                width="128"
                                height="32"
                                className="w-32 h-8 lg:w-48 lg:h-12 object-contain block dark:hidden"
                            />
                            {/* Dark Mode Logo */}
                            <img
                                src={settings?.branding?.logoDark || "/growbrandi-logo.png"}
                                alt="GrowBrandi Logo"
                                loading="eager"
                                width="128"
                                height="32"
                                className="w-32 h-8 lg:w-48 lg:h-12 object-contain hidden dark:block"
                            />
                        </button>

                        {/* Desktop Mega Menu Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            <NavLink route="/" currentRoute={currentRoute} navigate={navigate}>
                                {t('nav.home')}
                            </NavLink>

                            {/* Services Mega Menu */}
                            <div
                                className="relative"
                                onMouseEnter={() => handleMouseEnter('services')}
                                onMouseLeave={handleMouseLeave}
                            >
                                <button
                                    className="flex items-center gap-1 px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
                                    aria-expanded={activeDropdown === 'services'}
                                    aria-haspopup="true"
                                >
                                    {t('nav.services')}
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
                                    className="flex items-center gap-1 px-4 py-3 rounded-lg text-sm font-medium min-h-[44px] text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
                                    aria-expanded={activeDropdown === 'company'}
                                    aria-haspopup="true"
                                >
                                    {t('nav.company')}
                                    <FaChevronDown className="w-3 h-3" />
                                </button>
                            </div>

                            <NavLink route="/portfolio" currentRoute={currentRoute} navigate={navigate}>
                                {t('nav.portfolio')}
                            </NavLink>
                            <NavLink route="/contact" currentRoute={currentRoute} navigate={navigate}>
                                {t('nav.contact')}
                            </NavLink>
                        </nav>

                        {/* Desktop Actions + Mobile Menu */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <LanguageSwitcher />
                            <ThemeToggle />
                            <button
                                onClick={() => navigate(getLocalizedPath('/free-growth-call'))}
                                className="hidden lg:flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-zinc-200 font-bold px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <FaPaperPlane className="w-4 h-4" />
                                {t('common.book_free_call', 'Book Your Free Call')}
                            </button>

                            {/* Mobile CTA (Compact) */}
                            <button
                                onClick={() => navigate(getLocalizedPath('/free-growth-call'))}
                                className="lg:hidden flex items-center gap-1.5 bg-blue-600 text-white font-bold px-3 py-1.5 rounded-full transition-all duration-300 shadow-sm text-xs"
                            >
                                <FaPaperPlane className="w-3 h-3" />
                                <span>Book</span>
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
                                        {currentMegaMenuData.services.map((service) => (
                                            <button
                                                key={service.route}
                                                onClick={() => {
                                                    navigate(getLocalizedPath(service.route));
                                                    closeMegaMenu();
                                                }}
                                                className={`text-left p-4 rounded-xl transition-all duration-200 group ${currentRoute === getLocalizedPath(service.route)
                                                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/20 dark:border-blue-500/30'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${currentRoute === service.route
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                        : 'bg-slate-100 dark:bg-white/10 group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20'
                                                        }`}>
                                                        <service.icon className={`w-6 h-6 ${currentRoute === getLocalizedPath(service.route) ? 'text-white' : 'text-slate-600 dark:text-white group-hover:text-blue-600 dark:group-hover:text-white'}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold text-base mb-2 ${currentRoute === getLocalizedPath(service.route) ? 'text-blue-600 dark:text-white' : 'text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white'
                                                            }`}>
                                                            {t(service.title)}
                                                        </h4>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 leading-relaxed">
                                                            {t(service.description)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {activeDropdown === 'company' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {currentMegaMenuData.company.map((item) => (
                                            <button
                                                key={item.route}
                                                onClick={() => {
                                                    navigate(getLocalizedPath(item.route));
                                                    closeMegaMenu();
                                                }}
                                                className={`text-left p-4 rounded-xl transition-all duration-200 group ${currentRoute === getLocalizedPath(item.route)
                                                    ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-500/20 dark:border-blue-500/30'
                                                    : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${currentRoute === getLocalizedPath(item.route)
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                        : 'bg-slate-100 dark:bg-white/10 group-hover:bg-blue-500/10 dark:group-hover:bg-blue-500/20'
                                                        }`}>
                                                        <item.icon className={`w-6 h-6 ${currentRoute === getLocalizedPath(item.route) ? 'text-white' : 'text-slate-600 dark:text-white group-hover:text-blue-600 dark:group-hover:text-white'}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-bold text-base mb-2 ${currentRoute === getLocalizedPath(item.route) ? 'text-blue-600 dark:text-white' : 'text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white'
                                                            }`}>
                                                            {t(item.title)}
                                                        </h4>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 leading-relaxed">
                                                            {t(item.description)}
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

                                        <NavLink
                                            route="/"
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            onClick={closeMegaMenu}
                                            className="w-full text-left"
                                        >
                                            {t('nav.home')}
                                        </NavLink>
                                        <NavLink
                                            route="/portfolio"
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            onClick={closeMegaMenu}
                                            className="w-full text-left"
                                        >
                                            {t('nav.portfolio')}
                                        </NavLink>
                                        <NavLink
                                            route="/services"
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            onClick={closeMegaMenu}
                                            className="w-full text-left"
                                        >
                                            {t('nav.services_overview')}
                                        </NavLink>
                                        <NavLink
                                            route="/contact"
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            onClick={closeMegaMenu}
                                            className="w-full text-left"
                                        >
                                            {t('nav.contact')}
                                        </NavLink>
                                    </div>

                                    {/* Mobile Services Section */}
                                    <div className="mb-8">
                                        <MegaMenuSection
                                            title={t('nav.services')}
                                            items={currentMegaMenuData.services}
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            closeMegaMenu={closeMegaMenu}
                                        />
                                    </div>

                                    {/* Mobile Company Section */}
                                    <div className="mb-6">
                                        <MegaMenuSection
                                            title={t('nav.company')}
                                            items={currentMegaMenuData.company}
                                            currentRoute={currentRoute}
                                            navigate={navigate}
                                            closeMegaMenu={closeMegaMenu}
                                        />
                                    </div>

                                    {/* Mobile CTA */}
                                    <button
                                        onClick={() => {
                                            navigate(getLocalizedPath('/free-growth-call'));
                                            closeMegaMenu();
                                        }}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-zinc-200 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg"
                                    >
                                        <FaPaperPlane className="w-5 h-5" />
                                        {t('common.book_free_call', 'Book Your Free Call')}
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
