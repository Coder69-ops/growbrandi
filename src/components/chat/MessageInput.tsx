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
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative">
            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
                <div className="absolute bottom-20 left-4 z-50 emoji-picker-container shadow-2xl rounded-2xl">
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
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 flex items-end gap-2 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all"
            >
                <div className="flex gap-1">
                    <button
                        type="button"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors disabled:opacity-50"
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
                        className={`p-2 rounded-lg transition-colors ${showEmojiPicker ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                    >
                        <Smile size={20} />
                    </button>
                </div>

                <input
                    type="text"
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder={placeholder || "Type a message..."}
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 max-h-32 py-2.5"
                />

                <button
                    type="submit"
                    disabled={!message.trim() || uploading}
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
    );
};
