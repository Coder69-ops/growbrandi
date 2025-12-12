import React, { useRef, useEffect, useState } from 'react';
import { Hash, MoreVertical, Settings, UserPlus, LogOut, Trash2 } from 'lucide-react';
import { Channel, Message } from '../../hooks/chat/useChat';
import { useUserStatus, formatLastActive } from '../../hooks/chat/usePresence';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useAuth } from '../../context/AuthContext';

interface ChatWindowProps {
    activeChannel: Channel | undefined;
    messages: Message[];
    onSendMessage: (text: string, type: 'text' | 'image', imageUrl?: string) => Promise<void>;
    onTyping?: (isTyping: boolean) => void;
    typingUsers?: { id: string, name: string }[];
    onDeleteMessage?: (messageId: string, forEveryone: boolean) => Promise<void>;
    onDeleteChannel?: (channelId: string) => Promise<void>;
    userMap?: Record<string, any>;
}

// Force Rebuild
export const ChatWindow: React.FC<ChatWindowProps> = ({
    activeChannel,
    messages,
    onSendMessage,
    onTyping,
    typingUsers = [],
    onDeleteMessage,
    onDeleteChannel,
    userMap = {}
}) => {
    const { currentUser } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showMenu, setShowMenu] = useState(false);

    // Auto-scroll to bottom
    // We add typingUsers length to dependency to scroll when someone starts typing (optional, but nice)
    // Auto-scroll to bottom
    // We add typingUsers length to dependency to scroll when someone starts typing (optional, but nice)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, typingUsers, activeChannel?.id]);

    const handleDeleteChannel = async () => {
        if (activeChannel && onDeleteChannel && confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
            await onDeleteChannel(activeChannel.id);
        }
    };

    // Determine other user ID for Presence Hook (must be top level)
    let otherUserIdForHook: string | undefined;
    if (activeChannel?.type === 'dm' && activeChannel?.members && currentUser) {
        otherUserIdForHook = activeChannel.members.find(id => id !== currentUser.uid);
    }

    // Always call hook at top level
    const userStatus = useUserStatus(otherUserIdForHook);

    if (!activeChannel) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-slate-400">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Hash size={32} />
                </div>
                <p>Select a channel or start a direct message</p>
            </div>
        );
    }

    // Resolve Header details
    let headerTitle = activeChannel.name;
    let headerImage = '';

    // We already calculated the ID, we can reuse it or recalculate if we want to be safe inside the block
    if (otherUserIdForHook) {
        if (userMap && userMap[otherUserIdForHook]) {
            headerTitle = userMap[otherUserIdForHook].name;
            headerImage = userMap[otherUserIdForHook].image;
        }
    }

    // Helper for status text
    const getStatusDisplay = () => {
        if (activeChannel.type === 'public') return 'Team discussion';
        if (activeChannel.type === 'dm' && userStatus) {
            if (userStatus.state === 'online') {
                return (
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Active Now
                    </span>
                );
            } else {
                return (
                    <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        {formatLastActive(userStatus.last_changed)}
                    </span>
                );
            }
        }
        return 'Private conversation';
    };

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative h-full overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    {activeChannel.type === 'public' ? (
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                            <Hash size={16} />
                        </div>
                    ) : (
                        headerImage ? (
                            <img src={headerImage} alt={headerTitle} className="w-8 h-8 rounded-full object-cover shadow-sm" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                {headerTitle[0]?.toUpperCase()}
                            </div>
                        )
                    )}
                    <div>
                        <h2 className="font-bold text-slate-900 dark:text-white capitalize">{headerTitle}</h2>
                        <div className="text-xs text-slate-500">{getStatusDisplay()}</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-2 rounded-full transition-colors ${showMenu ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600'}`}
                    >
                        <MoreVertical size={20} />
                    </button>

                    {/* Simplified Menu */}
                    {showMenu && (
                        <div className="absolute top-10 right-0 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 animate-in fade-in zoom-in-95 duration-200 z-50">
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <Settings size={16} /> Channel Settings
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <UserPlus size={16} /> Add Members
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                            <button
                                onClick={handleDeleteChannel}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <Trash2 size={16} /> Delete Conversation
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" onClick={() => setShowMenu(false)}>
                {messages.length === 0 ? (
                    activeChannel.type === 'dm' && otherUserIdForHook && userMap[otherUserIdForHook] ? (
                        // DM Profile Card
                        <div className="h-full flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
                            {/* Profile Picture */}
                            <div className="relative">
                                {userMap[otherUserIdForHook].image ? (
                                    <img
                                        src={userMap[otherUserIdForHook].image}
                                        alt={userMap[otherUserIdForHook].name}
                                        className="w-32 h-32 rounded-full object-cover shadow-2xl ring-4 ring-white dark:ring-slate-800"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-5xl shadow-2xl ring-4 ring-white dark:ring-slate-800">
                                        {userMap[otherUserIdForHook].name[0]?.toUpperCase()}
                                    </div>
                                )}
                                {/* Online Status Badge */}
                                {userStatus?.state === 'online' && (
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg"></div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    {userMap[otherUserIdForHook].name}
                                </h2>

                                {userMap[otherUserIdForHook].role && (
                                    <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">
                                        {typeof userMap[otherUserIdForHook].role === 'object'
                                            ? userMap[otherUserIdForHook].role.en || Object.values(userMap[otherUserIdForHook].role)[0]
                                            : userMap[otherUserIdForHook].role
                                        }
                                    </p>
                                )}

                                {userMap[otherUserIdForHook].company && (
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                                        <span>@</span>
                                        <span className="font-semibold">
                                            {typeof userMap[otherUserIdForHook].company === 'object'
                                                ? userMap[otherUserIdForHook].company.en || Object.values(userMap[otherUserIdForHook].company)[0]
                                                : userMap[otherUserIdForHook].company
                                            }
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Conversation Start Message */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                    This is the beginning of your conversation
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Public Channel Empty State
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                <Hash size={40} />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Welcome to #{activeChannel.name}!</h3>
                                <p>This is the start of your conversation.</p>
                            </div>
                        </div>
                    )
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUser?.uid;
                        // Show header if: First message OR different sender OR > 5 mins gap
                        const showHeader = index === 0 ||
                            messages[index - 1].senderId !== msg.senderId ||
                            (msg.timestamp - messages[index - 1].timestamp > 300000);

                        return (
                            <div key={msg.id} className={showHeader ? 'mt-4' : 'mt-1'}>
                                <MessageBubble
                                    message={msg}
                                    isMe={isMe}
                                    showHeader={showHeader}
                                    onDelete={onDeleteMessage ? (forEveryone) => onDeleteMessage(msg.id, forEveryone) : undefined}
                                />
                            </div>
                        );
                    })
                )}

                {/* Typing Indicator */}
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                    <div className="flex items-end gap-2 ml-1 mt-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        {/* Avatar */}
                        {userMap[typingUsers[0].id]?.image ? (
                            <img
                                src={userMap[typingUsers[0].id].image}
                                alt={typingUsers[0].name}
                                className="w-8 h-8 rounded-full object-cover shadow-sm mb-1 ring-2 ring-white dark:ring-slate-800"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-xs font-bold mb-1 ring-2 ring-white dark:ring-slate-800">
                                {typingUsers[0].name[0]?.toUpperCase()}
                            </div>
                        )}

                        {/* Bubble */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>

                        {/* Multiple Typers Count */}
                        {typingUsers.length > 1 && (
                            <span className="text-xs text-slate-400 mb-3 ml-1">
                                +{typingUsers.length - 1}
                            </span>
                        )}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput
                onSendMessage={onSendMessage}
                onTyping={onTyping}
                placeholder={`Message #${activeChannel.name}`}
            />
        </div>
    );
};
