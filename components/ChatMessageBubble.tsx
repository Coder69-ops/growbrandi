import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>
);

const ModelAvatar = () => (
     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 8-2 2 2 2"/><path d="M12 16h-2"/><path d="M12 4h-2"/><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9c2.4 0 4.6.9 6.3 2.5"/><path d="M16 8h4v4"/><path d="M18 17a2 2 0 0 0 2-2v-2H12v4h2Z"/></svg>
    </div>
);

const AiTypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5">
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
    </div>
);

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const text = message.parts.map(part => part.text).join("");

  const messageContainerClasses = isUser ? 'flex-row-reverse' : 'flex-row';
  const bubbleClasses = isUser
    ? 'bg-teal-600 text-white rounded-br-none'
    : 'bg-slate-700/80 text-slate-200 rounded-bl-none';

  if (!text && !isUser) {
    return (
        <div className={`flex items-start gap-3 ${messageContainerClasses}`}>
            <ModelAvatar />
            <div className={`rounded-2xl py-3 px-4 max-w-lg lg:max-w-xl break-words ${bubbleClasses}`}>
                <AiTypingIndicator />
            </div>
        </div>
    )
  }

  return (
    <div className={`flex items-start gap-3 ${messageContainerClasses}`}>
      {isUser ? <UserAvatar /> : <ModelAvatar />}
      <div
        className={`rounded-2xl p-4 max-w-lg lg:max-w-xl break-words ${bubbleClasses}`}
      >
        <div className="prose prose-sm prose-invert max-w-none prose-p:mb-2 prose-p:last:mb-0 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-a:text-cyan-400 prose-code:bg-slate-800 prose-code:rounded-sm prose-code:px-1 prose-code:text-xs">
           <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({node, ...props}) => <a className="hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
            }}
          >
            {text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
