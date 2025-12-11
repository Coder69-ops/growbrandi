import React, { useEffect, useState } from 'react';
import {
    FolderKanban,
    Users,
    Briefcase,
    TrendingUp,
    ArrowRight,
    Activity,
    Clock,
    CheckCircle2,
    Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { getLocalizedField } from '../../utils/localization';
import { useAuth } from '../../context/AuthContext';

interface DashboardActivity {
    id: string;
    type: 'project' | 'service' | 'message' | 'testimonial';
    title: string;
    timestamp: Date;
    details?: string;
}

const DashboardCard = ({ title, value, icon: Icon, color, trend, trendValue }: any) => (
    <div className="glass-card p-6 rounded-2xl group relative overflow-hidden">
        {/* Decorative background glow */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color} opacity-10 group-hover:scale-150 transition-transform duration-500 blur-2xl`} />

        <div className="flex items-start justify-between mb-4 relative z-10">
            <div className={`p-3.5 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${trend === 'up'
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    }`}>
                    {trend === 'up' ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingUp size={12} className="rotate-180" strokeWidth={3} />}
                    {trendValue}
                </div>
            )}
        </div>

        <div className="relative z-10">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                {value}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-0.5">{title}</p>
        </div>
    </div>
);

const QuickAction = ({ title, description, to, icon: Icon }: any) => (
    <Link
        to={to}
        className="glass-card p-5 rounded-2xl flex items-center gap-5 group hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300"
    >
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 group-hover:bg-blue-600 group-hover:text-white text-slate-500 dark:text-slate-400 transition-colors shadow-sm">
            <Icon size={22} />
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
                {description}
            </p>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-all group-hover:translate-x-1">
            <ArrowRight size={16} />
        </div>
    </Link>
);

const AdminDashboard = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState<{ name: string; role: string; image: string | null }>({
        name: (currentUser as any)?.displayName || currentUser?.email?.split('@')[0] || 'User',
        role: (currentUser as any)?.jobTitle || (currentUser as any)?.role || 'Admin',
        image: currentUser?.photoURL || null
    });

    const [counts, setCounts] = useState({
        projects: 0,
        services: 0,
        team: 0,
        testimonials: 0
    });
    const [activities, setActivities] = useState<DashboardActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Counts
                const [projectsSnap, servicesSnap, teamSnap, testimonialsSnap] = await Promise.all([
                    getDocs(collection(db, 'projects')),
                    getDocs(collection(db, 'services')),
                    getDocs(collection(db, 'team_members')),
                    getDocs(collection(db, 'testimonials'))
                ]);

                setCounts({
                    projects: projectsSnap.size,
                    services: servicesSnap.size,
                    team: teamSnap.size,
                    testimonials: testimonialsSnap.size
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

                        const emailMatch = teamEmail === userEmail;
                        const nameMatch = userName && teamName && teamName.includes(userName); // Loose name matching

                        return emailMatch || nameMatch;
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

                // Fetch Recent Activity
                // Messages
                const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(5));
                const messagesDocs = await getDocs(messagesQuery);
                const recentMessages = messagesDocs.docs.map(doc => ({
                    id: doc.id,
                    type: 'message' as const,
                    title: `New message from ${doc.data().name || 'Unknown'}`,
                    timestamp: doc.data().createdAt?.toDate() || new Date(),
                    details: doc.data().message
                }));

                // Projects
                let recentProjects: DashboardActivity[] = [];
                try {
                    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(5));
                    const projectsDocs = await getDocs(projectsQuery);
                    recentProjects = projectsDocs.docs.map(doc => ({
                        id: doc.id,
                        type: 'project' as const,
                        title: `Project Added: ${getLocalizedField(doc.data().title, 'en')}`,
                        timestamp: doc.data().createdAt?.toDate() || new Date(0),
                        details: getLocalizedField(doc.data().description, 'en')
                    }));
                } catch (e) { /* Silent fallback */ }

                // Services
                let recentServices: DashboardActivity[] = [];
                try {
                    const servicesQuery = query(collection(db, 'services'), orderBy('createdAt', 'desc'), limit(5));
                    const servicesDocs = await getDocs(servicesQuery);
                    recentServices = servicesDocs.docs.map(doc => ({
                        id: doc.id,
                        type: 'service' as const,
                        title: `Service Updated: ${getLocalizedField(doc.data().title, 'en')}`,
                        timestamp: doc.data().createdAt?.toDate() || new Date(0),
                        details: getLocalizedField(doc.data().description, 'en')
                    }));
                } catch (e) { /* Silent fallback */ }


                // Combine and Sort
                const allActivities = [...recentMessages, ...recentProjects, ...recentServices]
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 10);

                setActivities(allActivities);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [currentUser]);

    const stats = [
        {
            title: 'Total Projects',
            value: loading ? '...' : counts.projects,
            icon: FolderKanban,
            color: 'bg-indigo-500',
            trend: 'up',
            trendValue: 'Live'
        },
        {
            title: 'Active Services',
            value: loading ? '...' : counts.services,
            icon: Briefcase,
            color: 'bg-violet-500',
            trend: 'up',
            trendValue: 'Live'
        },
        {
            title: 'Team Members',
            value: loading ? '...' : counts.team,
            icon: Users,
            color: 'bg-fuchsia-500',
            trend: 'up',
            trendValue: 'Live'
        },
        {
            title: 'Testimonials',
            value: loading ? '...' : counts.testimonials,
            icon: Activity,
            color: 'bg-pink-500',
            trend: 'up',
            trendValue: 'Live'
        },
    ];

    const actions = [
        {
            title: 'Add New Project',
            description: 'Showcase your latest work',
            to: '/admin/projects',
            icon: FolderKanban
        },
        {
            title: 'Manage Team',
            description: 'Update member profiles',
            to: '/admin/team',
            icon: Users
        },
        {
            title: 'Update Services',
            description: 'Modify pricing details',
            to: '/admin/services',
            icon: Briefcase
        },
        {
            title: 'Site Content',
            description: 'Edit homepage text',
            to: '/admin/site-content',
            icon: Activity
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                        Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-light text-lg">
                        Welcome back, <span className="font-semibold text-blue-600 dark:text-blue-400">{userProfile.name}</span>!
                    </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm backdrop-blur-sm">
                    <Clock size={14} />
                    <span>Updated just now</span>
                </div>
            </div>

            {/* Profile / Status Card */}
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm p-1 border-2 border-white/50 shadow-inner">
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                                {userProfile.image ? (
                                    <img src={userProfile.image} alt={userProfile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold">{userProfile.name[0]?.toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider border border-white/10">
                                    {userProfile.role}
                                </span>
                            </div>
                            <p className="text-blue-100 flex items-center gap-2 opacity-90">
                                <Mail size={14} /> {currentUser?.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 w-full md:w-auto grid grid-cols-2 md:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                        <div>
                            <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Status</p>
                            <p className="font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_theme(colors.emerald.400)]"></span>
                                Active
                            </p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Permissions</p>
                            <p className="font-semibold">
                                {(currentUser as any)?.permissions?.length || 0} Enabled
                            </p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-xs uppercase tracking-wider mb-1">Last Login</p>
                            <p className="font-semibold">Just now</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <DashboardCard key={index} {...stat} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="glass-panel p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {actions.map((action, index) => (
                        <QuickAction key={index} {...action} />
                    ))}
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="glass-panel p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
                </div>
                <div className="space-y-4">
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <div key={activity.id} className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200/50 dark:hover:border-white/5 transition-all duration-300">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${activity.type === 'project' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' :
                                    activity.type === 'service' ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300' :
                                        activity.type === 'message' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300' :
                                            'bg-slate-100 text-slate-600'
                                    }`}>
                                    {activity.type === 'project' && <FolderKanban size={20} />}
                                    {activity.type === 'service' && <Briefcase size={20} />}
                                    {activity.type === 'message' && <Mail size={20} />}
                                    {activity.type === 'testimonial' && <Users size={20} />}
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-slate-900 dark:text-white truncate pr-4 text-base">
                                            {activity.title}
                                        </h4>
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize whitespace-nowrap">
                                            {activity.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                                        {activity.details || 'No details available'}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-medium">
                                        <Clock size={12} />
                                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                            <Activity size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No recent activity found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
