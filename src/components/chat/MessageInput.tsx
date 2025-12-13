import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Smile, X, Loader2, User } from 'lucide-react';
import { storage } from '../../lib/storage';
import EmojiPicker from 'emoji-picker-react';
import { useToast } from '../../context/ToastContext';

interface MessageInputProps {
    onSendMessage: (text: string, type: 'text' | 'image', imageUrl?: string, mentions?: string[]) => Promise<void>;
    onTyping?: (isTyping: boolean) => void;
    placeholder?: string;
    userMap?: Record<string, any>;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping, placeholder, userMap = {} }) => {
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { showToast } = useToast();

    // Mentions Logic
    const [showMentions, setShowMentions] = useState(false);
    const [mentionFilter, setMentionFilter] = useState('');
    const [mentionCursorIndex, setMentionCursorIndex] = useState(0); // For key nav
    const [mentionTriggerIndex, setMentionTriggerIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);

    const users = Object.values(userMap).map(u => ({
        id: u.id || u.uid,
        name: u.name || u.displayName,
        image: u.image || u.photoURL
    })).filter(u => u.name);

    const filteredUsers = showMentions
        ? users.filter(u => u.name.toLowerCase().includes(mentionFilter.toLowerCase()))
        : [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
                setShowEmojiPicker(false);
            }
            if (showMentions && !target.closest('.mention-popup')) {
                setShowMentions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker, showMentions]);

    const handleTyping = (text: string) => {
        setMessage(text);

        // Mention Detection
        const selectionStart = inputRef.current?.selectionStart || text.length;
        const textBeforeCursor = text.slice(0, selectionStart);
        const lastAt = textBeforeCursor.lastIndexOf('@');

        if (lastAt !== -1) {
            const query = textBeforeCursor.slice(lastAt + 1);
            // Check if there's a space after '@' which implies end of mention attempt, unless name has spaces?
            // Usually simpler: scan until space.
            if (!query.includes(' ')) {
                setMentionTriggerIndex(lastAt);
                setMentionFilter(query);
                setShowMentions(true);
                setMentionCursorIndex(0);
            } else {
                setShowMentions(false);
            }
        } else {
            setShowMentions(false);
        }

        if (onTyping) {
            onTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
        }
    };

    const insertMention = (user: { id: string, name: string }) => {
        if (mentionTriggerIndex === -1) return;

        const beforeMention = message.slice(0, mentionTriggerIndex);
        const afterMention = message.slice(inputRef.current?.selectionStart || message.length);
        const newValue = `${beforeMention}@${user.name} ${afterMention}`;

        setMessage(newValue);
        setShowMentions(false);
        inputRef.current?.focus();
        // Reset typing
        handleTyping(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showMentions && filteredUsers.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setMentionCursorIndex(prev => (prev + 1) % filteredUsers.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setMentionCursorIndex(prev => (prev - 1 + filteredUsers.length) % filteredUsers.length);
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                insertMention(filteredUsers[mentionCursorIndex]);
            } else if (e.key === 'Escape') {
                setShowMentions(false);
            }
        }
    };

    const handleEmojiClick = (emojiData: any) => {
        setMessage((prev) => prev + emojiData.emoji);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Extract Mentions
        const mentionedUserIds: string[] = [];
        users.forEach(u => {
            if (message.includes(`@${u.name}`)) {
                mentionedUserIds.push(u.id);
            }
        });

        await onSendMessage(message, 'text', undefined, mentionedUserIds);
        setMessage('');
        setShowMentions(false);
        if (onTyping && typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            onTyping(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        e.target.value = '';
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image must be less than 5MB', 'error');
            return;
        }

        setUploading(true);
        try {
            const url = await storage.uploadFile(file, 'chat-images');
            await onSendMessage('', 'image', url);
        } catch (error) {
            console.error('Failed to upload image:', error);
            showToast('Failed to upload image. Please try again.', 'error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="px-6 pb-6 pt-2 bg-white dark:bg-slate-900 relative">

            {/* Mentions Popup */}
            {showMentions && filteredUsers.length > 0 && (
                <div className="absolute bottom-20 left-16 z-50 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-150 mention-popup">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Mention Member
                    </div>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        {filteredUsers.map((user, index) => (
                            <button
                                key={user.id}
                                onClick={() => insertMention(user)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${index === mentionCursorIndex ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                                    }`}
                            >
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <User size={14} className="text-slate-500" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {user.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
                <div className="absolute bottom-24 left-6 z-50 emoji-picker-container shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={"auto" as any}
                        width={300}
                        height={400}
                    />
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 pl-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 ring-1 ring-transparent focus-within:ring-indigo-500/30"
            >
                <div className="flex gap-2 text-slate-400">
                    <button
                        type="button"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 rounded-full transition-colors disabled:opacity-50"
                        title="Upload Image"
                    >
                        {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-2 rounded-full transition-colors ${showEmojiPicker ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-500'}`}
                        title="Add Emoji"
                    >
                        <Smile size={20} />
                    </button>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder={placeholder || "Type a message..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 p-2 text-sm md:text-base"
                    autoComplete="off"
                />

                <button
                    type="submit"
                    disabled={!message.trim() || uploading}
                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20 mr-1"
                >
                    <Send size={18} className={message.trim() ? "translate-x-0.5" : ""} />
                </button>
            </form>
        </div>
    );
};
