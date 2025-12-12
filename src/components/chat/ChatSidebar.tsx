import React, { useState, useEffect } from 'react';
import { Search, Hash, Plus, MessageSquare, Loader2 } from 'lucide-react';
import { Channel } from '../../hooks/chat/useChat';
import { useOnlineUsers } from '../../hooks/usePresence';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface ChatSidebarProps {
    channels: Channel[];
    activeChannelId: string | null;
    onSelectChannel: (id: string) => void;
    onCreateChannel: (name: string, type: 'public' | 'private' | 'dm', description: string, members?: string[]) => Promise<any>;
    userMap: Record<string, any>;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    channels,
    activeChannelId,
    onSelectChannel,
    onCreateChannel,
    userMap
}) => {
    const { currentUser } = useAuth();
    const { onlineUsers } = useOnlineUsers();

    const [isCreatingChannel, setIsCreatingChannel] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');

    // DM Creation State
    const [isSelectingUser, setIsSelectingUser] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const publicChannels = channels.filter(c => c.type === 'public');
    const privateChannels = channels.filter(c => c.type === 'dm' || c.type === 'private');

    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim()) return;

        await onCreateChannel(
            newChannelName.toLowerCase().replace(/\s+/g, '-'),
            'public',
            'Public channel'
        );
        setNewChannelName('');
        setIsCreatingChannel(false);
    };

    const startDM = async (targetUser: any) => {
        setIsSelectingUser(false);
        setSearchTerm(''); // Clear search logic

        // Check if DM already exists
        const existingDM = privateChannels.find(c =>
            c.type === 'dm' &&
            c.members?.includes(targetUser.id) &&
            c.members?.includes(currentUser?.uid || '')
        );

        if (existingDM) {
            onSelectChannel(existingDM.id);
            return;
        }

        // Create new DM
        console.log('[ChatSidebar] Creating DM with:', { currentUser: currentUser?.uid, targetUser });
        if (!currentUser?.uid || !targetUser?.id) {
            console.error('[ChatSidebar] Missing user ID for DM creation');
            return;
        }

        const channelId = await onCreateChannel(
            targetUser.name,
            'dm',
            'Direct Message',
            [currentUser?.uid || '', targetUser.id]
        );

        if (channelId) {
            onSelectChannel(channelId);
        }
    };

    const fetchUsersForDM = async () => {
        setLoadingUsers(true);
        try {
            // Use the map if we already have it to avoid re-fetch, or fetch if empty (redundant safety)
            // But we already fetch on mount, so just use that if available?
            // Actually, for simplicity, let's just use the cached map to populate the list if we have it, 
            // or filter from the collection if we want fresh search. 
            // The existing logical flow fetches just for search. Let's keep it simple.
            const snapshot = await getDocs(collection(db, 'team_members'));
            const users = snapshot.docs.map(doc => {
                const data = doc.data();
                // STRICTLY use data.uid. If missing, this user cannot be messaged via Auth ID logic.
                // We log invalid users for debugging.
                if (!data.uid) {
                    console.warn('[ChatSidebar] User missing uid:', doc.id, data);
                    return null;
                }
                return { id: data.uid, ...data } as any;
            }).filter(u => u !== null);

            setAvailableUsers(users.filter(u => {
                const isSelfId = u.id === currentUser?.uid;
                const isSelfEmail = currentUser?.email && u.email && u.email.toLowerCase() === currentUser.email.toLowerCase();
                const isSelfName = currentUser?.displayName && u.name && u.name.toLowerCase() === currentUser.displayName.toLowerCase();
                return !isSelfId && !isSelfEmail && !isSelfName;
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingUsers(false);
        }
    };

    const toggleUserSelector = () => {
        if (!isSelectingUser) {
            setIsSelectingUser(true);
            fetchUsersForDM();
        } else {
            setIsSelectingUser(false);
        }
    };

    return (
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 h-full">
            {/* Search & Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Jump to..."
                        className="w-full bg-white dark:bg-slate-800 pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex justify-between items-center group">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channels</h3>
                    <button
                        onClick={() => setIsCreatingChannel(!isCreatingChannel)}
                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Create Channel"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
                {/* Public Channels */}
                <div className="space-y-1">
                    {isCreatingChannel && (
                        <form onSubmit={handleCreateChannel} className="mb-2 px-2">
                            <input
                                type="text"
                                placeholder="# new-channel"
                                value={newChannelName}
                                onChange={e => setNewChannelName(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 px-3 py-1.5 rounded text-sm border border-indigo-500 outline-none"
                                autoFocus
                            />
                        </form>
                    )}

                    {publicChannels.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => onSelectChannel(channel.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${activeChannelId === channel.id
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <Hash size={18} className={activeChannelId === channel.id ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                            <span className="font-medium truncate">{channel.name}</span>
                        </button>
                    ))}
                </div>

                {/* Direct Messages */}
                <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Messages</h3>
                        <button
                            onClick={toggleUserSelector}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="New Message"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {isSelectingUser && (
                        <div className="mb-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-2 shadow-lg animate-in slide-in-from-left-2">
                            <input
                                type="text"
                                placeholder="Search people..."
                                className="w-full text-sm px-2 py-1 mb-2 bg-transparent border-b border-slate-200 dark:border-slate-700 outline-none"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                {loadingUsers ? (
                                    <div className="flex justify-center py-2"><Loader2 className="animate-spin text-slate-400" size={16} /></div>
                                ) : (
                                    availableUsers
                                        .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => startDM(user)}
                                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-sm text-left"
                                            >
                                                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                                                    {user.image ? (
                                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.name[0]
                                                    )}
                                                </div>
                                                <span className="truncate flex-1">{user.name}</span>
                                            </button>
                                        ))
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        {privateChannels.map(channel => {
                            // Find Other Member
                            const otherMemberId = channel.members?.find(id => id !== currentUser?.uid);
                            const otherUser = otherMemberId ? userMap[otherMemberId] : null;
                            const isOnline = onlineUsers.some(u => u.uid === otherMemberId);

                            // Use profile image if available, otherwise standard icon
                            // If it is a DM, show Avatar. 
                            const isDM = channel.type === 'dm';

                            return (
                                <button
                                    key={channel.id}
                                    onClick={() => onSelectChannel(channel.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${activeChannelId === channel.id
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <div className="relative">
                                        {isDM && otherUser ? (
                                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold overflow-hidden border border-white/20">
                                                {otherUser.image ? (
                                                    <img src={otherUser.image} alt={channel.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    channel.name[0]
                                                )}
                                            </div>
                                        ) : (
                                            <MessageSquare size={18} className={activeChannelId === channel.id ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                                        )}

                                        {isOnline && (
                                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-slate-900"></span>
                                        )}
                                    </div>
                                    <span className="font-medium truncate">
                                        {isDM && otherUser ? otherUser.name : channel.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
