import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

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

            await addDoc(collection(db, 'tasks'), {
                ...task,
                order: maxOrder + 1,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                createdBy: currentUser?.uid || 'system'
            });
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            const taskRef = doc(db, 'tasks', id);
            await updateDoc(taskRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
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
        reorderColumn
    };
};
