import React from 'react';
import { motion } from 'framer-motion';
import { Quote as QuoteIcon, Star, Sparkles, Copy, Share2 } from 'lucide-react';
import { Quote, useInspiration } from '@/context/InspirationContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const QuoteCard = ({ item }: { item: Quote }) => {
  const { toggleFavoriteQuote, favorites } = useInspiration();
  const { toast } = useToast();
  
  const isFavorite = favorites.includes(item.id);
  const isAffirmation = item.type === 'affirmation';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`"${item.text}" - ${item.author}`);
    toast({ title: "Copied to clipboard", description: "Ready to share." });
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteQuote(item.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={`
        relative overflow-hidden rounded-3xl p-8 transition-all duration-300 group
        ${isAffirmation 
          ? 'bg-gradient-to-br from-rose-100 via-purple-50 to-teal-100 border-none' 
          : 'bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50'}
      `}
    >
      {/* Background Decor */}
      <div className="absolute top-4 right-6 opacity-[0.07] pointer-events-none group-hover:scale-110 transition-transform duration-700">
        {isAffirmation ? <Sparkles size={120} /> : <QuoteIcon size={120} />}
      </div>

      <div className="relative z-10 flex flex-col h-full gap-6">
        
        {/* Header: Category & Actions */}
        <div className="flex justify-between items-start">
          <span className={`
            px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
            ${isAffirmation 
              ? 'bg-white/60 border-white/50 text-slate-600 backdrop-blur-sm' 
              : 'bg-slate-50 border-slate-100 text-slate-400'}
          `}>
            {item.category}
          </span>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 hover:bg-black/5 rounded-full">
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleFavorite}
              className={`h-8 w-8 rounded-full ${isFavorite ? 'text-amber-400 bg-amber-50 hover:bg-amber-100' : 'text-slate-400 hover:bg-black/5'}`}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* The Text */}
        <div className="flex-1 flex items-center">
          <blockquote className={`
            text-xl md:text-2xl leading-relaxed
            ${isAffirmation 
              ? 'font-sans font-bold text-slate-800 tracking-tight' 
              : 'font-serif font-medium text-slate-700 italic'}
          `}>
            "{item.text}"
          </blockquote>
        </div>

        {/* Footer: Author */}
        <div className={`mt-auto pt-4 border-t ${isAffirmation ? 'border-black/5' : 'border-slate-100'}`}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-px bg-current" />
            {item.author}
          </p>
        </div>
      </div>
    </motion.div>
  );
};