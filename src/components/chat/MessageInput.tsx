import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Smile, X, Loader2 } from 'lucide-react';
import { storage } from '../../lib/storage';
import EmojiPicker from 'emoji-picker-react';

interface MessageInputProps {
    onSendMessage: (text: string, type: 'text' | 'image', imageUrl?: string) => Promise<void>;
    onTyping?: (isTyping: boolean) => void;
    placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping, placeholder }) => {
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker]);

    const handleTyping = (text: string) => {
        setMessage(text);

        if (onTyping) {
            onTyping(true);

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Stop typing after 2 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false);
            }, 2000);
        }
    };

    const handleEmojiClick = (emojiData: any) => {
        setMessage((prev) => prev + emojiData.emoji);
        // setShowEmojiPicker(false); // Keep open for multiple emojis? Usually user clicks once.
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        await onSendMessage(message, 'text');
        setMessage('');
        if (onTyping && typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            onTyping(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input
        e.target.value = '';

        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        try {
            const url = await storage.uploadFile(file, 'chat-images');
            // Send immediately as image message
            await onSendMessage('Sent an image', 'image', url);
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="px-6 pb-6 pt-2 bg-white dark:bg-slate-900 relative">
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
                    type="text"
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder={placeholder || "Type a message..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 p-2 text-sm md:text-base"
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
