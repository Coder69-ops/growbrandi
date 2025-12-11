import React, { useState } from 'react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { useTasks, Task } from '../../hooks/useTasks';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Calendar, AlignLeft, CheckCircle2, Clock, Briefcase, Play, Square } from 'lucide-react';
import { format } from 'date-fns';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { TaskDetailsModal } from '../../components/admin/TaskDetailsModal';

const COLUMNS = {
    todo: { id: 'todo', label: 'To Do', color: 'bg-slate-500' },
    in_progress: { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
    review: { id: 'review', label: 'Review', color: 'bg-purple-500' },
    done: { id: 'done', label: 'Done', color: 'bg-emerald-500' }
};

const AdminTasks = () => {
    const { tasks, loading, addTask, updateTask, deleteTask, reorderColumn } = useTasks();
    const [isCreating, setIsCreating] = useState(false); // For inline quick create
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Modal State
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const { activeEntry, startTimer, stopTimer } = useTimeTracking();
    const [modalInitialStatus, setModalInitialStatus] = useState<'todo' | 'in_progress' | 'review' | 'done'>('todo');

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

        // Get tasks in source and dest columns
        const sourceTasks = tasks.filter(t => t.status === sourceColId);
        const destTasks = sourceColId === destColId ? sourceTasks : tasks.filter(t => t.status === destColId);

        if (sourceColId === destColId) {
            // Reordering within same column
            const newTasks = Array.from(sourceTasks);
            const [movedTask] = newTasks.splice(source.index, 1);
            if (!movedTask) return; // Safety check
            newTasks.splice(destination.index, 0, movedTask);
            reorderColumn(sourceColId, newTasks as Task[]);
        } else {
            // Moving between columns
            const sourceClone = Array.from(sourceTasks);
            const destClone = Array.from(destTasks);
            const [movedTask] = sourceClone.splice(source.index, 1);

            if (!movedTask) return; // Safety check

            // Update local task immediately for UI snap
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
            assigneeId: ''
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

    return (
        <AdminPageLayout
            title="Work Management"
            description="Track tasks and project progress"
            fullWidth
            noPadding
            actions={
                <button
                    onClick={() => openNewTaskModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={18} /> New Task
                </button>
            }
        >
            <div className="h-full flex flex-col bg-slate-100/50 dark:bg-slate-900/50">
                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <AdminLoader message="Loading board..." />
                    </div>
                ) : (
                    <>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                                <div className="h-full flex p-6 gap-6 min-w-[1000px]">
                                    {Object.values(COLUMNS).map(column => {
                                        const columnTasks = tasks.filter(t => t.status === column.id);

                                        return (
                                            <div key={column.id} className="flex flex-col w-80 shrink-0">
                                                {/* Column Header */}
                                                <div className="flex items-center justify-between mb-4 px-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-3 h-3 rounded-full ${column.color}`} />
                                                        <h3 className="font-bold text-slate-700 dark:text-slate-200">{column.label}</h3>
                                                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                                            {columnTasks.length}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => openNewTaskModal(column.id as any)}
                                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                {/* Droppable Area */}
                                                <Droppable droppableId={column.id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            className={`flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border-2 transition-colors overflow-y-auto custom-scrollbar ${snapshot.isDraggingOver
                                                                ? 'border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10'
                                                                : 'border-transparent'
                                                                }`}
                                                        >
                                                            {/* Quick Create in Todo */}
                                                            {column.id === 'todo' && isCreating && (
                                                                <form onSubmit={handleQuickCreate} className="mb-3">
                                                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-blue-500 ring-2 ring-blue-500/10">
                                                                        <input
                                                                            autoFocus
                                                                            type="text"
                                                                            className="w-full bg-transparent text-sm font-medium outline-none text-slate-900 dark:text-white placeholder-slate-400"
                                                                            placeholder="What needs to be done?"
                                                                            value={newTaskTitle}
                                                                            onChange={e => setNewTaskTitle(e.target.value)}
                                                                            onBlur={() => !newTaskTitle && setIsCreating(false)}
                                                                        />
                                                                        <div className="flex justify-end gap-2 mt-3">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setIsCreating(false)}
                                                                                className="text-xs px-2 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                type="submit"
                                                                                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                                            >
                                                                                Add
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            )}

                                                            {columnTasks.map((task, index) => (
                                                                // @ts-ignore
                                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            onClick={() => openEditTaskModal(task)}
                                                                            className={`group bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-3 hover:shadow-md transition-shadow relative cursor-pointer ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-blue-500/20 z-10' : ''
                                                                                }`}
                                                                            style={provided.draggableProps.style}
                                                                        >
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <div className="flex gap-2">
                                                                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                                                                        task.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                                                                                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                                                        }`}>
                                                                                        {task.priority}
                                                                                    </span>
                                                                                    {/* Timer Control */}
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            if (activeEntry?.taskId === task.id) {
                                                                                                stopTimer();
                                                                                            } else {
                                                                                                startTimer(task.id, task.projectId, task.title);
                                                                                            }
                                                                                        }}
                                                                                        className={`p-1 rounded transition-colors ${activeEntry?.taskId === task.id
                                                                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 animate-pulse'
                                                                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500'}`}
                                                                                        title={activeEntry?.taskId === task.id ? "Stop Timer" : "Start Timer"}
                                                                                    >
                                                                                        {activeEntry?.taskId === task.id ? (
                                                                                            <Square size={12} className="fill-current" />
                                                                                        ) : (
                                                                                            <Play size={12} className="fill-current" />
                                                                                        )}
                                                                                    </button>
                                                                                </div>

                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation(); // Prevent opening modal
                                                                                        deleteTask(task.id);
                                                                                    }}
                                                                                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-2 -mt-2"
                                                                                >
                                                                                    <div className="sr-only">Delete</div>
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                                                </button>
                                                                            </div>

                                                                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 leading-snug">
                                                                                {task.title}
                                                                            </h4>

                                                                            <div className="flex items-center justify-between text-slate-400">
                                                                                <div className="flex items-center gap-2 text-xs">
                                                                                    {task.assigneeId && (
                                                                                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold" title="Assigned">
                                                                                            <span className="text-[10px]">A</span>
                                                                                        </div>
                                                                                    )}
                                                                                    {task.description && <AlignLeft size={14} />}
                                                                                    {task.projectId && <Briefcase size={14} title="Linked to Project" />}
                                                                                    {column.id === 'done' && (
                                                                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                    {(task.dueDate) && (
                                                                                        <span className={`text-[10px] flex items-center gap-1 ${new Date(task.dueDate.toDate ? task.dueDate.toDate() : task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-500' : ''
                                                                                            }`}>
                                                                                            <Clock size={10} />
                                                                                            {format(task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate), 'MMM d')}
                                                                                        </span>
                                                                                    )}
                                                                                    {task.createdAt && !task.dueDate && (
                                                                                        <span className="text-[10px]">{format(task.createdAt.toDate ? task.createdAt.toDate() : new Date(), 'MMM d')}</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
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
