import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { ThemeToggle } from '../../../components/ThemeToggle';
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Briefcase,
    MessageSquareQuote,
    HelpCircle,
    Database,
    FileText,
    Contact,
    ChevronLeft,
    Search,
    Bell,
    Mail
} from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            // Set a flag in session storage so Login page knows we just logged out intentionally
            sessionStorage.setItem('logoutMessage', 'Successfully logged out');
            await signOut(auth);
            // ProtectedRoute will handle the redirect to /admin/login when currentUser becomes null
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/site-content', icon: FileText, label: 'Site Content' },
        { path: '/admin/projects', icon: FolderKanban, label: 'Projects' },
        { path: '/admin/services', icon: Briefcase, label: 'Services' },
        { path: '/admin/team', icon: Users, label: 'Team' },
        { path: '/admin/testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
        { path: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
        { path: '/admin/contact-settings', icon: Contact, label: 'Contact Settings' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
        { path: '/admin/seed-data', icon: Database, label: 'Seed Data' },
        { path: '/admin/messages', icon: Mail, label: 'Messages' },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Ambient Background Mesh */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-4 left-4 z-50 rounded-2xl glass-sidebar border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isSidebarOpen ? 'w-72' : 'w-20'
                    } hidden md:flex flex-col shadow-2xl shadow-indigo-500/5`}
            >
                {/* Logo Area */}
                <div className="h-24 flex items-center justify-center border-b border-slate-100/50 dark:border-slate-800/50 px-6">
                    {isSidebarOpen ? (
                        <div className="flex flex-col items-center">
                            <img src="/growbrandi-logo.png" alt="GrowBrandAI" className="h-12 w-auto object-contain mb-1" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-semibold">
                                Admin Console
                            </span>
                        </div>
                    ) : (
                        <img src="/growbrandi-logo.png" alt="GB" className="w-10 h-10 object-contain" />
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400'
                                            }`}
                                    >
                                        <item.icon
                                            size={22}
                                            strokeWidth={isActive ? 2.5 : 2}
                                            className={`relative z-10 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`}
                                        />
                                        <span
                                            className={`font-medium tracking-wide transition-all duration-300 relative z-10 ${!isSidebarOpen && 'opacity-0 hidden translate-x-10'
                                                }`}
                                        >
                                            {item.label}
                                        </span>

                                        {!isActive && isSidebarOpen && (
                                            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors duration-300" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 m-2 mt-0">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all duration-300 group ${!isSidebarOpen && 'justify-center px-2'
                            }`}
                    >
                        <LogOut size={20} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
                        <span className={`${!isSidebarOpen && 'hidden'} font-medium`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={toggleSidebar}></div>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isSidebarOpen ? 'md:ml-80' : 'md:ml-28'} mr-4`}>

                {/* Admin Top Bar */}
                <header
                    className={`h-24 sticky top-0 z-30 px-8 flex items-center justify-between transition-all duration-300 ${scrolled
                        ? 'bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md translate-y-2 rounded-2xl border border-white/20 shadow-sm'
                        : 'bg-transparent'
                        }`}
                >
                    {/* Left: Sidebar Toggle & Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-105 active:scale-95"
                        >
                            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center relative group">
                            <Search className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Type to search..."
                                className="pl-12 pr-6 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 w-64 text-sm transition-all text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
                            />
                        </div>

                        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                            {/* Notifications */}
                            <button className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors relative">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
                            </button>

                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

                            {/* Theme Toggle */}
                            <ThemeToggle />
                        </div>

                        {/* User Avatar */}
                        <div className="w-11 h-11 rounded-full p-0.5 premium-gradient cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20">
                            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-900">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                                    alt="Admin"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 flex-1 overflow-x-hidden relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
