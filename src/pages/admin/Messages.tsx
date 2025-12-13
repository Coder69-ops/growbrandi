import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, orderBy, query, Timestamp } from 'firebase/firestore';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { Mail, Trash2, CheckCircle, Clock, Search, ExternalLink, RefreshCw } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { showConfirm } = useToast();

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[];
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        showConfirm("Are you sure you want to delete this message?", async () => {
            try {
                await deleteDoc(doc(db, 'messages', id));
                setMessages(prev => prev.filter(m => m.id !== id));
            } catch (error) {
                console.error("Error deleting message:", error);
            }
        });
    };

    const handleMarkAsRead = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await updateDoc(doc(db, 'messages', id), { read: !currentStatus });
            setMessages(messages.map(m => m.id === id ? { ...m, read: !currentStatus } : m));
        } catch (error) {
            console.error("Error updating message status:", error);
        }
    };

    const filteredMessages = filter === 'all'
        ? messages
        : messages.filter(m => !m.read);

    return (
        <AdminPageLayout
            title="Inquiries"
            description="View and manage inquiries from the contact form"
            actions={
                <div className="flex gap-3">
                    <button
                        onClick={fetchMessages}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Refresh Messages"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="flex p-1 rounded-xl glass-panel border-0 bg-slate-100/50 dark:bg-slate-800/50">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${filter === 'unread' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Unread
                        </button>
                    </div>
                </div>
            }
        >
            {loading ? (
                <AdminLoader message="Loading messages..." />
            ) : (
                <div className="space-y-4 max-w-5xl mx-auto">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-16 glass-panel border-dashed border-2 border-slate-300 dark:border-slate-700">
                            <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 text-slate-400">
                                <Mail size={40} className="opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No messages found</h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                {filter === 'unread' ? "You're all caught up! No unread messages." : "Your inbox is empty."}
                            </p>
                        </div>
                    ) : (
                        filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`glass-card p-0 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg cursor-pointer group ${!msg.read && 'border-l-4 border-l-blue-500'}`}
                                onClick={(e) => handleMarkAsRead(msg.id, msg.read || false, e)}
                            >
                                <div className={`p-6 ${msg.read ? 'opacity-75 hover:opacity-100' : 'bg-blue-50/10 dark:bg-blue-900/5'}`}>
                                    <div className="flex justify-between items-start mb-4 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${msg.read ? 'bg-slate-300 dark:bg-slate-700' : 'bg-gradient-to-br from-blue-500 to-cyan-500 ring-2 ring-blue-100 dark:ring-blue-900/30'}`}>
                                                {msg.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-bold text-slate-900 dark:text-white ${!msg.read && 'text-blue-600 dark:text-blue-400'}`}>
                                                    {msg.name}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                    <span className="truncate max-w-[200px]">{msg.email}</span>
                                                    {msg.source === 'auto-send' && (
                                                        <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                                                            Bot
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="hidden sm:flex text-xs text-slate-400 items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                                                <Clock size={12} />
                                                {msg.createdAt ? format(msg.createdAt.toDate(), 'MMM d, h:mm a') : 'Unknown'}
                                            </span>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                                                <button
                                                    onClick={(e) => handleMarkAsRead(msg.id, msg.read || false, e)}
                                                    className={`p-2 rounded-lg transition-colors ${msg.read ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' : 'text-slate-400 hover:text-blue-500 hover:bg-slate-100'}`}
                                                    title={msg.read ? "Mark as unread" : "Mark as read"}
                                                >
                                                    <CheckCircle size={18} className={msg.read ? "fill-blue-500 text-white" : ""} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(msg.id, e)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pl-16">
                                        <div className="mb-2 flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                                {msg.service}
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {msg.subject}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminMessages;
