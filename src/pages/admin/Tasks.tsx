import React, { useState, useMemo, useEffect } from 'react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { useTasks, Task } from '../../hooks/useTasks';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Clock, AlignLeft, Play, Square, Search, X, User as UserIcon, AlertTriangle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { TaskDetailsModal } from '../../components/admin/TaskDetailsModal';
import { useAuth } from '../../context/AuthContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const COLUMNS = {
    todo: {
        id: 'todo',
        label: 'To Do',
        color: 'bg-slate-500',
        textColor: 'text-slate-600 dark:text-slate-400',
        borderColor: 'border-slate-200 dark:border-slate-700'
    },
    in_progress: {
        id: 'in_progress',
        label: 'In Progress',
        color: 'bg-blue-500',
        textColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-900/50'
    },
    review: {
        id: 'review',
        label: 'Review',
        color: 'bg-indigo-500',
        textColor: 'text-indigo-600 dark:text-indigo-400',
        borderColor: 'border-indigo-200 dark:border-indigo-900/50'
    },
    done: {
        id: 'done',
        label: 'Done',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-900/50'
    }
};

const PriorityBadge = ({ priority }: { priority: string }) => {
    switch (priority) {
        case 'high':
            return <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />;
        case 'medium':
            return <div className="h-2 w-2 rounded-full bg-amber-500" />;
        default:
            return <div className="h-2 w-2 rounded-full bg-slate-400" />;
    }
};

