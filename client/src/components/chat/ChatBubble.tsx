import React from 'react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  text: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ role, text }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`
          max-w-[80%] p-4 rounded-2xl text-sm md:text-base leading-relaxed
          ${isUser 
            ? 'bg-white/20 text-slate-800 backdrop-blur-sm rounded-tr-sm' 
            : 'bg-white/60 text-slate-900 shadow-sm backdrop-blur-md rounded-tl-sm border border-white/40'}
        `}
      >
        {text}
      </div>
    </motion.div>
  );
};