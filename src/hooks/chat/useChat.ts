import { useEffect, useState } from 'react';
import { database } from '../../lib/firebase';
import { ref, onValue, push, set, serverTimestamp, query, limitToLast, orderByChild, remove, update } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';

export interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    timestamp: number;
    type: 'text' | 'image' | 'system';
    imageUrl?: string;
    deletedFor?: Record<string, boolean>;
    isUnsent?: boolean;
    deliveredTo?: Record<string, number>; // userId -> timestamp
    seenBy?: Record<string, number>; // userId -> timestamp
    mentions?: string[]; // Array of user IDs
}

export interface Channel {
    id: string;
    name: string;
    type: 'public' | 'private' | 'dm';
    members?: string[]; // user IDs for private/dm
    description?: string;
}

export const useChat = (currentChannelId: string | null) => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Channels
    useEffect(() => {
        if (!currentUser) return;

        const channelsRef = ref(database, 'channels');
        const unsubscribe = onValue(channelsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const channelList = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({
                        id: key,
                        ...val,
                        members: val.members ? (Array.isArray(val.members) ? val.members : Object.values(val.members)) : []
                    }))
                    .filter((channel: any) => {
                        if (channel.type === 'public') return true;
                        return channel.members?.includes(currentUser.uid);
                    });

                setChannels(channelList);
            } else {
                setChannels([{ id: 'general', name: 'general', type: 'public', description: 'General discussion' }]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // Mark channel as read when active
    useEffect(() => {
        if (currentChannelId && currentUser) {
            // Update lastSeen for this channel
            const lastSeenRef = ref(database, `channels/${currentChannelId}/lastSeen/${currentUser.uid}`);
            set(lastSeenRef, Date.now());
        }
    }, [currentChannelId, currentUser, messages]);

    // 2. Fetch Messages for Current Channel
    useEffect(() => {
        if (!currentChannelId || !currentUser) {
            setMessages([]);
            return;
        }

        const messagesRef = query(
            ref(database, `messages/${currentChannelId}`),
            orderByChild('timestamp'),
            limitToLast(50)
        );

        const unsubscribe = onValue(messagesRef, async (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedMessages = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({
                        id: key,
                        ...val
                    }))
                    // Filter out messages deleted for this user
                    .filter((msg: any) => !msg.deletedFor || !msg.deletedFor[currentUser.uid]);
                setMessages(loadedMessages);

                // Mark messages as delivered and seen
                for (const msg of loadedMessages) {
                    if (msg.senderId !== currentUser.uid) {
                        const updates: any = {};
                        let needsUpdate = false;

                        // Mark as delivered if not already
                        if (!msg.deliveredTo || !msg.deliveredTo[currentUser.uid]) {
                            updates[`deliveredTo/${currentUser.uid}`] = Date.now();
                            needsUpdate = true;
                        }

                        // Mark as seen if not already (immediate since we are viewing)
                        if (!msg.seenBy || !msg.seenBy[currentUser.uid]) {
                            updates[`seenBy/${currentUser.uid}`] = Date.now();
                            needsUpdate = true;
                        }

                        if (needsUpdate) {
                            const msgRef = ref(database, `messages/${currentChannelId}/${msg.id}`);
                            await update(msgRef, updates);
                        }
                    }
                }
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [currentChannelId, currentUser]);

    // Seen logic merged into fetch loop for reliability

    const [typingUsers, setTypingUsers] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        if (!currentChannelId || !currentUser) return;

        const typingRef = ref(database, `typing/${currentChannelId}`);
        const unsubscribe = onValue(typingRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const now = Date.now();
                const activeTypers = Object.entries(data)
                    .filter(([uid, val]: [string, any]) => {
                        return uid !== currentUser.uid && val.timestamp && (now - val.timestamp) < 5000;
                    })
                    .map(([uid, val]: [string, any]) => ({ id: uid, name: val.name || 'Someone' }));

                // Deduplicate by ID
                const uniqueTypers = activeTypers.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                setTypingUsers(uniqueTypers);
            } else {
                setTypingUsers([]);
            }
        });

        return () => unsubscribe();
    }, [currentChannelId, currentUser]);

    const setTyping = async (isTyping: boolean) => {
        if (!currentUser || !currentChannelId) return;

        const typingRef = ref(database, `typing/${currentChannelId}/${currentUser.uid}`);

        if (isTyping) {
            await set(typingRef, {
                timestamp: serverTimestamp(),
                name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous'
            });
        } else {
            set(typingRef, null); // Remove immediately
        }
    };

    const sendMessage = async (text: string, type: 'text' | 'image' = 'text', imageUrl?: string, mentions: string[] = []) => {
        if (!currentUser || !currentChannelId) return;

        const messagesRef = ref(database, `messages/${currentChannelId}`);
        const newMessageRef = push(messagesRef);
        const messageId = newMessageRef.key;
        const timestamp = Date.now();

        const messagePayload: any = {
            text,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
            senderPhoto: currentUser.photoURL || '',
            timestamp, // Client timestamp for immediate UI feedback
            type
        };

        if (mentions && mentions.length > 0) {
            messagePayload.mentions = mentions;
        }

        if (type === 'image' && imageUrl) {
            messagePayload.imageUrl = imageUrl;
        }

        await set(newMessageRef, messagePayload);
        setTyping(false);

        // Update Channel Last Message (for sidebar unread status)
        const channelRef = ref(database, `channels/${currentChannelId}`);
        await update(channelRef, {
            lastMessage: {
                ...messagePayload,
                id: messageId
            },
            lastActive: timestamp
        });

        // Mark as read for sender immediately
        const lastSeenRef = ref(database, `channels/${currentChannelId}/lastSeen/${currentUser.uid}`);
        await set(lastSeenRef, timestamp);
    };

    const createChannel = async (name: string, type: 'public' | 'private' | 'dm', description: string = '', members: string[] = []) => {
        const channelsRef = ref(database, 'channels');
        const newChannelRef = push(channelsRef);

        const channelData: any = {
            name,
            type,
            description,
            createdAt: serverTimestamp()
        };

        if (type !== 'public') {
            channelData.members = members;
        }

        await set(newChannelRef, channelData);
        return newChannelRef.key;
    };

    const deleteMessage = async (messageId: string, forEveryone: boolean = false) => {
        if (!currentUser || !currentChannelId) return;
        const messageRef = ref(database, `messages/${currentChannelId}/${messageId}`);

        if (forEveryone) {
            // Unsend - Update message to mark it as unsent
            await update(messageRef, {
                text: '',
                imageUrl: null,
                type: 'text',
                isUnsent: true
            });
        } else {
            // Soft delete for me only
            const deletedForRef = ref(database, `messages/${currentChannelId}/${messageId}/deletedFor/${currentUser.uid}`);
            await set(deletedForRef, true);
        }
    };

    const deleteChannel = async (channelId: string) => {
        if (!currentUser) return;
        const channelRef = ref(database, `channels/${channelId}`);
        await remove(channelRef);
        const messagesRef = ref(database, `messages/${channelId}`);
        await remove(messagesRef);
        const typingRef = ref(database, `typing/${channelId}`);
        await remove(typingRef);
    };

    return {
        messages,
        channels,
        loading,
        sendMessage,
        createChannel,
        typingUsers,
        setTyping,
        deleteMessage,
        deleteChannel
    };
};
