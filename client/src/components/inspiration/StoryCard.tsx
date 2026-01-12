import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, User, X, BookOpen } from 'lucide-react';
import { Story, useInspiration } from '@/context/InspirationContext';
import { Button } from '@/components/ui/button';

export const StoryCard = ({ story }: { story: Story }) => {
  const { toggleLikeStory, likedStories } = useInspiration();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isLiked = likedStories.includes(story.id);
  const likeCount = story.likes + (isLiked ? 1 : 0);

  return (
    <>
      {/* 1. COMPACT CARD VIEW */}
      <motion.div
        layoutId={`story-card-${story.id}`}
        onClick={() => setIsExpanded(true)}
        className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 hover:border-purple-100 transition-all duration-500 relative overflow-hidden h-full flex flex-col"
      >
        {/* Decor Gradient Line */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header Tags */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-md bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
              {story.category}
            </span>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" /> {story.readTime}
          </span>
        </div>

        {/* Title & Summary */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-700 transition-colors font-serif leading-tight">
            {story.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
            {story.summary}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="w-3 h-3" />
            </div>
            {story.author}
          </div>
          
          <div className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-pink-500' : 'text-slate-400 group-hover:text-pink-400'}`}>
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount}
          </div>
        </div>
      </motion.div>

      {/* 2. EXPANDED READING MODAL */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsExpanded(false)}
            />
            
            <motion.div
              layoutId={`story-card-${story.id}`}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide z-10 flex flex-col"
            >
              {/* Sticky Close Button */}
              <div className="sticky top-0 right-0 p-6 flex justify-end bg-gradient-to-b from-white via-white/90 to-transparent z-20 pointer-events-none">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="rounded-full pointer-events-auto bg-white/80 backdrop-blur shadow-sm border-slate-100 hover:bg-slate-100"
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                >
                  <X className="w-4 h-4 text-slate-600" />
                </Button>
              </div>

              <div className="px-8 md:px-12 pb-16 -mt-12">
                {/* Modal Header */}
                <div className="text-center mb-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-widest mb-6">
                    {story.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight">
                    {story.title}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <span className="font-medium text-slate-900">{story.author}</span>
                    <span>•</span>
                    <span>{story.readTime} read</span>
                  </div>
                </div>

                {/* The Content */}
                <div className="prose prose-lg prose-slate max-w-none font-serif leading-loose text-slate-600 first-letter:text-5xl first-letter:font-bold first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                  {story.content.split('\n\n').map((para, i) => (
                    <p key={i} className="mb-6">{para}</p>
                  ))}
                </div>

                {/* Footer Interaction */}
                <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">Did this resonate?</p>
                  <Button 
                    size="lg" 
                    className={`rounded-full px-8 h-14 gap-3 text-lg transition-all shadow-xl shadow-purple-900/5 ${isLiked ? 'bg-pink-50 text-pink-600 border-2 border-pink-100 hover:bg-pink-100' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                    variant="ghost"
                    onClick={(e) => { e.stopPropagation(); toggleLikeStory(story.id); }}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : 'fill-none'}`} />
                    {isLiked ? 'Resonated' : 'This Resonates'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};