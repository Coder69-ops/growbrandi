import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User, Briefcase, FileText, ChevronDown, Layout, Clock, MessageSquare, Send, CheckCircle, AlertCircle, Play, Square } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Task, useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
    initialStatus?: 'todo' | 'in_progress' | 'review' | 'done';
    onSave: (taskData: any) => Promise<void>;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task, initialStatus = 'todo', onSave }) => {
    const { currentUser } = useAuth();
    const { addTaskActivity } = useTasks();
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'time'>('overview');

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>(initialStatus);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [assigneeId, setAssigneeId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Data State
    const [projects, setProjects] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);

    // Activity & Time State
    const [activities, setActivities] = useState<any[]>([]);
    const [timeEntries, setTimeEntries] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (task) {
                setTitle(task.title);
                setDescription(task.description || '');
                setStatus(task.status);
                setPriority(task.priority);
                setAssigneeId(task.assigneeId || '');
                setProjectId(task.projectId || '');
                if (task.dueDate) {
                    const date = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
                    try {
                        setDueDate(date.toISOString().split('T')[0]);
                    } catch (e) {
                        setDueDate('');
                    }
                } else {
                    setDueDate('');
                }

                // Subscribe to Activities
                const qActivity = query(
                    collection(db, 'task_activities'),
                    where('taskId', '==', task.id),
                    orderBy('createdAt', 'desc')
                );
                const unsubActivity = onSnapshot(qActivity, (snap) => {
                    setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                });

                // Subscribe to Time Entries
                const qTime = query(
                    collection(db, 'time_entries'),
                    where('taskId', '==', task.id),
                    orderBy('startTime', 'desc')
                );
                const unsubTime = onSnapshot(qTime, (snap) => {
                    setTimeEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                });

                return () => {
                    unsubActivity();
                    unsubTime();
                };

            } else {
                setTitle('');
                setDescription('');
                setStatus(initialStatus);
                setPriority('medium');
                setAssigneeId('');
                setProjectId('');
                setDueDate('');
                setActivities([]);
                setTimeEntries([]);
            }
        }
    }, [isOpen, task, initialStatus]);

    const fetchData = async () => {
        if (projects.length > 0 && teamMembers.length > 0) return;
        setLoadingData(true);
        try {
            const [projectsSnap, teamSnap] = await Promise.all([
                getDocs(collection(db, 'projects')),
                getDocs(collection(db, 'team_members'))
            ]);

            setProjects(projectsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            setTeamMembers(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error("Error fetching dependencies:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSaving(true);
        try {
            await onSave({
                title,
                description,
                status,
                priority,
                assigneeId: assigneeId || null,
                projectId: projectId || null,
                dueDate: dueDate ? new Date(dueDate) : null,
            });
            if (!task) onClose(); // Only close on create, keep open on edit? Or close? Original closed.
            else onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !task) return;

        setIsSending(true);
        try {
            await addTaskActivity(task.id, 'comment', newComment);
            setNewComment('');
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSending(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const totalTime = timeEntries.reduce((acc, curr) => acc + (curr.duration || 0), 0);

    const getUser = (uid: string) => teamMembers.find(m => m.uid === uid) || { name: 'Unknown', photoURL: null };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 isolate">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                            {task ? <Layout size={18} /> : <Layout size={18} />}
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
                                {task ? 'Task Details' : 'New Task'}
                            </h2>
                            {task && <span className="text-xs font-mono text-slate-400">#{task.id.slice(0, 5)}</span>}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Tabs (Desktop) */}
                        <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mr-4">
                            {(['overview', 'activity', 'time'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === tab
                                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {tab === 'time' && totalTime > 0 && <span className="ml-1.5 opacity-60">{formatDuration(totalTime)}</span>}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900">
                        {/* Mobile Tabs */}
                        <div className="md:hidden flex border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                            {(['overview', 'activity', 'time'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 text-xs font-medium transition-all border-b-2 ${activeTab === tab
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-slate-500'
                                        }`}
                                >
                                    {tab.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'overview' && (
                            <form id="task-form" onSubmit={handleSave} className="p-6 lg:p-8 space-y-8">
                                <div className="space-y-6">
                                    <div>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="Task Title"
                                            className="w-full text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white bg-transparent border-none p-0 focus:ring-0 placeholder-slate-300 dark:placeholder-slate-600"
                                            autoFocus
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            <FileText size={16} /> Description
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            placeholder="Add a detailed description..."
                                            className="w-full min-h-[300px] p-4 text-base leading-relaxed rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y text-slate-700 dark:text-slate-300 placeholder-slate-400"
                                        />
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab === 'activity' && (
                            <div className="p-6 lg:p-8 space-y-6 h-full flex flex-col">
                                <div className="flex-1 space-y-6 overflow-y-auto">
                                    {activities.length === 0 ? (
                                        <div className="text-center text-slate-400 py-12">
                                            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No activity yet</p>
                                        </div>
                                    ) : (
                                        activities.map((activity) => {
                                            const user = getUser(activity.userId);
                                            return (
                                                <div key={activity.id} className="flex gap-4 group">
                                                    <div className="flex-shrink-0">
                                                        {user.photoURL ? (
                                                            <img src={user.photoURL} className="w-8 h-8 rounded-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                                                {user.name?.[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</span>
                                                            <span className="text-xs text-slate-400">
                                                                {activity.createdAt?.toMillis ? formatDistanceToNow(activity.createdAt.toMillis(), { addSuffix: true }) : 'just now'}
                                                            </span>
                                                        </div>
                                                        {activity.type === 'comment' ? (
                                                            <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-tr-xl rounded-br-xl rounded-bl-xl border border-slate-100 dark:border-slate-800">
                                                                {activity.content}
                                                            </div>
                                                        ) : (
                                                            <div className="text-xs text-slate-400 italic flex items-center gap-1.5">
                                                                <InfoIcon type={activity.content} />
                                                                {activity.content}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <form onSubmit={handlePostComment} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={e => setNewComment(e.target.value)}
                                            placeholder="Write a comment..."
                                            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim() || isSending}
                                            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'time' && (
                            <div className="p-6 lg:p-8 space-y-6">
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Time</p>
                                        <p className="text-2xl font-mono font-bold text-slate-800 dark:text-white mt-1">{formatDuration(totalTime)}</p>
                                    </div>
                                    <Clock size={32} className="text-blue-500 opacity-20" />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">Session History</h3>
                                    {timeEntries.length === 0 ? (
                                        <p className="text-sm text-slate-400 italic">No time recorded for this task.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {timeEntries.map((entry) => (
                                                <div key={entry.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500">
                                                            {getUser(entry.userId).name?.[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-700 dark:text-slate-300">{getUser(entry.userId).name}</p>
                                                            <p className="text-xs text-slate-400">
                                                                {entry.startTime?.toDate ? format(entry.startTime.toDate(), 'MMM d, h:mm a') : 'Unknown'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="font-mono font-medium text-slate-600 dark:text-slate-400">
                                                        {formatDuration(entry.duration || 0)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right) - Always visible on desktop, at bottom on mobile if overview */}
                    <div className={`w-full lg:w-80 p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900/50 space-y-8 flex flex-col shrink-0 border-l border-slate-100 dark:border-slate-800 ${activeTab !== 'overview' && 'hidden lg:flex'}`}>

                        {/* Status Section */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="review">Review</option>
                                    <option value="done">Done</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                            </div>
                        </div>

                        {/* Priority Section */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</label>
                            <div className="flex gap-2">
                                {(['low', 'medium', 'high'] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPriority(p)}
                                        className={`flex-1 py-2 px-1 text-xs font-bold rounded-lg uppercase tracking-wide border transition-all ${priority === p ?
                                            (p === 'high' ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' :
                                                p === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400' :
                                                    'bg-slate-200 border-slate-300 text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200')
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Details Group */}
                        <div className="space-y-5 pt-5 border-t border-slate-200 dark:border-slate-800">

                            {/* Assignee */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <User size={16} className="text-slate-400" /> Assignee
                                </label>
                                <div className="relative">
                                    <select
                                        value={assigneeId}
                                        onChange={(e) => setAssigneeId(e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                    >
                                        <option value="">Unassigned</option>
                                        {teamMembers.map(member => (
                                            <option key={member.id} value={member.id}>{member.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Due Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <Calendar size={16} className="text-slate-400" /> Due Date
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            {/* Project */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <Briefcase size={16} className="text-slate-400" /> Project
                                </label>
                                <div className="relative">
                                    <select
                                        value={projectId}
                                        onChange={(e) => setProjectId(e.target.value)}
                                        className="w-full appearance-none pl-3 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                                    >
                                        <option value="">No Project</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.title?.en || p.title || 'Untitled'}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1"></div>

                        {/* Actions */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                            <button
                                type="submit"
                                form="task-form"
                                disabled={saving}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Helper for Activity Icons
const InfoIcon = ({ type }: { type: string }) => {
    if (type.includes('Assigned')) return <User size={12} />;
    if (type.includes('Status')) return <CheckCircle size={12} />;
    if (type.includes('created')) return <AlertCircle size={12} />;
    return <InfoIcon type={''} />; // fallback fix
};
