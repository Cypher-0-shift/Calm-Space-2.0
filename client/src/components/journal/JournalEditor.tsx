import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EditorData {
  title: string;
  content: string;
  prompt?: string;
  mood?: string;
}

interface JournalEditorProps {
  data: EditorData;
  onChange: (data: EditorData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({ data, onChange, onSave, onCancel }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-3xl mx-auto h-full flex flex-col"
    >
      {/* The Paper Surface */}
      <div className="bg-white flex-1 rounded-[2rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 relative overflow-hidden flex flex-col">
        
        {/* Subtle Paper Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

        {/* Prompt Banner (if exists) */}
        {data.prompt && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 flex gap-3 items-start backdrop-blur-sm"
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Daily Prompt</div>
              <p className="text-purple-900 font-medium text-sm md:text-base">{data.prompt}</p>
            </div>
          </motion.div>
        )}

        {/* Title Input */}
        <Input
          value={data.title}
          onChange={(e) => onChange({...data, title: e.target.value})}
          placeholder="Give this moment a title..."
          className="text-3xl md:text-4xl font-serif font-medium border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-slate-200 mb-6 bg-transparent"
        />

        {/* Main Content Area */}
        <Textarea
          autoFocus
          value={data.content}
          onChange={(e) => onChange({...data, content: e.target.value})}
          placeholder="Start writing here..."
          className="flex-1 w-full resize-none border-none p-0 text-lg md:text-xl leading-[1.8] text-slate-600 font-serif placeholder:text-slate-200 focus-visible:ring-0 bg-transparent selection:bg-purple-100"
        />

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 relative z-10">
          <Button variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            Cancel
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-300">
              {data.content.length} chars
            </span>
            <Button 
              size="lg" 
              onClick={onSave}
              className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Save to Encrypted Vault
            </Button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};