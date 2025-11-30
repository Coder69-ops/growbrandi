import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { ChatAdapter, initializeChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import ChatMessageBubble from './ChatMessageBubble';

interface ChatInterfaceProps {
    isOpen: boolean;
    onClose: () => void;
    systemInstruction: string;
    preloadedChat?: ChatAdapter | null;
    isPreloaded?: boolean;
}

const INITIAL_SUGGESTIONS = [
    "Get instant project estimate",
    "Book free strategy call",
    "What's your pricing?",
    "Show me results you deliver"
];

const CONTEXTUAL_SUGGESTIONS = {
    project: [
        "Get instant cost estimate",
        "When can we start?",
        "Book project kickoff call",
        "What's the guaranteed ROI?"
    ],
    services: [
        "Which service gets fastest ROI?",
        "What's included in premium package?",
        "Book strategy consultation now",
        "Show me client success stories"
    ],
    pricing: [
        "What's your starting price?",
        "Any limited-time offers?",
        "Book free consultation call",
        "What ROI can I expect?"
    ],
    consultation: [
        "Book free call this week",
        "What will we discuss?",
        "How fast can we start?",
        "Any spots left this month?"
    ]
};



const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose, systemInstruction, preloadedChat, isPreloaded = false }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(!isPreloaded);
    const [error, setError] = useState<string | null>(null);
    const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
    const [isInitialized, setIsInitialized] = useState(false);
    const chatRef = useRef<ChatAdapter | null>(preloadedChat || null);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !isInitialized) {
            const init = async () => {
                // If we have a preloaded chat, use it immediately
                if (preloadedChat && isPreloaded) {
                    chatRef.current = preloadedChat;
                    setIsLoading(false);
                    setIsInitialized(true);

                    // Send welcome message immediately
                    try {
                        const response = await chatRef.current.sendMessageStream({ message: "Greet them as a GrowBrandi growth expert and ask what business challenge they want to solve. Be confident and conversion-focused. Max 2 sentences." });
                        let fullResponse = "";
                        const aiMessage: ChatMessage = { role: 'model', parts: [{ text: '' }] };
                        setMessages([aiMessage]);

                        for await (const chunk of response) {
                            fullResponse += chunk.text;
                            setMessages([{ role: 'model', parts: [{ text: fullResponse }] }]);
                        }
                    } catch (e: any) {
                        console.error(e);
                        // Handle initialization errors gracefully
                        if (e?.message?.includes('503') || e?.message?.includes('overloaded')) {
                            const fallbackMessage: ChatMessage = {
                                role: 'model',
                                parts: [{ text: "🚀 GrowBrandi AI is experiencing high demand! I'm your business growth expert - what challenge can I help you solve while we get fully connected?" }]
                            };
                            setMessages([fallbackMessage]);
                        } else {
                            const fallbackMessage: ChatMessage = {
                                role: 'model',
                                parts: [{ text: "Hi! I'm GrowBrandi AI, your business growth expert. What challenges can I help you solve today? 🚀" }]
                            };
                            setMessages([fallbackMessage]);
                        }
                    }
                    return;
                }

                // Fallback to regular initialization if preload failed
                setIsLoading(true);
                setMessages([]);
                chatRef.current = initializeChat(systemInstruction);
                if (!chatRef.current) {
                    setError('Failed to initialize AI Assistant.');
                    setIsLoading(false);
                    return;
                }

                try {
                    const response = await chatRef.current.sendMessageStream({ message: "Say hi briefly and ask what they need help with. Be urgent and conversion-focused. Max 2 sentences." });
                    let fullResponse = "";
                    const aiMessage: ChatMessage = { role: 'model', parts: [{ text: '' }] };
                    setMessages([aiMessage]);

                    for await (const chunk of response) {
                        fullResponse += chunk.text;
                        setMessages([{ role: 'model', parts: [{ text: fullResponse }] }]);
                    }
                } catch (e: any) {
                    console.error(e);
                    // Handle initialization errors gracefully
                    if (e?.message?.includes('503') || e?.message?.includes('overloaded')) {
                        const fallbackMessage: ChatMessage = {
                            role: 'model',
                            parts: [{ text: "🚀 GrowBrandi AI is experiencing high demand! I'm your business growth expert - what challenge can I help you solve while we get fully connected?" }]
                        };
                        setMessages([fallbackMessage]);
                    } else {
                        const fallbackMessage: ChatMessage = {
                            role: 'model',
                            parts: [{ text: "Hi! I'm GrowBrandi AI, your business growth expert. What challenges can I help you solve today? 🚀" }]
                        };
                        setMessages([fallbackMessage]);
                    }
                } finally {
                    setIsLoading(false);
                    setIsInitialized(true);
                }
            };
            init();
        }
    }, [isOpen, systemInstruction, preloadedChat, isPreloaded, isInitialized]);

    useEffect(() => {
        chatHistoryRef.current?.scrollTo({ top: chatHistoryRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        // Update contextual suggestions based on message content
        updateContextualSuggestions(message);

        if (!chatRef.current) {
            setError('Chat is not initialized.');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Sending message:', message);
            const responseStream = await chatRef.current.sendMessageStream({ message: message });

            let fullResponse = "";
            const aiMessageIndex = messages.length + 1;
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

            for await (const chunk of responseStream) {
                const chunkText = chunk.text || chunk || '';
                fullResponse += chunkText;
                setMessages(prev => {
                    const newMessages = [...prev];
                    if (newMessages[aiMessageIndex]) {
                        newMessages[aiMessageIndex] = { role: 'model', parts: [{ text: fullResponse }] };
                    }
                    return newMessages;
                });
            }

            console.log('Response received:', fullResponse);
        } catch (e: any) {
            console.error('Send message error:', e);

            let errorMessage: ChatMessage;

            // Handle specific API errors
            if (e?.message?.includes('503') || e?.message?.includes('overloaded') || e?.message?.includes('UNAVAILABLE')) {
                errorMessage = {
                    role: 'model',
                    parts: [{ text: "🚀 GrowBrandi AI is experiencing high demand! This means our growth strategies are working. Please try again in a moment - I'm here to help scale your business!" }]
                };
            } else if (e?.message?.includes('401') || e?.message?.includes('API key')) {
                errorMessage = {
                    role: 'model',
                    parts: [{ text: "There's a configuration issue on our end. Let's schedule a direct call to discuss your growth needs: contact@growbrandi.com" }]
                };
            } else if (e?.message?.includes('400') || e?.message?.includes('Invalid')) {
                errorMessage = {
                    role: 'model',
                    parts: [{ text: "Let me rephrase that for you. What specific business challenge are you facing? Revenue growth? Lead generation? Brand development?" }]
                };
            } else {
                errorMessage = {
                    role: 'model',
                    parts: [{ text: "I'm temporarily offline, but your business growth can't wait! Book a free strategy call: contact@growbrandi.com or try asking me again." }]
                };
            }

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const updateContextualSuggestions = (message: string) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('project') || lowerMessage.includes('estimate') || lowerMessage.includes('cost')) {
            setCurrentSuggestions(CONTEXTUAL_SUGGESTIONS.project);
        } else if (lowerMessage.includes('service') || lowerMessage.includes('package') || lowerMessage.includes('offer')) {
            setCurrentSuggestions(CONTEXTUAL_SUGGESTIONS.services);
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
            setCurrentSuggestions(CONTEXTUAL_SUGGESTIONS.pricing);
        } else if (lowerMessage.includes('consultation') || lowerMessage.includes('meeting') || lowerMessage.includes('call')) {
            setCurrentSuggestions(CONTEXTUAL_SUGGESTIONS.consultation);
        }
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSendMessage(userInput);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700 flex flex-col w-full max-w-lg h-[85vh] max-h-[700px]"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gradient">GrowBrandi AI Assistant</h3>
                        {isPreloaded && (
                            <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                Ready
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <FaTimes className="h-6 w-6" />
                    </button>
                </div>

                <div ref={chatHistoryRef} className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <ChatMessageBubble key={index} message={msg} />
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === 'user' && (
                        <ChatMessageBubble message={{ role: 'model', parts: [{ text: '' }] }} />
                    )}
                    {error && <div className="text-red-400 text-center p-2 rounded-md bg-red-900/30">{error}</div>}
                </div>

                {/* Initial Suggestions - Show when chat is empty */}
                {messages.length <= 1 && !isLoading && (
                    <div className="p-4 pt-0">
                        <div className="text-center">
                            <p className="text-sm text-slate-400 mb-3">Try these suggestions</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {INITIAL_SUGGESTIONS.map(suggestion => (
                                    <button
                                        key={suggestion}
                                        onClick={() => handleSendMessage(suggestion)}
                                        className="bg-slate-700/80 text-slate-200 text-xs px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contextual Suggestions - Show after conversation starts */}
                {messages.length > 1 && !isLoading && currentSuggestions.length > 0 && (
                    <div className="p-4 pt-0">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {currentSuggestions.map(suggestion => (
                                <button
                                    key={suggestion}
                                    onClick={() => handleSendMessage(suggestion)}
                                    className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-full hover:bg-emerald-600/30 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-4 border-t border-slate-700 flex-shrink-0">
                    <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 sm:space-x-4">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={isLoading ? "GrowBrandi AI is analyzing..." : "What business challenge can I solve?"}
                            disabled={isLoading || !!error}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !userInput.trim() || !!error}
                            className="bg-cyan-600 text-white p-2.5 rounded-lg hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                        >
                            <FaPaperPlane className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ChatInterface;