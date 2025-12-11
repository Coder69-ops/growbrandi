import React, { useState, useEffect } from 'react';
import { useOnlineUsers } from '../../hooks/usePresence';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { User, Mail, Clock, Monitor, Search, Filter, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getLocalizedField } from '../../utils/localization';

interface EnrichedUser {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    last_changed?: Date;
    state?: string;
    role?: string;
    teamId?: string;
}

const OnlineUsers = () => {
    const { onlineUsers, loading: presenceLoading } = useOnlineUsers();
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [enrichedUsers, setEnrichedUsers] = useState<EnrichedUser[]>([]);

    // Fetch team members to get roles
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const snap = await getDocs(collection(db, 'team_members'));
                const members = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTeamMembers(members);
            } catch (error) {
                console.error("Error fetching team:", error);
            } finally {
                setLoadingTeam(false);
            }
        };
        fetchTeam();
    }, []);

    // Combine presence data with team data
    useEffect(() => {
        if (presenceLoading || loadingTeam) return;

        const combined = onlineUsers.map(user => {
            const normalize = (str: string) => str?.toLowerCase().trim() || '';
            const userEmail = normalize(user.email);
            const userName = normalize(user.displayName);

            // Robust matching similar to Dashboard
            const matchedMember = teamMembers.find(member => {
                const teamEmail = normalize(member.social?.email);
                const teamName = normalize(member.name);
                return (teamEmail && teamEmail === userEmail) || (userName && teamName && teamName.includes(userName));
            });

            return {
                ...user,
                role: matchedMember ? getLocalizedField(matchedMember.role, 'en') : 'Guest',
                photoURL: matchedMember?.image || user.photoURL, // Prefer team image
                displayName: matchedMember?.name || user.displayName // Prefer team name
            };
        });

        setEnrichedUsers(combined);
    }, [onlineUsers, teamMembers, presenceLoading, loadingTeam]);

    const filteredUsers = enrichedUsers.filter(user =>
        user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isLoading = presenceLoading || loadingTeam;

    return (
        <AdminPageLayout
            title="Online Users"
            description="Realtime view of currently active team members"
        >
            {isLoading ? (
                <AdminLoader message="Syncing workspace..." />
            ) : (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 flex items-center gap-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-emerald-500/20 blur-2xl"></div>
                            <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm relative z-10">
                                <Monitor size={24} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Sessions</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{onlineUsers.length}</h3>
                                    <span className="flex h-2.5 w-2.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-xl">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or role..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Live Updates
                            </div>
                        </div>
                    </div>

                    {/* Users Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <div key={user.uid} className="glass-panel p-6 flex flex-col gap-5 group hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden">
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="flex items-start justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {user.photoURL ? (
                                                    <img
                                                        src={user.photoURL}
                                                        alt={user.displayName}
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold border-2 border-slate-200 dark:border-slate-700 p-0.5">
                                                        {user.displayName?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse ring-2 ring-emerald-500/20"></div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                    {user.displayName || 'Unknown User'}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                                                        {user.role || 'Guest'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3 relative z-10">
                                        <div className="flex items-center justify-between text-sm group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <Mail size={14} />
                                                <span className="truncate max-w-[180px]">{user.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                                <Clock size={14} />
                                                <span>
                                                    Active {user.last_changed ? formatDistanceToNow(user.last_changed, { addSuffix: true }) : 'now'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <User size={48} className="mx-auto mb-4 opacity-30" />
                                <p className="font-medium text-lg">No matching users found.</p>
                                <p className="text-sm mt-1 opacity-70">Try adjusting your search terms.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminPageLayout>
    );
};

export default OnlineUsers;
