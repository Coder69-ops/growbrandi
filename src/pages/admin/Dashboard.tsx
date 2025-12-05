import React from 'react';
import {
    FolderKanban,
    Users,
    Briefcase,
    TrendingUp,
    ArrowRight,
    Activity,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES, PROJECTS, TEAM_MEMBERS } from '../../../constants';

const DashboardCard = ({ title, value, icon: Icon, color, trend, trendValue }: any) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm transition-all hover:shadow-md hover:border-blue-500/30 group">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend === 'up'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                    }`}>
                    {trend === 'up' ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                    {trendValue}
                </div>
            )}
        </div>

        <div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {value}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    </div>
);

const QuickAction = ({ title, description, to, icon: Icon }: any) => (
    <Link
        to={to}
        className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all group"
    >
        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-700 group-hover:bg-blue-500 group-hover:text-white text-slate-600 dark:text-slate-300 transition-colors">
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                {description}
            </p>
        </div>
        <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
    </Link>
);

const AdminDashboard = () => {
    const stats = [
        {
            title: 'Total Projects',
            value: PROJECTS.length,
            icon: FolderKanban,
            color: 'bg-blue-500',
            trend: 'up',
            trendValue: '+12%'
        },
        {
            title: 'Active Services',
            value: SERVICES.length,
            icon: Briefcase,
            color: 'bg-violet-500',
            trend: 'up',
            trendValue: '+5%'
        },
        {
            title: 'Team Members',
            value: TEAM_MEMBERS.length,
            icon: Users,
            color: 'bg-pink-500',
            trend: 'up',
            trendValue: '+2'
        },
        {
            title: 'Client Satisfaction',
            value: '4.9/5',
            icon: Activity,
            color: 'bg-emerald-500',
            trend: 'up',
            trendValue: '+0.2'
        },
    ];

    const actions = [
        {
            title: 'Add New Project',
            description: 'Showcase your latest work to the world',
            to: '/admin/projects',
            icon: FolderKanban
        },
        {
            title: 'Manage Team',
            description: 'Update member profiles and roles',
            to: '/admin/team',
            icon: Users
        },
        {
            title: 'Update Services',
            description: 'Modify pricing and service details',
            to: '/admin/services',
            icon: Briefcase
        },
        {
            title: 'Site Content',
            description: 'Edit homepage and global text',
            to: '/admin/site-content',
            icon: Activity
        }
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Welcome back! Here's what's happening today.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Clock size={16} />
                    <span>Last updated: just now</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <DashboardCard key={index} {...stat} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {actions.map((action, index) => (
                        <QuickAction key={index} {...action} />
                    ))}
                </div>
            </div>

            {/* Recent Activity Placeholder - Can be connected to real logs later */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 p-8 backdrop-blur-sm opacity-50 pointer-events-none">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">Coming Soon</span>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-slate-50 dark:bg-slate-800 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
