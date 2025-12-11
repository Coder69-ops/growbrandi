import React from 'react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { Clock, Calendar, Play, Square, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const Timesheet = () => {
    const { timeEntries, loading, deleteEntry, activeEntry, stopTimer } = useTimeTracking();

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const getDuration = (entry: any) => {
        if (!entry.endTime) return 'Running...';

        // Use stored duration if available
        if (entry.duration !== undefined) {
            return formatDuration(entry.duration);
        }

        // Fallback calculation for old entries
        try {
            const start = entry.startTime.toDate ? entry.startTime.toDate() : new Date(entry.startTime.seconds * 1000);
            const end = entry.endTime.toDate ? entry.endTime.toDate() : new Date(entry.endTime.seconds * 1000);
            const diff = Math.floor((end.getTime() - start.getTime()) / 1000);
            return formatDuration(diff);
        } catch (e) {
            return '--';
        }
    };

    return (
        <AdminPageLayout
            title="Time Tracking"
            description="Manage your time entries and timesheets"
        >
            <div className="space-y-6">
                {/* Active Session Card */}
                {activeEntry && (
                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-full animate-pulse">
                                <Clock size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Active Session</h3>
                                <p className="text-blue-100">{activeEntry.description || 'No description'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => stopTimer()}
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                        >
                            <Square size={16} className="fill-current" /> Stop Timer
                        </button>
                    </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            <Calendar size={20} className="text-blue-500" /> Recent Activity
                        </h3>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-500">Loading entries...</div>
                    ) : timeEntries.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">No time entries found. Start a timer to get started!</div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {timeEntries.map((entry) => (
                                <div key={entry.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-10 rounded-full ${entry.endTime ? 'bg-slate-200 dark:bg-slate-600' : 'bg-green-500'}`} />
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {entry.description || 'General Work'}
                                                {!entry.endTime && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">LIVE</span>}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {entry.startTime?.toDate
                                                    ? format(entry.startTime.toDate(), 'MMM d, h:mm a')
                                                    : format(new Date(entry.startTime?.seconds * 1000), 'MMM d, h:mm a')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                            {getDuration(entry)}
                                        </span>
                                        <button
                                            onClick={() => deleteEntry(entry.id)}
                                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                                            title="Delete Entry"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminPageLayout>
    );
};

export default Timesheet;
