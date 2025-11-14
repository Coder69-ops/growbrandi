import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Page = 'home' | 'services' | 'projects' | 'contact';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const NavLink: React.FC<{
    page: Page;
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    children: React.ReactNode;
    onClick?: () => void;
}> = ({ page, currentPage, setCurrentPage, children, onClick }) => {
    const isActive = currentPage === page;
    return (
        <a
            href={`#${page}`}
            onClick={(e) => {
                e.preventDefault();
                setCurrentPage(page);
                if (onClick) onClick();
            }}
            className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                    ? 'text-white bg-gradient-to-r from-emerald-500/30 to-blue-500/30 shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            aria-current={isActive ? 'page' : undefined}
        >
            {children}
            {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full" />
            )}
        </a>
    );
};

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navLinks: { page: Page; label: string }[] = [
        { page: 'home', label: 'Home' },
        { page: 'services', label: 'Services' },
        { page: 'projects', label: 'Projects' },
        { page: 'contact', label: 'Contact' },
    ];

    return (
        <>
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-white px-4 py-2 rounded-lg z-50"
            >
                Skip to main content
            </a>
            <header className="glass-effect sticky top-0 z-40 border-b border-white/10">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex justify-between items-center h-16 lg:h-20">
                        {/* Enhanced Logo */}
                        <a 
                            href="#home" 
                            onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} 
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
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1 bg-white/5 rounded-xl p-1">
                            {navLinks.map(link => (
                                <NavLink 
                                    key={link.page} 
                                    page={link.page} 
                                    currentPage={currentPage} 
                                    setCurrentPage={setCurrentPage}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Desktop Actions + Mobile Menu */}
                        <div className="flex items-center gap-4">
                            {/* Desktop CTA Button */}
                            <button className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-emerald-500/25">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Get Started
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
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

                {/* Simple Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            className="md:hidden border-t border-white/10"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <nav className="px-4 py-4 space-y-2">
                                {navLinks.map(link => (
                                    <NavLink
                                        key={link.page}
                                        page={link.page}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
};

export default Header;
