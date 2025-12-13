import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { NotificationService } from '../services/notificationService';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high';
    assigneeId?: string;
    projectId?: string;
    dueDate?: any;
    order: number;
    createdAt?: any;
    updatedAt?: any;
    createdBy?: string;
}

export interface TaskActivity {
    id: string;
    taskId: string;
    userId: string;
    type: 'comment' | 'history';
    content: string;
    createdAt: any;
}

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const q = query(collection(db, 'tasks'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];
            // Sort by order
            tasksData.sort((a, b) => a.order - b.order);
            setTasks(tasksData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching tasks:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
        try {
            // Find max order in the specific status to append
            const tasksInStatus = tasks.filter(t => t.status === task.status);
            const maxOrder = tasksInStatus.length > 0 ? Math.max(...tasksInStatus.map(t => t.order)) : 0;

            const docRef = await addDoc(collection(db, 'tasks'), {
                ...task,
                order: maxOrder + 1,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                createdBy: currentUser?.uid || 'system'
            });

            // Log creation activity
            await addTaskActivity(docRef.id, 'history', 'Task created');

            // Notify Assignee
            if (task.assigneeId && task.assigneeId !== currentUser?.uid) {
                await NotificationService.sendNotification(
                    task.assigneeId,
                    'task_assigned',
                    'New Task Assigned',
                    `You have been assigned to task: ${task.title}`,
                    { taskId: docRef.id }
                );
            }

            return docRef.id;
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            const taskRef = doc(db, 'tasks', id);
            const currentTask = tasks.find(t => t.id === id);

            await updateDoc(taskRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });

            // Notifications & Activity Logging
            if (updates.assigneeId && updates.assigneeId !== currentTask?.assigneeId) {
                await addTaskActivity(id, 'history', `Assigned to user`); // Ideally we'd look up name, but simple for now
                if (updates.assigneeId !== currentUser?.uid) {
                    await NotificationService.sendNotification(
                        updates.assigneeId,
                        'task_assigned',
                        'Task Assigned',
                        `You have been assigned to task: ${currentTask?.title || 'Unknown Task'}`,
                        { taskId: id }
                    );
                }
            }

            if (updates.status && updates.status !== currentTask?.status) {
                await addTaskActivity(id, 'history', `Status changed to ${updates.status.replace('_', ' ')}`);
            }

        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'tasks', id));
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

    const addTaskActivity = async (taskId: string, type: 'comment' | 'history', content: string) => {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, 'task_activities'), {
                taskId,
                userId: currentUser.uid,
                type,
                content,
                createdAt: serverTimestamp()
            });

            if (type === 'comment') {
                // Determine who to notify? 
                // For now, maybe notify the assignee if I am not the assignee.
                const task = tasks.find(t => t.id === taskId);
                if (task && task.assigneeId && task.assigneeId !== currentUser.uid) {
                    await NotificationService.sendNotification(
                        task.assigneeId,
                        'task_comment',
                        'New Comment',
                        `New comment on task: ${task.title}`,
                        { taskId, comment: content },
                        currentUser.uid
                    );
                }
            }

        } catch (err) {
            console.error("Error adding activity:", err);
        }
    };

    const getTaskActivities = async (taskId: string) => {
        // This might be better as a real-time hook in the modal, but function here is useful too.
        // We will expose a query function or let the component use a hook.
        // For simplicity, let's keep it minimal here.
        return [];
    };

    const moveTask = async (taskId: string, newStatus: Task['status'], newIndex: number) => {
        // Find the task
        const taskToMove = tasks.find(t => t.id === taskId);
        if (!taskToMove) return;

        const oldStatus = taskToMove.status;
        const oldIndex = tasks.filter(t => t.status === oldStatus).findIndex(t => t.id === taskId);

        // Optimistic update (optional, but handled by snapshot usually fast enough)
        // If we want instant UI, we'd need local state manip before waiting for backend

        const batch = writeBatch(db);

        // 1. If status changed, update the task's status
        if (oldStatus !== newStatus) {
            batch.update(doc(db, 'tasks', taskId), { status: newStatus, order: newIndex, updatedAt: serverTimestamp() });

            // Reorder OLD column
            const oldConflicting = tasks.filter(t => t.status === oldStatus && t.id !== taskId);
            oldConflicting.sort((a, b) => a.order - b.order);
            oldConflicting.forEach((t, i) => {
                // only update if order is wrong implies specific logic, 
                // but easier to just reset orders for clarity or use fractional indexing.
                // For simplicity: simple integer reorder.
            });
            // Actually, simple reorder logic is complex with batches if we don't have all data.
            // Strategy: Just update the moved task, and maybe shift others?
            // Better Strategy for simple Kanban: Fractional Indexing or large gaps.
            // BUT, for this MVP, let's just update the target task. 
            // Order collisions are visually annoying but not fatal.

        } else {
            // Same column reorder
            batch.update(doc(db, 'tasks', taskId), { order: newIndex, updatedAt: serverTimestamp() });
        }

        // To properly implement reorder in Firestore without reading everything:
        // We typically read the target column, calculate new order, write.
        // For now, let's trust the UI provided index (from dnd library) is relative to the *loaded* tasks.

        // Actually, let's just update the single task for now. 
        // Real-time reordering with multiple users requires more robust logic (LexoRank).
        // We will implement a simple "update order" that relies on the UI sending the correct new order value.

        await updateTask(taskId, { status: newStatus, order: newIndex });
    };

    // Improved reorder function that takes the whole new list for a column
    const reorderColumn = async (columnId: string, orderedTasks: Task[]) => {
        const batch = writeBatch(db);
        orderedTasks.forEach((task, index) => {
            const ref = doc(db, 'tasks', task.id);
            batch.update(ref, { status: columnId as any, order: index });
        });
        await batch.commit();
    };

    return {
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        reorderColumn,
        addTaskActivity
    };
};
