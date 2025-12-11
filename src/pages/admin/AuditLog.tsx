import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { Shield, Clock, Filter, Search } from 'lucide-react';

const AuditLog = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterModule, setFilterModule] = useState('all');

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // Fetch last 100 logs
                const q = query(
                    collection(db, 'audit_logs'),
                    orderBy('timestamp', 'desc'),
                    limit(100)
                );
                const snapshot = await getDocs(q);
                const logsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate()
                }));
                setLogs(logsData);
            } catch (error) {
                console.error("Error fetching audit logs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.performedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesModule = filterModule === 'all' || log.module === filterModule;
        return matchesSearch && matchesModule;
    });

    const getActionColor = (action: string) => {
        switch (action) {
            case 'create': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'update': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'delete': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    return (
        <AdminPageLayout
            title="Audit Logs"
            description="Track system activity and changes"
        >
            <div className="glass-panel p-6">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-slate-400" />
                        <select
                            value={filterModule}
                            onChange={(e) => setFilterModule(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                            <option value="all">All Modules</option>
                            <option value="blog">Blog</option>
                            <option value="services">Services</option>
                            <option value="site_content">Site Content</option>
                            <option value="settings">Settings</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <AdminLoader message="Loading logs..." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500">
                                    <th className="py-3 px-4">Action</th>
                                    <th className="py-3 px-4">Module</th>
                                    <th className="py-3 px-4">Description</th>
                                    <th className="py-3 px-4">User</th>
                                    <th className="py-3 px-4">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm">
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium capitalize">
                                            {log.module}
                                        </td>
                                        <td className="py-3 px-4 text-slate-900 dark:text-white">
                                            {log.description}
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">
                                            {log.performedBy}
                                        </td>
                                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                                            {log.timestamp?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">
                                            No logs found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminPageLayout>
    );
};

export default AuditLog;
