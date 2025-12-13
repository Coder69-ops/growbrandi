import { useEffect, useState, useRef } from 'react';
import { database, db } from '../../lib/firebase';
import { ref, onValue, update, push, set, serverTimestamp } from 'firebase/database';
import { collection, query, where, getDocs, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { NotificationService } from '../../services/notificationService';

export const useChatNotifications = () => {
    const { currentUser } = useAuth();
    const { showNotification } = useToast();
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);
    const notifiedRef = useRef(new Set<string>());

    useEffect(() => {
        if (!currentUser) return;

        // --- 1. Chat Notifications (Realtime DB) ---
        const channelsRef = ref(database, 'channels');
        let chatNotifications: any[] = [];
        let systemNotifications: any[] = [];

        const updateCombinedNotifications = () => {
            const combined = [...chatNotifications, ...systemNotifications];
            // Sort by timestamp desc
            combined.sort((a, b) => {
                const timeA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : (a.timestamp || 0);
                const timeB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : (b.timestamp || 0);
                return timeB - timeA;
            });

            setNotifications(combined);
            // Count unread
            const unread = combined.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        };

        const unsubscribeChat = onValue(channelsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                chatNotifications = [];
                updateCombinedNotifications();
                return;
            }

            const tempNotifications: any[] = [];

            Object.entries(data).forEach(([channelId, channel]: [string, any]) => {
                const members = channel.members ? (Array.isArray(channel.members) ? channel.members : Object.values(channel.members)) : [];
                const isMember = channel.type === 'public' || members.includes(currentUser.uid);

                if (isMember && channel.lastMessage) {
                    const lastMsg = channel.lastMessage;
                    const lastSeen = channel.lastSeen?.[currentUser.uid] || 0;
                    const isRead = lastMsg.senderId === currentUser.uid || lastMsg.timestamp <= lastSeen;

                    tempNotifications.push({
                        id: channelId,
                        channelId: channelId,
                        title: channel.type === 'dm' ? (lastMsg.senderName || 'DM') : `#${channel.name}`,
                        message: lastMsg.text || (lastMsg.type === 'image' ? 'Sent an image' : 'New message'),
                        timestamp: lastMsg.timestamp,
                        senderName: lastMsg.senderName,
                        senderPhoto: lastMsg.senderPhoto,
                        isRead: isRead,
                        type: 'message'
                    });

                    // Toast Notification Logic
                    if (!isRead && lastMsg.senderId !== currentUser.uid) {
                        const msgId = lastMsg.id || `${channelId}-${lastMsg.timestamp}`;
                        if (Date.now() - lastMsg.timestamp < 10000 && !notifiedRef.current.has(msgId)) {
                            notifiedRef.current.add(msgId);
                            // Trigger Rich Notification (Simplified here, keeping core logic)
                            showNotification({
                                title: lastMsg.senderName || 'New Message',
                                message: lastMsg.text || 'Sent an image',
                                avatar: lastMsg.senderPhoto,
                            });
                        }
                    }
                }
            });

            chatNotifications = tempNotifications;
            updateCombinedNotifications();
        });

        // --- 2. System Notifications (Firestore) ---
        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', currentUser.uid),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribeSystem = onSnapshot(q, (snapshot) => {
            systemNotifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().createdAt?.toMillis ? doc.data().createdAt.toMillis() : Date.now(),
                isRead: doc.data().read
            }));
            updateCombinedNotifications();
        });

        return () => {
            unsubscribeChat();
            unsubscribeSystem();
        };
    }, [currentUser]);

    const markAsRead = async (notificationId: string, type: 'message' | 'system') => {
        if (type === 'system') {
            await NotificationService.markAsRead(notificationId);
        } else {
            // For chat, it's usually marked read when opening the channel, 
            // but we could implement specific logic here if needed.
            // Currently handled by ChatWindow opening.
        }
    };

    return { unreadCount, notifications, markAsRead };
};
