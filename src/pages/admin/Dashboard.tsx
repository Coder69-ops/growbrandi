import React, { useEffect, useState } from 'react';
import {
    FolderKanban,
    Users,
    Briefcase,
    TrendingUp,
    ArrowRight,
    Activity,
    Clock,
    Mail,
    FileText,
    CheckCircle2,
    Calendar,
    MessageSquare,
    ChevronUp,
    ChevronDown,
    Zap,
    Monitor,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatDistanceToNow, subDays, startOfDay, format } from 'date-fns';
import { getLocalizedField } from '../../utils/localization';
import { useAuth } from '../../context/AuthContext';
import { useOnlineUsers } from '../../hooks/usePresence';
import { motion } from 'framer-motion';

interface DashboardActivity {
    id: string;
    type: 'project' | 'service' | 'message' | 'testimonial' | 'blog' | 'job' | 'task';
    title: string;
    timestamp: Date;
    details?: string;
}

const DashboardCard = ({ title, value, icon: Icon, color, trend, trendValue, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="glass-card p-6 rounded-2xl group relative overflow-hidden"
    >
        {/* Decorative background glow */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color} opacity-10 group-hover:scale-150 transition-all duration-500 blur-2xl`} />

        <div className="flex items-start justify-between mb-4 relative z-10">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-black/5`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${trend === 'up'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    }`}>
                    {trend === 'up' ? <ChevronUp size={10} strokeWidth={3} /> : <ChevronDown size={10} strokeWidth={3} />}
                    {trendValue}
                </div>
            )}
        </div>

        <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-0.5 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                {value}
            </h3>
            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    </motion.div>
);

const ActivityChart = ({ data }: { data: { date: string, count: number }[] }) => {
    const maxCount = Math.max(...data.map(d => d.count), 5);
    const height = 100;
    const width = 400;
    const padding = 10;
    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * (width - 2 * padding) + padding,
        y: height - (d.count / maxCount) * (height - 2 * padding) - padding
    }));

    const pathData = points.length > 1
        ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
        : points.length === 1
            ? `M ${points[0].x} ${height} L ${points[0].x} ${points[0].y}`
            : `M ${padding} ${height / 2} L ${width - padding} ${height / 2}`;

    const areaData = points.length > 0
        ? pathData + ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
        : "";

    return (
        <div className="w-full h-32 relative group">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaData} fill="url(#chartGradient)" className="transition-all duration-1000" />
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    d={pathData}
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {points.map((p, i) => (
                    <motion.circle
                        key={i}
                        initial={{ r: 0 }}
                        animate={{ r: 3 }}
                        transition={{ delay: 1 + i * 0.1 }}
                        cx={p.x} cy={p.y}
                        fill="white"
                        className="stroke-blue-500 dark:stroke-blue-400 group-hover:r-4 transition-all duration-300"
                        strokeWidth="2"
                    >
                        <title>{data[i].date}: {data[i].count} activities</title>
                    </motion.circle>
                ))}
            </svg>
        </div>
    );
};

const QuickAction = ({ title, description, to, icon: Icon, delay = 0 }: any) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.3 }}
    >
        <Link
            to={to}
            className="glass-card p-4 rounded-xl flex items-center gap-4 group hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300"
        >
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-slate-500 dark:text-slate-400 transition-colors shadow-sm">
                <Icon size={18} />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                    {description}
                </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-all group-hover:translate-x-1">
                <ArrowRight size={14} />
            </div>
        </Link>
    </motion.div>
);

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const { onlineUsers } = useOnlineUsers();
    const [userProfile, setUserProfile] = useState<{ name: string; role: string; image: string | null }>({
        name: (currentUser as any)?.displayName || currentUser?.email?.split('@')[0] || 'User',
        role: (currentUser as any)?.jobTitle || (currentUser as any)?.role || 'Admin',
        image: currentUser?.photoURL || null
    });

    const [counts, setCounts] = useState({
        projects: 0,
        services: 0,
        team: 0,
        testimonials: 0,
        messages: 0,
        unreadMessages: 0,
        blogs: 0,
        jobs: 0,
        tasks: 0
    });

    const [activities, setActivities] = useState<DashboardActivity[]>([]);
    const [chartData, setChartData] = useState<{ date: string, count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Counts Parallelly
                const [
                    projectsSnap,
                    servicesSnap,
                    teamSnap,
                    testimonialsSnap,
                    messagesSnap,
                    unreadMessagesSnap,
                    blogsSnap,
                    jobsSnap,
                    tasksSnap
                ] = await Promise.all([
                    getDocs(collection(db, 'projects')),
                    getDocs(collection(db, 'services')),
                    getDocs(collection(db, 'team_members')),
                    getDocs(collection(db, 'testimonials')),
                    getDocs(collection(db, 'messages')),
                    getDocs(query(collection(db, 'messages'), where('read', '==', false))),
                    getDocs(collection(db, 'blog_posts')),
                    getDocs(collection(db, 'jobs')),
                    getDocs(collection(db, 'tasks'))
                ]);

                setCounts({
                    projects: projectsSnap.size,
                    services: servicesSnap.size,
                    team: teamSnap.size,
                    testimonials: testimonialsSnap.size,
                    messages: messagesSnap.size,
                    unreadMessages: unreadMessagesSnap.size,
                    blogs: blogsSnap.size,
                    jobs: jobsSnap.size,
                    tasks: tasksSnap.size
                });

                // Find matching team member for profile
                if (currentUser?.email) {
                    const normalize = (str: string) => str?.toLowerCase().trim() || '';
                    const userEmail = normalize(currentUser.email);
                    const userName = normalize((currentUser as any)?.displayName || '');

                    const matchingMember = teamSnap.docs.find(doc => {
                        const data = doc.data();
                        const teamEmail = normalize(data.social?.email);
                        const teamName = normalize(data.name);
                        return (teamEmail === userEmail) || (userName && teamName && teamName.includes(userName));
                    });

                    if (matchingMember) {
                        const data = matchingMember.data();
                        setUserProfile({
                            name: data.name || userProfile.name,
                            role: getLocalizedField(data.role, 'en') || userProfile.role,
                            image: data.image || userProfile.image
                        });
                    }
                }

                // Fetch Recent Activity Combined
                const recentMessages = messagesSnap.docs.slice(0, 5).map(doc => ({
                    id: doc.id,
                    type: 'message' as const,
                    title: `Message from ${doc.data().name || 'Unknown'}`,
                    timestamp: doc.data().createdAt?.toDate() || new Date(),
                    details: getLocalizedField(doc.data().subject, 'en')
                }));

                const recentBlogs = blogsSnap.docs.slice(0, 5).map(doc => ({
                    id: doc.id,
                    type: 'blog' as const,
                    title: `Blog Post: ${getLocalizedField(doc.data().title, 'en')}`,
                    timestamp: doc.data().createdAt?.toDate() || new Date(),
                    details: getLocalizedField(doc.data().category, 'en')
                }));

                const recentProjects = projectsSnap.docs.slice(0, 5).map(doc => ({
                    id: doc.id,
                    type: 'project' as const,
                    title: `Project: ${getLocalizedField(doc.data().title, 'en')}`,
                    timestamp: doc.data().createdAt?.toDate() || new Date(),
                    details: getLocalizedField(doc.data().client, 'en')
                }));

                const allActivities = [...recentMessages, ...recentBlogs, ...recentProjects]
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 10);

                setActivities(allActivities as DashboardActivity[]);

                // Process Chart Data (Last 7 Days)
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const date = subDays(new Date(), 6 - i);
                    return {
                        date: format(date, 'MMM d'),
                        count: 0,
                        rawDate: startOfDay(date).getTime()
                    };
                });

                allActivities.forEach(act => {
                    const actTime = startOfDay(act.timestamp).getTime();
                    const day = last7Days.find(d => d.rawDate === actTime);
                    if (day) day.count++;
                });

                setChartData(last7Days.map(({ date, count }) => ({ date, count })));

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    const statCards = [
        {
            title: 'Unread Messages',
            value: loading ? '...' : counts.unreadMessages,
            icon: MessageSquare,
            color: 'bg-rose-500',
            trend: counts.unreadMessages > 0 ? 'up' : null,
            trendValue: 'Attention'
        },
        {
            title: 'Live Users',
            value: onlineUsers.filter(u => u.state === 'online').length,
            icon: Monitor,
            color: 'bg-emerald-500',
            trend: 'up',
            trendValue: 'Active'
        },
        {
            title: 'Blog Posts',
            value: loading ? '...' : counts.blogs,
            icon: FileText,
            color: 'bg-blue-500',
            trend: 'up',
            trendValue: 'Growth'
        },
        {
            title: 'Pending Tasks',
            value: loading ? '...' : counts.tasks,
            icon: CheckCircle2,
            color: 'bg-amber-500',
            trend: counts.tasks > 5 ? 'up' : 'down',
            trendValue: 'Workflow'
        },
    ];

    const moreStats = [
        { title: 'Projects', value: counts.projects, icon: FolderKanban, color: 'text-indigo-500' },
        { title: 'Services', value: counts.services, icon: Briefcase, color: 'text-violet-500' },
        { title: 'Team', value: counts.team, icon: Users, color: 'text-sky-500' },
        { title: 'Jobs', value: counts.jobs, icon: Briefcase, color: 'text-orange-500' },
    ];

    const actions = [
        { title: 'New Blog Post', description: 'Create engaging content', to: '/admin/blog', icon: Sparkles },
        { title: 'Review Inquiries', description: 'Check unread messages', to: '/admin/messages', icon: Mail },
        { title: 'Manage Tasks', description: 'Update work progress', to: '/admin/tasks', icon: ListIcon },
        { title: 'Add Project', description: 'Showcase your work', to: '/admin/projects', icon: FolderKanban },
    ];

    return (
        <div className="space-y-6 lg:space-y-8 animate-fade-in relative z-10 pb-8">
            {/* Header Area */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Workspace
                        </h1>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                            Professional
                        </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Welcome back, <span className="text-blue-600 dark:text-blue-400 font-bold">{userProfile.name}</span>. Here's what's happening.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {onlineUsers.slice(0, 5).map(u => (
                            <div key={u.uid} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden shadow-sm" title={u.displayName}>
                                {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover" /> : <span className="text-[10px] font-bold text-white">{u.displayName?.[0]}</span>}
                            </div>
                        ))}
                        {onlineUsers.length > 5 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                +{onlineUsers.length - 5}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_theme(colors.emerald.400)]"></span>
                        {onlineUsers.length} Online
                    </div>
                </div>
            </motion.div>

            {/* Main Section Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* Left Column: Stats & Chart */}
                <div className="lg:col-span-8 space-y-6 lg:space-y-8">

                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {statCards.map((card, idx) => (
                            <DashboardCard key={idx} {...card} delay={idx * 0.1} />
                        ))}
                    </div>

                    {/* Activity Visualization */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel p-6 md:p-8 rounded-[2rem] overflow-hidden relative"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Activity className="text-blue-500" size={20} />
                                    Activity Trends
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Platform interactions across last 7 days</p>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Week View</span>
                                <Calendar size={14} className="text-slate-400" />
                            </div>
                        </div>

                        <ActivityChart data={chartData} />

                        <div className="mt-8 grid grid-cols-4 gap-2">
                            {moreStats.map((s, i) => (
                                <div key={i} className="text-center group cursor-pointer">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors uppercase">{s.title}</div>
                                    <div className={`text-lg font-black ${s.color} transition-all duration-300 group-hover:scale-110`}>{s.value}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Zap className="text-amber-500" size={18} />
                            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Recommended Actions</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {actions.map((action, idx) => (
                                <QuickAction key={idx} {...action} delay={0.6 + idx * 0.1} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity Feed */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 self-start">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-panel p-6 md:p-8 rounded-[2rem] h-full"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Log</h3>
                            <Link to="/admin/audit-log" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
                        </div>

                        <div className="space-y-6">
                            {activities.length > 0 ? (
                                activities.map((activity, idx) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 + idx * 0.05 }}
                                        className="relative pl-8 group"
                                    >
                                        {/* Connector Line */}
                                        {idx !== activities.length - 1 && (
                                            <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-slate-200 dark:bg-slate-800 group-hover:bg-blue-300 dark:group-hover:bg-blue-900 transition-colors"></div>
                                        )}

                                        {/* Timeline Dot */}
                                        <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-125 ${activity.type === 'message' ? 'bg-emerald-500' :
                                            activity.type === 'blog' ? 'bg-blue-500' :
                                                activity.type === 'project' ? 'bg-indigo-500' : 'bg-slate-400'
                                            }`}>
                                            {activity.type === 'message' && <Mail size={10} className="text-white" />}
                                            {activity.type === 'blog' && <FileText size={10} className="text-white" />}
                                            {activity.type === 'project' && <FolderKanban size={10} className="text-white" />}
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                                                    {activity.title}
                                                </h4>
                                                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                                                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium italic">
                                                "{activity.details || 'No additional details'}"
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                    <Activity size={48} className="mx-auto mb-3 opacity-10" />
                                    <p className="text-sm font-medium">System is quiet...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Simple Icon for Quick Actions
const ListIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

export default AdminDashboard;
