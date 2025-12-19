import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, orderBy, query, Timestamp, getDoc } from 'firebase/firestore';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { Mail, Trash2, CheckCircle, Clock, Search, ExternalLink, RefreshCw, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../../context/ToastContext';

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    service: string;
    message: string;
    createdAt?: Timestamp;
    read?: boolean;
    source?: string;
}

const AdminMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>({ views: 0, bookings: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'inquiries' | 'bookings'>('inquiries');
    const [filter, setFilter] = useState<'all' | 'unread'>('all'); // for inquiries
    const { showConfirm } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Inquiries
            const qMsgs = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            const msgsSnapshot = await getDocs(qMsgs);
            setMessages(msgsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[]);

            // 2. Fetch Bookings
            const qBookings = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
            const bookingsSnapshot = await getDocs(qBookings);
            setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // 3. Fetch Analytics
            const analyticsDoc = await getDoc(doc(db, 'analytics', 'free-growth-call'));
            if (analyticsDoc.exists()) {
                setAnalytics(analyticsDoc.data());
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id: string, collectionName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        showConfirm("Are you sure you want to delete this item?", async () => {
            try {
                await deleteDoc(doc(db, collectionName, id));
                if (collectionName === 'messages') {
                    setMessages(prev => prev.filter(m => m.id !== id));
                } else {
                    setBookings(prev => prev.filter(b => b.id !== id));
                }
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        });
    };

    const handleMarkAsRead = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await updateDoc(doc(db, 'messages', id), { read: !currentStatus });
            setMessages(messages.map(m => m.id === id ? { ...m, read: !currentStatus } : m));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Calculate Conversion Rate
    const conversionRate = analytics.views > 0
        ? ((analytics.bookings / analytics.views) * 100).toFixed(1)
        : "0.0";

    const filteredMessages = filter === 'all' ? messages : messages.filter(m => !m.read);

    return (
        <AdminPageLayout
            title="Inquiries & Bookings"
            description="Manage your growth call funnel and incoming messages"
            actions={
                <button
                    onClick={fetchData}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            }
        >
            {loading ? (
                <AdminLoader message="Loading dashboard..." />
            ) : (
                <div className="space-y-8 max-w-6xl mx-auto">
                    {/* Funnel Analytics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Search size={64} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Page Views</h3>
                            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{analytics.views}</div>
                            <p className="text-xs text-slate-400 mt-2">Free Growth Call Page</p>
                        </div>
                        <div className="glass-panel p-6 border-l-4 border-l-green-500 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <CheckCircle size={64} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Bookings</h3>
                            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{analytics.bookings}</div>
                            <p className="text-xs text-slate-400 mt-2">Confirmed via Success Page</p>
                        </div>
                        <div className="glass-panel p-6 border-l-4 border-l-purple-500 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ExternalLink size={64} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Conversion Rate</h3>
                            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{conversionRate}%</div>
                            <p className="text-xs text-slate-400 mt-2">Views to Bookings</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setActiveTab('inquiries')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'inquiries' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <Mail size={16} /> Inquiries <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs">{messages.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'bookings' ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            <Calendar size={16} /> Bookings <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-xs">{bookings.length}</span>
                        </button>
                    </div>

                    {/* Content Area */}
                    <div>
                        {activeTab === 'inquiries' && (
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <div className="flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                                        <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs font-bold rounded-md ${filter === 'all' ? 'bg-white dark:bg-slate-700 shadow text-black dark:text-white' : 'text-slate-500'}`}>All</button>
                                        <button onClick={() => setFilter('unread')} className={`px-3 py-1 text-xs font-bold rounded-md ${filter === 'unread' ? 'bg-white dark:bg-slate-700 shadow text-black dark:text-white' : 'text-slate-500'}`}>Unread</button>
                                    </div>
                                </div>

                                {filteredMessages.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400 italic">No inquiries found.</div>
                                ) : (
                                    filteredMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`glass-card p-0 transition-all cursor-pointer group hover:shadow-md ${!msg.read && 'border-l-4 border-l-blue-500'}`}
                                            onClick={(e) => handleMarkAsRead(msg.id, msg.read || false, e)}
                                        >
                                            <div className={`p-5 ${msg.read ? 'opacity-70' : 'bg-blue-50/10'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${msg.read ? 'bg-slate-300' : 'bg-blue-500'}`}>{msg.name.charAt(0)}</div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{msg.name}</h3>
                                                            <div className="text-xs text-slate-500">{msg.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-400">{msg.createdAt ? format(msg.createdAt.toDate(), 'MMM d, h:mm a') : ''}</span>
                                                        <button onClick={(e) => handleDelete(msg.id, 'messages', e)} className="p-1.5 text-slate-400 hover:text-red-500 rounded"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                                <div className="pl-13">
                                                    <p className="text-xs font-bold uppercase text-slate-500 mb-1">{msg.subject}</p>
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{msg.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="space-y-4">
                                {bookings.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400 italic">No bookings tracked yet.</div>
                                ) : (
                                    bookings.map((booking) => (
                                        <div key={booking.id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                                    <Calendar size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{booking.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                        <Mail size={14} /> {booking.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:items-end gap-1">
                                                {booking.date && (
                                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        <Clock size={16} className="text-blue-500" />
                                                        {new Date(booking.date).toLocaleString()}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <span>Tracked: {booking.createdAt ? format(booking.createdAt.toDate(), 'MMM d, h:mm a') : 'Recently'}</span>
                                                    <button onClick={(e) => handleDelete(booking.id, 'bookings', e)} className="text-red-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminMessages;
