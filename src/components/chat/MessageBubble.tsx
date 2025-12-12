import React, { useState } from 'react';
import { format } from 'date-fns';
import { Message } from '../../hooks/chat/useChat';
import { Trash2 } from 'lucide-react';

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
    showHeader: boolean;
    onDelete?: (forEveryone: boolean) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, showHeader, onDelete }) => {
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    return (
        <div className={`group flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="shrink-0 pt-1">
                {showHeader ? (
                    message.senderPhoto ? (
                        <img src={message.senderPhoto} alt={message.senderName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {message.senderName[0]?.toUpperCase()}
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
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{message.senderName}</span>
                        <span className="text-[10px] text-slate-400">{format(message.timestamp, 'h:mm a')}</span>
                    </div>
                )}

                <div className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed overflow-visible group-hover:shadow-md transition-all ${isMe
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                    }`}>

                    {/* Delete Menu for Own Messages */}
                    {isMe && onDelete && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteMenu(!showDeleteMenu);
                                }}
                                className="p-1 text-indigo-200 hover:text-white bg-indigo-700/0 hover:bg-indigo-700/50 rounded"
                            >
                                <Trash2 size={12} />
                            </button>

                            {showDeleteMenu && (
                                <div className="absolute right-0 top-6 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 overflow-hidden">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm("Delete just for you?")) {
                                                onDelete(false); // For Me
                                                setShowDeleteMenu(false);
                                            }
                                        }}
                                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Delete for me
                                    </button>

                                    {/* Only show if within 30 mins */}
                                    {(Date.now() - message.timestamp < 30 * 60 * 1000) && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm("Delete for everyone? This cannot be undone.")) {
                                                    onDelete(true); // For Everyone
                                                    setShowDeleteMenu(false);
                                                }
                                            }}
                                            className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            Delete for everyone
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {message.type === 'image' && message.imageUrl ? (
                        <div className="mb-1">
                            <img
                                src={message.imageUrl}
                                alt="Shared image"
                                className="max-w-full rounded-lg hover:opacity-95 cursor-pointer transition-opacity"
                                loading="lazy"
                            />
                        </div>
                    ) : null}

                    {message.text && <p className="whitespace-pre-wrap break-words pr-2">{message.text}</p>}
                </div>
            </div>
        </div>
    );
};
