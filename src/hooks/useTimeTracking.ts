import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export interface TimeEntry {
    id: string;
    userId: string;
    taskId?: string;
    projectId?: string;
    startTime: any; // Timestamp
    endTime?: any; // Timestamp | null
    description?: string;
    duration?: number; // in seconds
    isManual: boolean;
    createdAt: any;
}

export const useTimeTracking = () => {
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        // Subscribe to user's time entries, ordered by start time desc
        const q = query(
            collection(db, 'time_entries'),
            where('userId', '==', currentUser.uid),
            orderBy('startTime', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TimeEntry[];

            setTimeEntries(entries);

            // Find currently running entry (no endTime)
            const running = entries.find(e => !e.endTime);
            setActiveEntry(running || null);

            setLoading(false);
        }, (error) => {
            console.error("Error fetching time entries:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const startTimer = async (taskId?: string, projectId?: string, description?: string) => {
        if (!currentUser) return;
        if (activeEntry) {
            // Stop current timer first? Or block?
            // For now, let's auto-stop the previous one or throw error.
            // Let's safe-stop:
            await stopTimer();
        }

        try {
            await addDoc(collection(db, 'time_entries'), {
                userId: currentUser.uid,
                taskId: taskId || null,
                projectId: projectId || null,
                description: description || '',
                startTime: serverTimestamp(),
                endTime: null,
                isManual: false,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error starting timer:", error);
            throw error;
        }
    };

    const stopTimer = async () => {
        if (!activeEntry) return;

        try {
            const end = new Date();
            let duration = 0;

            // Calculate duration if we have a valid start time
            if (activeEntry.startTime) {
                const start = activeEntry.startTime.toDate ? activeEntry.startTime.toDate() : new Date(activeEntry.startTime.seconds * 1000);
                duration = Math.floor((end.getTime() - start.getTime()) / 1000);
            }

            await updateDoc(doc(db, 'time_entries', activeEntry.id), {
                endTime: serverTimestamp(),
                duration: duration
            });
        } catch (error) {
            console.error("Error stopping timer:", error);
            throw error;
        }
    };

    const logManualTime = async (entry: Omit<TimeEntry, 'id' | 'userId' | 'createdAt' | 'isManual'>) => {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, 'time_entries'), {
                ...entry,
                userId: currentUser.uid,
                isManual: true,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error logging manual time:", error);
            throw error;
        }
    };

    const updateEntry = async (id: string, updates: Partial<TimeEntry>) => {
        try {
            await updateDoc(doc(db, 'time_entries', id), updates);
        } catch (error) {
            console.error("Error updating time entry:", error);
            throw error;
        }
    };

    const deleteEntry = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'time_entries', id));
        } catch (error) {
            console.error("Error deleting time entry:", error);
            throw error;
        }
    };

    return {
        timeEntries,
        activeEntry,
        loading,
        startTimer,
        stopTimer,
        logManualTime,
        updateEntry,
        deleteEntry
    };
};
