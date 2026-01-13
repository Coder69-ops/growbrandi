import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { formatDistanceToNow } from 'date-fns';
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
    Mail,
    Shield,
    BookOpen,
    Target,
    History,
    Zap,
    MessageSquare,
    Kanban,
    Clock,
    Bot,
    Globe,
    Tag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { useChatNotifications } from '../../hooks/chat/useNotifications';
import { NotificationItem } from './NotificationItem';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Add Global Chat Notifications Hook
    const { unreadCount, notifications, markAsRead } = useChatNotifications();
    const { settings } = useSiteSettings();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const user = currentUser as any;
    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Admin';
    const role = user?.jobTitle || user?.role || 'Admin';
    const initials = displayName[0]?.toUpperCase() || 'A';

    const handleLogout = async () => {
        try {
            // Log logout action
            try {
                const { logAction } = await import('../../services/auditService');
                await logAction('logout', 'auth', 'User logged out', { user: currentUser?.email });
            } catch (err) {
                console.warn("Failed to log logout:", err);
            }

            // Set a flag in session storage so Login page knows we just logged out intentionally
            sessionStorage.setItem('logoutMessage', 'Successfully logged out');
            await signOut(auth);
            // ProtectedRoute will handle the redirect to /admin/login when currentUser becomes null
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const formatNotificationsTime = (timestamp: number) => {
        try {
            return formatDistanceToNow(timestamp, { addSuffix: true });
        } catch (e) {
            return 'recently';
        }
    };

    type MenuItem = {
        path: string;
        icon: any;
        label: string;
        permissions?: string[]; // Array of allowed permissions (OR logic)
        adminOnly?: boolean;
    };

    const menuGroups: { title: string; items: MenuItem[] }[] = [
        {
            title: 'Overview',
            items: [
                { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { path: '/admin/online-users', icon: Zap, label: 'Online Users', permissions: ['view_users', 'manage_settings'] },
            ]
        },
        {
            title: 'Content Management',
            items: [
                { path: '/admin/site-content', icon: FileText, label: 'Site Content', permissions: ['manage_content'] },
                { path: '/admin/pages', icon: FileText, label: 'Page Builder', permissions: ['manage_content'] },
                { path: '/admin/promotions', icon: Tag, label: 'Promotions', permissions: ['manage_content'] },
                { path: '/admin/free-growth-call', icon: Zap, label: 'Growth Call Page', permissions: ['manage_content'] },
                { path: '/admin/blog', icon: BookOpen, label: 'Blog', permissions: ['manage_blog', 'manage_content'] },
                { path: '/admin/projects', icon: FolderKanban, label: 'Projects', permissions: ['manage_projects', 'manage_content'] },
                { path: '/admin/services', icon: Briefcase, label: 'Services', permissions: ['manage_services', 'manage_content'] },
                { path: '/admin/jobs', icon: Target, label: 'Jobs', permissions: ['manage_jobs', 'manage_content'] },
                { path: '/admin/testimonials', icon: MessageSquareQuote, label: 'Testimonials', permissions: ['manage_testimonials', 'manage_content'] },
                { path: '/admin/faqs', icon: HelpCircle, label: 'FAQs', permissions: ['manage_faqs', 'manage_content'] },
                { path: '/admin/assets', icon: FolderKanban, label: 'Asset Library', permissions: ['manage_assets', 'manage_content'] },
                { path: '/admin/contact-settings', icon: Contact, label: 'Contact Info', permissions: ['manage_contact_info', 'manage_settings'] },
                { path: '/admin/settings', icon: Settings, label: 'Settings', permissions: ['manage_settings'] },
            ]
        },
        {
            title: 'Work & Team',
            items: [
                { path: '/admin/team', icon: Users, label: 'Team', permissions: ['manage_team_profiles', 'manage_settings'] },
                { path: '/admin/team-management', icon: Shield, label: 'Team Roles', permissions: ['manage_users'] },
                { path: '/admin/work', icon: Kanban, label: 'Work Board', permissions: ['manage_content'] },
                { path: '/admin/timesheet', icon: Clock, label: 'Time Tracking', permissions: ['manage_content'] },
            ]
        },
        {
            title: 'Communication',
            items: [
                { path: '/admin/messages', icon: Mail, label: 'Inquiries', permissions: ['view_messages'] },
                { path: '/admin/chat', icon: MessageSquare, label: 'Team Chat', permissions: ['access_chat', 'view_messages'] },
            ]
        },
        {
            title: 'System',
            items: [
                { path: '/admin/audit', icon: History, label: 'Audit Logs', permissions: ['view_logs', 'manage_settings'] },
                { path: '/admin/seo-settings', icon: Globe, label: 'SEO & Sitemap', permissions: ['manage_settings'] },
                { path: '/admin/ai-config', icon: Bot, label: 'AI Configuration', permissions: ['manage_ai', 'manage_settings'] },
                { path: '/admin/seed-data', icon: Database, label: 'Seed Data', permissions: ['manage_settings'], adminOnly: true },
            ]
        }
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={`flex bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white font-sans transition-colors duration-300 relative overflow-hidden ${location.pathname === '/admin/chat' ? 'h-screen' : 'min-h-screen'}`}>
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
                <div className="h-24 flex items-center justify-center border-b border-slate-100/50 dark:border-slate-800/50 px-6 shrink-0">
                    {isSidebarOpen ? (
                        <div className="flex flex-col items-center">
                            {/* Light Mode Logo */}
                            <img
                                src={settings?.branding?.logoLight || "/growbrandi-logo.png"}
                                alt="GrowBrandAI"
                                className="h-12 w-auto object-contain mb-1 block dark:hidden"
                            />
                            {/* Dark Mode Logo */}
                            <img
                                src={settings?.branding?.logoDark || "/growbrandi-logo.png"}
                                alt="GrowBrandAI"
                                className="h-12 w-auto object-contain mb-1 hidden dark:block"
                            />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-semibold">
                                Admin Console
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* Light Mode Logo (Collapsed) */}
                            <img
                                src={settings?.branding?.logoLight || "/growbrandi-logo.png"}
                                alt="GB"
                                className="w-10 h-10 object-contain block dark:hidden"
                            />
                            {/* Dark Mode Logo (Collapsed) */}
                            <img
                                src={settings?.branding?.logoDark || "/growbrandi-logo.png"}
                                alt="GB"
                                className="w-10 h-10 object-contain hidden dark:block"
                            />
                        </>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
                    <div className="space-y-6">
                        {menuGroups.map((group, groupIndex) => {
                            // Filter items based on permissions first
                            const filteredItems = group.items.filter(item => {
                                // Permission Check
                                const user = currentUser as any;
                                const isLegacyAdmin = !user?.role && !user?.permissions;
                                if (item.adminOnly && user?.role !== 'admin') return false;

                                // If no permissions required, allow
                                if (!item.permissions || item.permissions.length === 0) {
                                    return true;
                                }

                                // Check if user has ANY of the required permissions
                                // This provides the fallback logic (e.g. manage_content OR manage_blog)
                                const hasPermission =
                                    user?.role === 'admin' ||
                                    isLegacyAdmin ||
                                    (user?.permissions && item.permissions.some(p => user.permissions.includes(p)));

                                return hasPermission;
                            });

                            if (filteredItems.length === 0) return null;

                            return (
                                <div key={group.title || groupIndex}>
                                    {/* Group Title */}
                                    {isSidebarOpen && group.title && (
                                        <h3 className="px-4 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                            {group.title}
                                        </h3>
                                    )}

                                    {/* Group Divider for collapsed state if not first */}
                                    {!isSidebarOpen && groupIndex > 0 && (
                                        <div className="my-2 mx-auto w-8 h-px bg-slate-200 dark:bg-slate-700/50" />
                                    )}

                                    <ul className="space-y-1">
                                        {filteredItems.map((item) => {
                                            const isActive = location.pathname === item.path;
                                            return (
                                                <li key={item.path}>
                                                    <Link
                                                        to={item.path}
                                                        title={!isSidebarOpen ? item.label : undefined}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25'
                                                            : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400'
                                                            } ${!isSidebarOpen && 'justify-center px-0'}`}
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
                                </div>
                            );
                        })}
                    </div>
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
            <main className={`flex-1 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isSidebarOpen ? 'md:ml-80' : 'md:ml-28'} mr-4 ${location.pathname === '/admin/chat' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>

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

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                    {displayName}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                                    {role}
                                </span>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className={`p-2 rounded-full relative transition-all duration-200 ${isNotificationsOpen ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {isNotificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                                        <div className="absolute top-12 right-0 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                                                <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                                                <div className="flex gap-2 text-xs">
                                                    <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium">
                                                        {unreadCount} Unread
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {notifications.length === 0 ? (
                                                    <div className="p-8 text-center text-slate-400">
                                                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm">No notifications yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                        {notifications.map((notif: any) => (
                                                            <NotificationItem
                                                                key={notif.id}
                                                                notification={notif}
                                                                onClick={() => {
                                                                    setIsNotificationsOpen(false);
                                                                    if (notif.type === 'message') {
                                                                        navigate(`/admin/chat?channelId=${notif.channelId}`);
                                                                    } else {
                                                                        // Handle other types
                                                                        // For now, if it has a taskId, maybe navigate to work board?
                                                                        // But we don't have task deep linking yet.
                                                                        // Just mark as read for now.
                                                                    }
                                                                    markAsRead(notif.id, notif.type === 'message' ? 'message' : 'system');
                                                                }}
                                                                onMarkAsRead={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notif.id, notif.type === 'message' ? 'message' : 'system');
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-center">
                                                <Link
                                                    to="/admin/chat"
                                                    onClick={() => setIsNotificationsOpen(false)}
                                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                                                >
                                                    View All Messages
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User Avatar - Image or Initials */}
                            <Link to="/admin/profile" className="relative group cursor-pointer block">
                                {user?.photoURL ? (
                                    <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md hover:scale-105 transition-transform">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-800">
                                            <img
                                                src={user.photoURL}
                                                alt={displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800 transition-transform hover:scale-105">
                                        {initials}
                                    </button>
                                )}
                            </Link>

                            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className={`flex-1 overflow-x-hidden relative z-10 ${location.pathname === '/admin/chat' ? 'h-full overflow-hidden' : 'p-8 min-h-0'}`}>
                    <Outlet />
                </div>
            </main>
        </div >
    );
};

export default AdminLayout;
