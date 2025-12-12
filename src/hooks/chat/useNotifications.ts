import { useEffect, useState, useRef } from 'react';
import { database, db } from '../../lib/firebase';
import { ref, onValue, update, push, set, serverTimestamp } from 'firebase/database';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const useChatNotifications = () => {
    const { currentUser } = useAuth();
    const { showNotification } = useToast();
    const [unreadCount, setUnreadCount] = useState(0);
    const notifiedRef = useRef(new Set<string>());

    useEffect(() => {
        if (!currentUser) return;

        const channelsRef = ref(database, 'channels');

        const unsubscribe = onValue(channelsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            let count = 0;

            Object.entries(data).forEach(([channelId, channel]: [string, any]) => {
                // Normalize members
                const members = channel.members ? (Array.isArray(channel.members) ? channel.members : Object.values(channel.members)) : [];

                // Check if user is member
                const isMember = channel.type === 'public' || members.includes(currentUser.uid);

                if (isMember && channel.lastMessage) {
                    const lastMsg = channel.lastMessage;
                    const lastSeen = channel.lastSeen?.[currentUser.uid] || 0;

                    // 1. Check Unread Count
                    if (lastMsg.senderId !== currentUser.uid && lastMsg.timestamp > lastSeen) {
                        count++;

                        // Rich Notification Trigger
                        // logic: < 5s old AND not notified
                        const msgId = lastMsg.id || `${channelId}-${lastMsg.timestamp}`;

                        if (Date.now() - lastMsg.timestamp < 10000 && !notifiedRef.current.has(msgId)) {
                            // Mark as notified immediately to prevent double-fire
                            notifiedRef.current.add(msgId);

                            const triggerNotification = async () => {
                                let avatar = '';
                                let role = '';
                                const senderName = lastMsg.senderName || 'Someone';

                                try {
                                    // Query Firestore for user with matching UID
                                    // The doc ID might not be the UID, so we query by the 'uid' field
                                    const q = query(collection(db, 'team_members'), where('uid', '==', lastMsg.senderId));
                                    const querySnapshot = await getDocs(q);

                                    if (!querySnapshot.empty) {
                                        const userData = querySnapshot.docs[0].data();
                                        avatar = userData.image || userData.photoURL || '';
                                        const r = userData.role;
                                        role = typeof r === 'object' ? (r.en || Object.values(r)[0]) : r;
                                    }
                                } catch (err) {
                                    console.error("Error fetching notification user data", err);
                                }

                                // Show Rich Notification
                                showNotification({
                                    title: senderName,
                                    message: lastMsg.text || (lastMsg.type === 'image' ? 'Sent an image' : 'New message'),
                                    avatar,
                                    role,
                                    subtitle: `Message in ${channel.type === 'dm' ? 'Direct Messages' : channel.name}`,
                                    // Inline Reply Handler
                                    onReply: async (text: string) => {
                                        // Logic to send message
                                        const messagesRef = ref(database, `messages/${channelId}`);
                                        const newMessageRef = push(messagesRef);

                                        const messagePayload = {
                                            text,
                                            senderId: currentUser.uid,
                                            senderName: currentUser.displayName || 'Me',
                                            senderPhoto: currentUser.photoURL || '',
                                            timestamp: serverTimestamp(),
                                            type: 'text',
                                            seenBy: { [currentUser.uid]: Date.now() },
                                            deliveredTo: { [currentUser.uid]: Date.now() }
                                        };

                                        await set(newMessageRef, messagePayload);

                                        // Update Channel Last Message
                                        const chRef = ref(database, `channels/${channelId}`);
                                        await update(chRef, {
                                            lastMessage: { ...messagePayload, id: newMessageRef.key },
                                            lastActive: serverTimestamp()
                                        });
                                    }
                                });
                            };

                            triggerNotification();
                        }
                    }

                    // 2. Mark as Delivered (Global Delivery Receipt)
                    if (lastMsg.senderId !== currentUser.uid) {
                        if (!lastMsg.deliveredTo || !lastMsg.deliveredTo[currentUser.uid]) {
                            if (lastMsg.id) {
                                const msgDeliveryRef = ref(database, `messages/${channelId}/${lastMsg.id}/deliveredTo`);
                                update(msgDeliveryRef, {
                                    [currentUser.uid]: Date.now()
                                }).catch(err => console.error("Failed to mark delivered", err));
                            }
                        }
                    }
                }
            });

            setUnreadCount(count);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return { unreadCount };
};
