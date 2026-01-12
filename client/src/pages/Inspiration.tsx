import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Quote, Heart, Star, PenTool, 
  Users, Coffee, Globe, Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InspirationProvider, useInspiration } from '@/context/InspirationContext';

// Components
import { StoryCard } from '@/components/inspiration/StoryCard';
import { QuoteCard } from '@/components/inspiration/QuoteCard';
import { ComposeModal } from '@/components/inspiration/ComposeModal';
import { PeerChat } from '@/components/inspiration/PeerChat';
import { PageContainer } from "@/components/layout/PageContainer";

const InspirationContent = () => {
  const { quotes, affirmations, stories } = useInspiration();
  const [activeTab, setActiveTab] = useState<'all' | 'quotes' | 'stories' | 'connect'>('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // --- FILTER LOGIC ---
  const getDisplayItems = () => {
    const allQuotes = [...quotes, ...affirmations].map(q => ({ type: 'quote', data: q }));
    const allStories = stories.map(s => ({ type: 'story', data: s }));
    
    // Simple shuffle/interleave for "All" view
    const mixed = [];
    const maxLen = Math.max(allQuotes.length, allStories.length);
    for(let i=0; i<maxLen; i++) {
      if (allStories[i]) mixed.push(allStories[i]);
      if (allQuotes[i]) mixed.push(allQuotes[i]);
    }
    return mixed;
  };

  const items = getDisplayItems();

  return (
    <PageContainer size="wide">
      <div className="pb-32 space-y-8">
        
        {/* 1. HERO HEADER */}
        <div className="relative bg-[#0F172A] text-white py-20 px-6 overflow-hidden rounded-[2.5rem] mt-4 shadow-xl">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" 
          />
          
          <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-6 max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-sm font-bold uppercase tracking-widest text-purple-200"
              >
                <Sparkles className="w-4 h-4" /> Daily Wisdom
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-serif font-medium leading-tight"
              >
                Library of Hope
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-300 text-xl leading-relaxed font-light"
              >
                A quiet space to find strength in the words of others. <br className="hidden md:block" />
                Connect, share, and realize you are never truly alone.
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 w-full md:w-auto"
            >
              <Button 
                onClick={() => setIsComposeOpen(true)}
                className="h-16 px-10 rounded-full bg-white text-slate-900 hover:bg-purple-50 font-medium text-lg shadow-2xl shadow-white/10 transition-all hover:scale-[1.02]"
              >
                <PenTool className="w-5 h-5 mr-3" /> Share Your Story
              </Button>
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Globe className="w-4 h-4" /> 
                <span>128 people sharing right now</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 2. NAVIGATION BAR (Sticky) */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-slate-200/50 py-4 shadow-sm rounded-2xl px-6">
          <div className="flex items-center justify-between">
            
            {/* Scrollable Tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {[
                { id: 'all', label: 'Discover', icon: Sparkles },
                { id: 'quotes', label: 'Daily Quotes', icon: Quote },
                { id: 'stories', label: 'Stories', icon: Heart },
                { id: 'connect', label: 'Peer Connect', icon: Users }, // ✨ NEW TAB
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter (Visual only for now) */}
            <button className="hidden md:flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* 3. MAIN CONTENT AREA */}
        <div className="py-4">
          <AnimatePresence mode="wait">
            
            {/* VIEW: PEER CHAT (New Feature) */}
            {activeTab === 'connect' ? (
              <motion.div
                key="connect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8 text-center max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-slate-800 mb-3">Community Connection</h2>
                  <p className="text-slate-500">
                    Sometimes, speaking to a stranger is easier than speaking to a friend. 
                    This is a safe, anonymous space to connect with one person at a time.
                  </p>
                </div>
                <PeerChat />
              </motion.div>
            ) : (
              /* VIEW: GRID (Masonry Layout) */
              <motion.div 
                key="feed"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
              >
                {items
                  .filter(item => {
                    if (activeTab === 'all') return true;
                    if (activeTab === 'quotes' && item.type === 'quote') return true;
                    if (activeTab === 'stories' && item.type === 'story') return true;
                    return false;
                  })
                  .map((item: any, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "100px" }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="break-inside-avoid"
                    >
                      {item.type === 'quote' ? (
                        <QuoteCard item={item.data} />
                      ) : (
                        <StoryCard story={item.data} />
                      )}
                    </motion.div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
          
          {/* End of Feed Indicator */}
          {activeTab !== 'connect' && (
            <div className="mt-24 text-center space-y-4">
              <div className="w-16 h-1 bg-slate-200 rounded-full mx-auto" />
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Coffee className="w-6 h-6 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  You are all caught up
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MODALS */}
        <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
      </div>
    </PageContainer>
  );
};

// Wrap with Provider for Data Access
const Inspiration = () => (
  <InspirationProvider>
    <InspirationContent />
  </InspirationProvider>
);

export default Inspiration;