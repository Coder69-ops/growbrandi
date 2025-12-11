import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Briefcase, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
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
                // Handle dueDate. If it's a timestamp, convert to YYYY-MM-DD
                if (task.dueDate) {
                    // Check if it's a Firestore Timestamp (has toDate)
                    const date = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
                    setDueDate(date.toISOString().split('T')[0]);
                } else {
                    setDueDate('');
                }
            } else {
                // Reset form for new task
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
                getDocs(collection(db, 'team_members')) // Adjust collection name if different
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
                dueDate: dueDate ? new Date(dueDate) : null, // Store as Date object or Timestamp logic upstream
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {task ? <Edit2Icon /> : <PlusIcon />}
                        {task ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6 flex-1">
                    <div>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full text-2xl font-bold bg-transparent border-0 border-b-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-0 px-0 py-2 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white transition-colors"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status & Priority */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="review">Review</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                    {(['low', 'medium', 'high'] as const).map((p) => (
                                        <button
                                            type="button"
                                            key={p}
                                            onClick={() => setPriority(p)}
                                            className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${priority === p
                                                    ? p === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 shadow-sm'
                                                        : p === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 shadow-sm'
                                                            : 'bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Assignee & Due Date */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                                    <User size={14} /> Assignee
                                </label>
                                <select
                                    value={assigneeId}
                                    onChange={(e) => setAssigneeId(e.target.value)}
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500"
                                >
                                    <option value="">Unassigned</option>
                                    {loadingData ? <option disabled>Loading...</option> : teamMembers.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                                    <Calendar size={14} /> Due Date
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Project Link */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                            <Briefcase size={14} /> Link to Project
                        </label>
                        <select
                            value={projectId}
                            onChange={(e) => setProjectId(e.target.value)}
                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500"
                        >
                            <option value="">No Project</option>
                            {loadingData ? <option disabled>Loading...</option> : projects.map(p => (
                                <option key={p.id} value={p.id}>{p.title?.en || p.title || 'Untitled Project'}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
                            <FileText size={14} /> Description
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                            className="w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500"
                            placeholder="Add more details about this task..."
                        />
                    </div>
                </form>

                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 sticky bottom-0 z-10 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple icons for header
const Edit2Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
);
