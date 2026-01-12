import React from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../../hooks/useUI';

interface SmartCardProps {
  label: string;
  sublabel?: string;
  onClick: () => void;
  priority?: number; // 1 = Primary (Big), 2 = Secondary, 0 = Subtle
  icon?: React.ReactNode;
}

export const SmartCard: React.FC<SmartCardProps> = ({ label, sublabel, onClick, priority = 1, icon }) => {
  const { tokens } = useUI();

  // Style logic based on Priority
  const isPrimary = priority === 1;
  const isSubtle = priority === 0;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden text-left
        flex flex-col justify-center
        transition-all ${tokens.transitionClasses}
        ${tokens.blurClasses} /* Glass Effect */
        
        /* Conditional Sizing */
        ${isPrimary ? 'p-8 h-48 md:col-span-2' : 'p-6 h-40 col-span-1'}
        ${isSubtle ? 'opacity-70 hover:opacity-100 bg-transparent border-transparent' : 'shadow-lg border-white/20 ring-1 ring-white/10'}
        
        rounded-3xl
      `}
    >
      {/* Visual Texture (Optional Shine) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {icon && <div className="mb-4 text-2xl opacity-80">{icon}</div>}
        
        <h3 className={`font-medium ${isPrimary ? 'text-2xl' : 'text-lg'} ${tokens.textClasses}`}>
          {label}
        </h3>
        
        {sublabel && (
          <p className="mt-2 text-sm opacity-60 font-light tracking-wide">
            {sublabel}
          </p>
        )}
      </div>
    </motion.button>
  );
};