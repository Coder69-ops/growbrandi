import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore';

export type NotificationType = 'task_assigned' | 'task_updated' | 'task_comment' | 'system_alert' | 'mention';

export interface NotificationData {
    taskId?: string;
    projectId?: string;
    commentId?: string;
    url?: string;
    [key: string]: any;
}

export const NotificationService = {
    /**
     * Send a notification to a specific user
     */
    sendNotification: async (
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        data: NotificationData = {},
        senderId?: string
    ) => {
        try {
            await addDoc(collection(db, 'notifications'), {
                userId,
                type,
                title,
                message,
                data,
                senderId: senderId || 'system',
                read: false,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    },

    /**
     * Mark a notification as read
     */
    markAsRead: async (notificationId: string) => {
        try {
            const notifRef = doc(db, 'notifications', notificationId);
            await updateDoc(notifRef, {
                read: true
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    },

    /**
     * Mark all notifications as read for a user (Batch update could be better here but simple for now)
     * For now, we will handle this elsewhere or iterate if needed.
     */
};
