import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaUser, FaRobot } from 'react-icons/fa';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const UserAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-zinc-600 flex items-center justify-center text-zinc-300 flex-shrink-0">
    <FaUser className="w-5 h-5" />
  </div>
);

const ModelAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white flex-shrink-0">
    <FaRobot className="w-5 h-5" />
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
    ? 'bg-blue-600 text-white rounded-br-none'
    : 'bg-zinc-700/80 text-zinc-200 rounded-bl-none';

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
        <div className="prose prose-sm prose-invert max-w-none prose-p:mb-2 prose-p:last:mb-0 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-a:text-cyan-400 prose-code:bg-zinc-800 prose-code:rounded-sm prose-code:px-1 prose-code:text-xs">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => <a className="hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
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