const AdminTasks = () => {
    const { tasks, loading, addTask, updateTask, deleteTask, reorderColumn } = useTasks();
    const { currentUser } = useAuth();
    const [isCreating, setIsCreating] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMyTasks, setFilterMyTasks] = useState(false);

    // Modal State
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const { activeEntry, startTimer, stopTimer } = useTimeTracking();
    const [modalInitialStatus, setModalInitialStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');

    // Time Tracking Aggregation
    const [taskDurations, setTaskDurations] = useState<Record<string, number>>({});

    useEffect(() => {
        const q = query(collection(db, 'time_entries'));
        const unsub = onSnapshot(q, (snap) => {
            const durations: Record<string, number> = {};
            snap.docs.forEach(doc => {
                const data = doc.data();
                if (data.taskId) {
                    durations[data.taskId] = (durations[data.taskId] || 0) + (data.duration || 0);
                }
            });
            setTaskDurations(durations);
        });
        return () => unsub();
    }, []);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h${m > 0 ? ` ${m}m` : ''}`;
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesUser = filterMyTasks ? t.assigneeId === currentUser?.uid : true;
            return matchesSearch && matchesUser;
        });
    }, [tasks, searchQuery, filterMyTasks, currentUser]);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceColId = source.droppableId as keyof typeof COLUMNS;
        const destColId = destination.droppableId as keyof typeof COLUMNS;

        // Simpler approach: Disable DnD if filtered
        if (searchQuery || filterMyTasks) return;

        const sourceTasks = tasks.filter(t => t.status === sourceColId);
        const destTasks = sourceColId === destColId ? sourceTasks : tasks.filter(t => t.status === destColId);

        if (sourceColId === destColId) {
            const newTasks = Array.from(sourceTasks);
            const [movedTask] = newTasks.splice(source.index, 1);
            if (!movedTask) return;
            newTasks.splice(destination.index, 0, movedTask);
            reorderColumn(sourceColId, newTasks as Task[]);
        } else {
            const sourceClone = Array.from(sourceTasks);
            const destClone = Array.from(destTasks);
            const [movedTask] = sourceClone.splice(source.index, 1);

            if (!movedTask) return;

            const updatedTask: Task = { ...(movedTask as Task), status: destColId };
            destClone.splice(destination.index, 0, updatedTask);

            reorderColumn(destColId, destClone as Task[]);
            reorderColumn(sourceColId, sourceClone as Task[]);
        }
    };

    const handleQuickCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        await addTask({
            title: newTaskTitle,
            status: 'todo',
            priority: 'medium',
            description: '',
            assigneeId: currentUser?.uid || ''
        });
        setNewTaskTitle('');
        setIsCreating(false);
    };

    const openNewTaskModal = (status: 'todo' | 'in_progress' | 'review' | 'done' = 'todo') => {
        setSelectedTask(null);
        setModalInitialStatus(status);
        setIsTaskModalOpen(true);
    };

    const openEditTaskModal = (task: Task) => {
        setSelectedTask(task);
        setModalInitialStatus(task.status);
        setIsTaskModalOpen(true);
    };

    const onSaveTask = async (taskData: any) => {
        try {
            if (selectedTask) {
                await updateTask(selectedTask.id, taskData);
            } else {
                await addTask(taskData);
            }
            setIsTaskModalOpen(false);
        } catch (error) {
            console.error("Failed to save task", error);
        }
    };

    // Header Actions Component
    const HeaderActions = () => (
        <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-32 md:w-48 transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* My Tasks Filter */}
            <button
                onClick={() => setFilterMyTasks(!filterMyTasks)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${filterMyTasks
                    ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
                title="Filter My Tasks"
            >
                <UserIcon size={16} />
                <span className="hidden lg:inline">My Tasks</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            <button
                onClick={() => openNewTaskModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm font-medium"
            >
                <Plus size={18} />
                <span className="hidden sm:inline">New Task</span>
            </button>
        </div>
    );

    return (
        <AdminPageLayout
            title="Work Board"
            description="Manage your team's tasks and project progress"
            fullWidth
            fullHeight
            noPadding
            actions={<HeaderActions />}
        >
            <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {loading ? (
                    <div className="h-full flex items-center justify-center relative z-10">
                        <AdminLoader message="Loading your board..." />
                    </div>
                ) : (
                    <>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative z-10">
                                <div className="h-full flex px-4 py-4 gap-4 min-w-full">
                                    {Object.values(COLUMNS).map(column => {
                                        const columnTasks = filteredTasks.filter(t => t.status === column.id);

                                        return (
                                            <div key={column.id} className="flex flex-col flex-1 min-w-[280px] max-w-[400px] shrink-0 h-full">
                                                {/* Column Header */}
                                                <div className={`flex items-center justify-between mb-3 p-3 rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm ${column.borderColor}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${column.color} bg-opacity-10 dark:bg-opacity-20`}>
                                                            <div className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm whitespace-nowrap">{column.label}</h3>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                                {columnTasks.length} {columnTasks.length === 1 ? 'Task' : 'Tasks'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => openNewTaskModal(column.id as any)}
                                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                {/* Droppable Area */}
                                                <Droppable droppableId={column.id} isDropDisabled={!!searchQuery || filterMyTasks}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            className={`flex-1 rounded-2xl p-2 transition-all overflow-y-auto custom-scrollbar flex flex-col gap-3 ${snapshot.isDraggingOver
                                                                ? 'bg-blue-50/50 dark:bg-blue-900/10 ring-2 ring-blue-500/20 border-blue-200 dark:border-blue-800'
                                                                : 'bg-transparent'
                                                                }`}
                                                        >
                                                            {/* Quick Create in Todo */}
                                                            {column.id === 'todo' && isCreating && !searchQuery && !filterMyTasks && (
                                                                <form onSubmit={handleQuickCreate} className="mb-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-blue-500 ring-4 ring-blue-500/5">
                                                                        <input
                                                                            autoFocus
                                                                            type="text"
                                                                            className="w-full bg-transparent text-sm font-medium outline-none text-slate-900 dark:text-white placeholder-slate-400 mb-3"
                                                                            placeholder="What needs to be done?"
                                                                            value={newTaskTitle}
                                                                            onChange={e => setNewTaskTitle(e.target.value)}
                                                                            onBlur={() => !newTaskTitle && setIsCreating(false)}
                                                                        />
                                                                        <div className="flex justify-end gap-2">
                                                                            <button
                                                                                type="button"
                                                                                onMouseDown={() => setIsCreating(false)}
                                                                                className="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                type="submit"
                                                                                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                                                                            >
                                                                                Add Card
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            )}

                                                            {columnTasks.map((task, index) => {
                                                                const isOverdue = task.dueDate && new Date(task.dueDate.toDate ? task.dueDate.toDate() : task.dueDate) < new Date() && task.status !== 'done';
                                                                const totalTime = taskDurations[task.id] || 0;

                                                                return (
                                                                    // @ts-ignore
                                                                    <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={!!searchQuery || filterMyTasks}>
                                                                        {(provided, snapshot) => (
                                                                            <div
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                onClick={() => openEditTaskModal(task)}
                                                                                className={`group bg-white dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md transition-all relative cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'rotate-2 shadow-2xl ring-2 ring-blue-500/20 z-10 scale-105' : ''
                                                                                    }`}
                                                                                style={provided.draggableProps.style}
                                                                            >
                                                                                {/* Priority & Timer Header */}
                                                                                <div className="flex justify-between items-center mb-3">
                                                                                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800`}>
                                                                                        <PriorityBadge priority={task.priority} />
                                                                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                                                            {task.priority}
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                if (activeEntry?.taskId === task.id) {
                                                                                                    stopTimer();
                                                                                                } else {
                                                                                                    startTimer(task.id, task.projectId, task.title);
                                                                                                }
                                                                                            }}
                                                                                            className={`p-1.5 rounded-lg transition-colors ${activeEntry?.taskId === task.id
                                                                                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                                                                                                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600'}`}
                                                                                            title="Timer"
                                                                                        >
                                                                                            {activeEntry?.taskId === task.id ? (
                                                                                                <Square size={14} className="fill-current animate-pulse" />
                                                                                            ) : (
                                                                                                <Play size={14} className="fill-current" />
                                                                                            )}
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                deleteTask(task.id);
                                                                                            }}
                                                                                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                                                                                        >
                                                                                            <div className="sr-only">Delete</div>
                                                                                            <X size={14} />
                                                                                        </button>
                                                                                    </div>
                                                                                </div>

                                                                                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 leading-snug line-clamp-2">
                                                                                    {task.title}
                                                                                    {isOverdue && (
                                                                                        <span className="inline-block ml-2 text-red-500" title="Overdue">
                                                                                            <AlertTriangle size={12} className="inline" />
                                                                                        </span>
                                                                                    )}
                                                                                </h4>

                                                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                                                                    <div className="flex -space-x-2">
                                                                                        {task.assigneeId ? (
                                                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 mx-0.5" title="Assignee">
                                                                                                A
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-white dark:border-slate-800 mx-0.5 border-dashed">
                                                                                                <span className="sr-only">Unassigned</span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="flex items-center gap-3 text-slate-400">
                                                                                        {/* Time Spent */}
                                                                                        {totalTime > 0 && (
                                                                                            <div className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-medium text-slate-500 dark:text-slate-400">
                                                                                                <Clock size={10} />
                                                                                                {formatDuration(totalTime)}
                                                                                            </div>
                                                                                        )}

                                                                                        {task.description && <AlignLeft size={14} className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors" />}

                                                                                        {(task.dueDate) && (
                                                                                            <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${isOverdue
                                                                                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20'
                                                                                                : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                                                                                }`}>
                                                                                                <Calendar size={10} />
                                                                                                {format(task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate), 'MMM d')}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                );
                                                            })}

                                                            {provided.placeholder}

                                                            {columnTasks.length === 0 && (
                                                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                                                                    <div className={`p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-3 grayscale opacity-30`}>
                                                                        <div className={`w-8 h-8 rounded-full ${column.color} opacity-50`} />
                                                                    </div>
                                                                    <p className="text-sm font-medium opacity-50">
                                                                        {searchQuery ? 'No matching tasks' : 'No tasks'}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </DragDropContext>

                        <TaskDetailsModal
                            isOpen={isTaskModalOpen}
                            onClose={() => setIsTaskModalOpen(false)}
                            task={selectedTask || undefined}
                            initialStatus={modalInitialStatus}
                            onSave={onSaveTask}
                        />
                    </>
                )}
            </div>
        </AdminPageLayout>
    );
};

export default AdminTasks;
