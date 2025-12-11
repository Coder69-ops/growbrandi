import { useEffect, useState } from 'react';
import { database } from '../../lib/firebase';
import { ref, onValue, push, set, serverTimestamp, query, limitToLast, orderByChild } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';

export interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    timestamp: number;
    type: 'text' | 'image' | 'system';
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
                const loadedChannels = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                // Filter channels logic could go here (e.g. DMs only for me)
                setChannels(loadedChannels);
            } else {
                // If no channels exist, create default #general
                createChannel('general', 'public', 'General discussion');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Fetch Messages for Current Channel
    useEffect(() => {
        if (!currentChannelId) {
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
                const loadedMessages = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                setMessages(loadedMessages);
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [currentChannelId]);

    const sendMessage = async (text: string, type: 'text' | 'image' = 'text') => {
        if (!currentUser || !currentChannelId) return;

        const messagesRef = ref(database, `messages/${currentChannelId}`);
        const newMessageRef = push(messagesRef);

        await set(newMessageRef, {
            text,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
            senderPhoto: currentUser.photoURL || '',
            timestamp: serverTimestamp(),
            type
        });
    };

    const createChannel = async (name: string, type: 'public' | 'private' | 'dm', description: string = '') => {
        const channelsRef = ref(database, 'channels');
        const newChannelRef = push(channelsRef);
        await set(newChannelRef, {
            name,
            type,
            description,
            createdAt: serverTimestamp()
        });
        return newChannelRef.key;
    };

    return {
        messages,
        channels,
        loading,
        sendMessage,
        createChannel
    };
};
