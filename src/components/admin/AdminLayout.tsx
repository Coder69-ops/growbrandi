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
    Bell
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
            await signOut(auth);
            navigate('/admin/login');
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
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-20'
                    } hidden md:flex flex-col shadow-2xl shadow-slate-200/50 dark:shadow-black/50`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/50 px-6">
                    {isSidebarOpen ? (
                        <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                            GrowBrandi
                        </div>
                    ) : (
                        <div className="font-bold text-2xl text-blue-600">G</div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                    <ul className="space-y-1.5">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                                ? 'bg-blue-600 shadow-lg shadow-blue-500/30 text-white'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <item.icon
                                            size={22}
                                            className={`transition-colors ${isActive ? 'text-white' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                }`}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        <span
                                            className={`font-medium tracking-wide transition-opacity duration-200 ${!isSidebarOpen && 'opacity-0 hidden'
                                                }`}
                                        >
                                            {item.label}
                                        </span>

                                        {isActive && isSidebarOpen && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50"></div>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors ${!isSidebarOpen && 'justify-center px-2'
                            }`}
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        <span className={`${!isSidebarOpen && 'hidden'} font-medium`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {!isSidebarOpen && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={toggleSidebar}></div>
            )}

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>

                {/* Admin Top Bar */}
                <header
                    className={`h-20 sticky top-0 z-30 px-8 flex items-center justify-between transition-all duration-300 ${scrolled
                            ? 'bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm'
                            : 'bg-transparent'
                        }`}
                >
                    {/* Left: Sidebar Toggle & Title */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isSidebarOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="hidden md:flex items-center relative group">
                            <Search className="absolute left-3 text-slate-400 group-hover:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 w-64 text-sm transition-all text-slate-900 dark:text-white placeholder-slate-400"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="p-2 relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0B1120]"></span>
                        </button>

                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 flex-1 overflow-x-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
