import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, ChevronUp, Heart, ListMusic } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';
import { Slider } from '@/components/ui/slider'; // ShadCN component

export const PlayerOverlay = () => {
  const { currentTrack, isPlaying, play, pause, resume, next, prev, favorites, toggleFavorite } = useMusic();
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulated Progress (Replace with real YouTube events)
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  const isLiked = favorites.includes(currentTrack.id);

  return (
    <>
      {/* 1. MINI PLAYER (Persistent Bar) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none flex justify-center"
      >
        <div className="pointer-events-auto w-full max-w-4xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl p-3 pr-6 flex items-center gap-4 relative overflow-hidden group">
          
          {/* Progress Strip */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Album Art (Spinning) */}
          <div className="relative h-14 w-14 flex-shrink-0 cursor-pointer" onClick={() => setIsExpanded(true)}>
             <motion.img 
               src={currentTrack.cover} 
               alt={currentTrack.title}
               className="h-full w-full object-cover rounded-full border border-white/10 shadow-lg"
               animate={{ rotate: isPlaying ? 360 : 0 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             />
             <div className="absolute inset-0 m-auto w-3 h-3 bg-slate-900 rounded-full border border-white/20" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer" onClick={() => setIsExpanded(true)}>
            <h3 className="text-white font-medium truncate text-sm">{currentTrack.title}</h3>
            <p className="text-slate-400 text-xs truncate">{currentTrack.artist}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button onClick={() => toggleFavorite(currentTrack)} className={`p-2 transition-colors ${isLiked ? 'text-pink-500 fill-pink-500' : 'text-slate-400 hover:text-white'}`}>
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <button onClick={prev} className="text-slate-400 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              onClick={isPlaying ? pause : resume}
              className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-white/10"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button onClick={next} className="text-slate-400 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. EXPANDED VIEW (Full Screen Overlay) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-3xl flex flex-col"
          >
            {/* Collapse Handle */}
            <div className="p-6 flex justify-center cursor-pointer" onClick={() => setIsExpanded(false)}>
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto w-full">
              
              {/* Big Art */}
              <motion.div 
                layoutId="album-art"
                className="w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-cyan-900/20 mb-12 border border-white/10"
              >
                <img src={currentTrack.cover} className="w-full h-full object-cover" />
              </motion.div>

              {/* Info */}
              <div className="w-full flex justify-between items-end mb-8">
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">{currentTrack.title}</h2>
                  <p className="text-xl text-slate-400">{currentTrack.artist}</p>
                </div>
                <button onClick={() => toggleFavorite(currentTrack)} className={`p-3 rounded-full bg-white/5 ${isLiked ? 'text-pink-500' : 'text-white'}`}>
                   <Heart className={`w-8 h-8 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Scrubber */}
              <div className="w-full space-y-2 mb-12">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-1/3" />
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>1:23</span>
                  <span>{Math.floor(currentTrack.duration / 60)}:{String(currentTrack.duration % 60).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-between w-full max-w-xs">
                <button className="text-slate-400 hover:text-white"><Volume2 className="w-6 h-6" /></button>
                <button onClick={prev} className="text-white hover:scale-110 transition"><SkipBack className="w-10 h-10" /></button>
                <button 
                  onClick={isPlaying ? pause : resume}
                  className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition shadow-xl shadow-white/10"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <button onClick={next} className="text-white hover:scale-110 transition"><SkipForward className="w-10 h-10" /></button>
                <button className="text-slate-400 hover:text-white"><ListMusic className="w-6 h-6" /></button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};