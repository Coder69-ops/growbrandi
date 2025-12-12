import React, { useState, useEffect } from 'react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { useChat } from '../../hooks/chat/useChat';
import { AdminLoader } from '../../components/admin/AdminLoader';
import { ChatSidebar } from '../../components/chat/ChatSidebar';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

import { usePresence } from '../../hooks/chat/usePresence';

const AdminChat = () => {
    usePresence(); // Track my online status
    const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
    const { messages, channels, loading: chatLoading, sendMessage, createChannel, typingUsers, setTyping, deleteMessage, deleteChannel } = useChat(activeChannelId);

    // User Map for Avatars (Lifted State)
    const [userMap, setUserMap] = useState<Record<string, any>>({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'team_members'));
                const map: Record<string, any> = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.uid) {
                        map[data.uid] = { ...data, id: doc.id };
                    }
                });
                setUserMap(map);
            } catch (error) {
                console.error("Failed to fetch user profiles", error);
            }
        };
        fetchUsers();
    }, []);

    // Auto-select first channel
    useEffect(() => {
        if (!activeChannelId && channels.length > 0) {
            // Prefer #general if it exists, else first public one
            const general = channels.find(c => c.name === 'general');
            if (general) {
                setActiveChannelId(general.id);
            } else {
                setActiveChannelId(channels[0].id);
            }
        }
    }, [channels, activeChannelId]);

    const activeChannel = channels.find(c => c.id === activeChannelId);

    return (
        <AdminPageLayout
            title="Team Chat"
            description="Collaborate with your team in real-time."
            actions={
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 mr-2">
                        {/* Placeholder for active users avatars if needed */}
                    </div>
                </div>
            }
        >
            {chatLoading ? (
                <div className="flex items-center justify-center h-[600px]">
                    <Loader2 size={40} className="animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="flex h-[calc(100vh-180px)] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
                    <ChatSidebar
                        channels={channels}
                        activeChannelId={activeChannelId}
                        onSelectChannel={setActiveChannelId}
                        onCreateChannel={createChannel}
                        userMap={userMap}
                    />

                    <ChatWindow
                        activeChannel={activeChannel}
                        messages={messages}
                        onSendMessage={sendMessage}
                        typingUsers={typingUsers}
                        onTyping={setTyping}
                        onDeleteMessage={deleteMessage}
                        onDeleteChannel={deleteChannel}
                        userMap={userMap}
                    />
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminChat;
