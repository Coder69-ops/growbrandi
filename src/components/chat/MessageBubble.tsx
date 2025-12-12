import React, { useState } from 'react';
import { format } from 'date-fns';
import { Message } from '../../hooks/chat/useChat';
import { Trash2, X, ZoomIn, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
    showHeader: boolean;
    onDelete?: (forEveryone: boolean) => void;
}

// Helper to detect if message is only emojis
const isOnlyEmojis = (text: string) => {
    const emojiRegex = /^[\p{Emoji}\s]+$/u;
    return emojiRegex.test(text.trim());
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, showHeader, onDelete }) => {
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const { showConfirm } = useToast();

    const isEmojiOnly = message.text && isOnlyEmojis(message.text);

    const handleDownloadImage = () => {
        if (message.imageUrl) {
            const link = document.createElement('a');
            link.href = message.imageUrl;
            link.download = `image-${message.timestamp}.jpg`;
            link.click();
        }
    };

    return (
        <>
            <div className={`group flex gap-3 ${isMe ? 'flex-row-reverse' : ''} transition-all duration-200 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] -mx-2 px-2 py-1 rounded-lg`}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                    {showHeader ? (
                        message.senderPhoto ? (
                            <img
                                src={message.senderPhoto}
                                alt={message.senderName}
                                className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-white dark:ring-slate-800 transition-transform hover:scale-110"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-800 transition-transform hover:scale-110">
                                {message.senderName[0]?.toUpperCase()}
                            </div>
                        )
                    ) : (
                        <div className="w-10" />
                    )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'} relative min-w-0`}>
                    {showHeader && (
                        <div className="flex items-baseline gap-2 mb-1 px-1">
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">{message.senderName}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{format(message.timestamp, 'h:mm a')}</span>
                        </div>
                    )}

                    <div className={`relative group/message ${isEmojiOnly
                        ? 'text-5xl leading-none p-1'
                        : `px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed overflow-visible transition-all duration-200 ${isMe
                            ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-md shadow-indigo-500/20'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-md shadow-slate-200 dark:shadow-slate-800/50'
                        } hover:shadow-lg`
                        }`}>

                        {message.isUnsent ? (
                            // Unsent placeholder
                            <div className="flex items-center gap-2 text-xs italic opacity-60">
                                <Trash2 size={12} />
                                <span>{isMe ? 'You unsent a message' : `${message.senderName} unsent a message`}</span>
                            </div>
                        ) : (
                            <>
                                {/* Delete Menu for Own Messages */}
                                {isMe && onDelete && !isEmojiOnly && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover/message:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowDeleteMenu(!showDeleteMenu);
                                            }}
                                            className="p-1.5 text-indigo-200 hover:text-white bg-indigo-800/0 hover:bg-indigo-800/50 rounded-lg transition-all duration-200 active:scale-95"
                                        >
                                            <Trash2 size={12} />
                                        </button>

                                        {showDeleteMenu && (
                                            <div className="absolute right-0 top-8 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showConfirm("Delete just for you?", () => {
                                                            onDelete(false);
                                                            setShowDeleteMenu(false);
                                                        });
                                                    }}
                                                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                                >
                                                    Delete for me
                                                </button>

                                                {/* Only show if within 30 mins */}
                                                {(Date.now() - message.timestamp < 30 * 60 * 1000) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            showConfirm("Unsend this message for everyone?", () => {
                                                                onDelete(true);
                                                                setShowDeleteMenu(false);
                                                            });
                                                        }}
                                                        className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        Unsend
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {message.type === 'image' && message.imageUrl ? (
                                    <div className="mb-1 group/image relative">
                                        <div
                                            onClick={() => setShowImageModal(true)}
                                            className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 max-w-sm"
                                        >
                                            <img
                                                src={message.imageUrl}
                                                alt="Shared image"
                                                className="w-full h-auto object-cover transition-transform duration-300 group-hover/image:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                                <ZoomIn
                                                    className="text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"
                                                    size={32}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {message.text && (
                                    <p className={`whitespace-pre-wrap break-words ${isEmojiOnly ? '' : 'pr-2'}`}>
                                        {message.text}
                                    </p>
                                )}

                                {/* Message Status Indicators - Only for sent messages */}
                                {isMe && !message.isUnsent && (
                                    <div className="flex items-center justify-end gap-0.5 mt-1">
                                        {message.seenBy && Object.keys(message.seenBy).length > 0 ? (
                                            // Seen - Double check (blue)
                                            <svg width="16" height="12" viewBox="0 0 16 12" className="text-blue-400">
                                                <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="currentColor" />
                                            </svg>
                                        ) : message.deliveredTo && Object.keys(message.deliveredTo).length > 0 ? (
                                            // Delivered - Double check (gray)
                                            <svg width="16" height="12" viewBox="0 0 16 12" className="text-gray-400 dark:text-gray-500">
                                                <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            // Sent - Single check (gray)
                                            <svg width="16" height="12" viewBox="0 0 16 12" className="text-gray-400 dark:text-gray-500">
                                                <path d="M11.071 1.429l-.372-.484a.365.365 0 0 0-.515-.006L4.184 7.77a.32.32 0 0 1-.484-.033l-1.32-1.266a.418.418 0 0 0-.541-.036l-.483.378a.319.319 0 0 0-.032.484l2.143 2.142c.14.143.361.125.484-.033l6.778-7.505a.365.365 0 0 0 .063-.51z" fill="currentColor" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Modal/Lightbox */}
            {showImageModal && message.imageUrl && (
                <div
                    className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        onClick={() => setShowImageModal(false)}
                        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadImage();
                        }}
                        className="absolute top-4 right-20 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Download"
                    >
                        <Download size={24} />
                    </button>

                    <div
                        className="relative max-w-7xl max-h-[90vh] animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={message.imageUrl}
                            alt="Full size image"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
                            <p className="font-semibold">{message.senderName}</p>
                            <p className="text-xs text-slate-300">{format(message.timestamp, 'PPp')}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
