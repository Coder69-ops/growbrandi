import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import portal
import { X, Calendar, User, Briefcase, FileText, ChevronDown, Layout } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Task } from '../../hooks/useTasks'; // Import Task type
import { format } from 'date-fns';

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
    initialStatus?: 'todo' | 'in_progress' | 'review' | 'done';
    onSave: (taskData: any) => Promise<void>;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task, initialStatus = 'todo', onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>(initialStatus);
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [assigneeId, setAssigneeId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [dueDate, setDueDate] = useState('');

    const [projects, setProjects] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [saving, setSaving] = useState(false);

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
                    setDueDate(date.toISOString().split('T')[0]);
                } else {
                    setDueDate('');
                }
            } else {
                setTitle('');
                setDescription('');
                setStatus(initialStatus);
                setPriority('medium');
                setAssigneeId('');
                setProjectId('');
                setDueDate('');
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
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    // Use createPortal to mount the modal directly into document.body
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 isolate">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <Layout size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">
                            {task ? 'Edit Task' : 'Create New Task'}
                        </span>
                        {task && <span className="text-slate-300 dark:text-slate-700">/</span>}
                        {task && <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">#{task.id.slice(0, 5)}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <form id="task-form" onSubmit={handleSave} className="flex flex-col lg:flex-row min-h-full">

                        {/* Main Column (Left) */}
                        <div className="flex-1 p-6 lg:p-8 space-y-8 border-r border-slate-100 dark:border-slate-800">
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
                        </div>

                        {/* Sidebar (Right) */}
                        <div className="w-full lg:w-80 p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-900/50 space-y-8 flex flex-col shrink-0">

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
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};
