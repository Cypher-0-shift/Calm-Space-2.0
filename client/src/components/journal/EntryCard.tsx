import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  date: string;
  prompt?: string;
}

interface EntryCardProps {
  entry: JournalEntry;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export const EntryCard: React.FC<EntryCardProps> = ({ entry, onClick, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-purple-100 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Decorative Gradient on Hover */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header: Date & Mood */}
      <div className="flex justify-between items-start mb-3 pl-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-purple-400 transition-colors">
            {format(new Date(entry.date), 'MMM dd')}
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-400 group-hover:text-slate-500">
            {format(new Date(entry.date), 'h:mm a')}
          </span>
        </div>
        
        {entry.mood && (
          <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-500 uppercase tracking-wide group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
            {entry.mood}
          </span>
        )}
      </div>
      
      {/* Title */}
      <h3 className="pl-2 font-serif text-lg font-medium text-slate-800 mb-2 line-clamp-1 group-hover:text-purple-700 transition-colors">
        {entry.title || "Untitled Entry"}
      </h3>
      
      {/* Content Preview */}
      <p className="pl-2 text-sm text-slate-500 leading-relaxed line-clamp-3 font-serif opacity-80 group-hover:opacity-100 transition-opacity">
        {entry.content}
      </p>

      {/* Delete Action (Visible on Hover) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
          onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};