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
        const channelsRef = ref(database, 'channels');
        const unsubscribe = onValue(channelsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const loadedChannels = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({
                        id: key,
                        ...val,
                        members: val.members ? (Array.isArray(val.members) ? val.members : Object.values(val.members)) : []
                    }))
                    .filter((channel: any) => {
                        if (channel.type === 'public') return true;
                        if (channel.type === 'dm' || channel.type === 'private') {
                            const isMember = channel.members?.includes(currentUser?.uid);
                            if (!isMember) {
                                // console.log(`[useChat] Hidden channel ${channel.id} (${channel.name}) - User ${currentUser?.uid} is not in members [${channel.members}]`);
                            }
                            return isMember;
                        }
                        return false;
                    });

                setChannels(loadedChannels);
            } else {
                createChannel('general', 'public', 'General discussion');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

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

        const unsubscribe = onValue(messagesRef, (snapshot) => {
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
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [currentChannelId, currentUser]);

    const [typingUsers, setTypingUsers] = useState<string[]>([]);

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
                    .map(([uid, val]: [string, any]) => val.name || 'Someone');

                setTypingUsers([...new Set(activeTypers)]);
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

    const sendMessage = async (text: string, type: 'text' | 'image' = 'text', imageUrl?: string) => {
        if (!currentUser || !currentChannelId) return;

        const messagesRef = ref(database, `messages/${currentChannelId}`);
        const newMessageRef = push(messagesRef);

        const messagePayload: any = {
            text,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
            senderPhoto: currentUser.photoURL || '',
            timestamp: serverTimestamp(),
            type
        };

        if (type === 'image' && imageUrl) {
            messagePayload.imageUrl = imageUrl;
        }

        await set(newMessageRef, messagePayload);
        setTyping(false);
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
            // Hard delete
            await remove(messageRef);
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
