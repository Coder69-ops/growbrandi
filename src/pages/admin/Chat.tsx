import React, { useState, useEffect, useRef } from 'react';
import { AdminPageLayout } from '../../components/admin/AdminPageLayout';
import { useChat, Channel, Message } from '../../hooks/chat/useChat';
import { useAuth } from '../../context/AuthContext';
import { Send, Image as ImageIcon, Hash, User, Loader2, MoreVertical, Search, Smile } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { AdminLoader } from '../../components/admin/AdminLoader';

const AdminChat = () => {
    const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
    const { messages, channels, loading: chatLoading, sendMessage, createChannel } = useChat(activeChannelId);
    const { currentUser } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [newChannelName, setNewChannelName] = useState('');
    const [isCreatingChannel, setIsCreatingChannel] = useState(false);

    // Auto-select first channel
    useEffect(() => {
        if (!activeChannelId && channels.length > 0) {
            setActiveChannelId(channels[0].id);
        }
    }, [channels, activeChannelId]);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        await sendMessage(newMessage);
        setNewMessage('');
    };

    const handleCreateChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim()) return;

        await createChannel(newChannelName.toLowerCase().replace(/\s+/g, '-'), 'public');
        setNewChannelName('');
        setIsCreatingChannel(false);
    };

    const activeChannel = channels.find(c => c.id === activeChannelId);

    return (
        <AdminPageLayout
            title="Team Chat"
            description="Real-time collaboration for the team"
            fullWidth
            noPadding
        >
            {chatLoading ? (
                <div className="h-[600px] flex items-center justify-center">
                    <AdminLoader message="Connecting to secure channel..." />
                </div>
            ) : (
                <div className="flex h-[calc(100vh-180px)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">

                    {/* Sidebar */}
                    <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
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

                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channels</h3>
                                <button
                                    onClick={() => setIsCreatingChannel(!isCreatingChannel)}
                                    className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <div className="text-xl leading-none">+</div>
                                </button>
                            </div>
                        </div>

                        {/* Channel List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
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
                                    <p className="text-[10px] text-slate-400 mt-1">Press Enter to create</p>
                                </form>
                            )}

                            {channels.map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => setActiveChannelId(channel.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${activeChannelId === channel.id
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <Hash size={18} className={activeChannelId === channel.id ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                                    <span className="font-medium truncate">{channel.name}</span>
                                    {/* {channel.unread > 0 && (
                                        <span className="ml-auto bg-indigo-500 text-white text-[10px] font-bold px-1.5 rounded-full min-w-[1.2rem]">
                                            {channel.unread}
                                        </span>
                                    )} */}
                                </button>
                            ))}

                            <div className="pt-6 pb-2">
                                <h3 className="px-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Direct Messages</h3>
                                <div className="text-sm text-slate-400 px-3 italic opacity-60">Coming soon</div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                        {/* Chat Header */}
                        <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <Hash size={24} className="text-slate-400" />
                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-white">{activeChannel?.name || 'Select a channel'}</h2>
                                    <p className="text-xs text-slate-500">{activeChannel?.description || 'Team discussion'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    {/* Placeholder for channel members */}
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-500">
                                            U{i}
                                        </div>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs text-slate-500">
                                        +5
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                        <Hash size={40} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Welcome to #{activeChannel?.name}!</h3>
                                        <p>This is the start of the <span className="font-mono text-indigo-500">#{activeChannel?.name}</span> channel.</p>
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.senderId === currentUser?.uid;
                                    const showHeader = index === 0 || messages[index - 1].senderId !== msg.senderId || (msg.timestamp - messages[index - 1].timestamp > 300000); // 5 mins

                                    return (
                                        <div key={msg.id} className={`group flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            {/* Avatar */}
                                            <div className="shrink-0 pt-1">
                                                {showHeader ? (
                                                    msg.senderPhoto ? (
                                                        <img src={msg.senderPhoto} alt={msg.senderName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                            {msg.senderName[0]?.toUpperCase()}
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="w-10" />
                                                )}
                                            </div>

                                            {/* Message Content */}
                                            <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                {showHeader && (
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{msg.senderName}</span>
                                                        <span className="text-[10px] text-slate-400">{format(msg.timestamp, 'h:mm a')}</span>
                                                    </div>
                                                )}

                                                <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed ${isMe
                                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-slate-900">
                            <form
                                onSubmit={handleSendMessage}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-end gap-2 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all"
                            >
                                <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                                    <ImageIcon size={20} />
                                </button>
                                <button type="button" className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors">
                                    <Smile size={20} />
                                </button>

                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={`Message #${activeChannel?.name || 'channel'}`}
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 max-h-32 py-2.5"
                                />

                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <div className="text-center mt-2">
                                <p className="text-[10px] text-slate-400">
                                    <strong>Tip:</strong> Messages are synced in real-time across all active team members.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </AdminPageLayout>
    );
};

export default AdminChat;
