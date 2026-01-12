import React from 'react';
import { motion } from 'framer-motion';

export const TypingDot = () => {
  const dotVariants = {
    start: { y: 0 },
    end: { y: -5 }
  };

  const container = {
    start: { transition: { staggerChildren: 0.2 } },
    end: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="flex w-full justify-start mb-4">
      <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl rounded-tl-sm border border-white/30 flex gap-1">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            initial="start"
            animate="end"
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="w-2 h-2 bg-slate-500/50 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};