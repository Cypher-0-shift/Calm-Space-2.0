import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, Plus, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusic, Track } from '@/context/MusicContext';

interface TrackRowProps {
  track: Track;
  index: number;
  contextList?: Track[]; // The list this track belongs to (for next/prev logic)
}

export const TrackRow: React.FC<TrackRowProps> = ({ track, index, contextList }) => {
  const { play, currentTrack, isPlaying, toggleFavorite, favorites, addToPlaylist } = useMusic();
  
  // Is this specific track active?
  const isCurrent = currentTrack?.id === track.id;
  const isLiked = favorites.includes(track.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling if you have row click events
    play(track, contextList);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // For now, this just logs. In a real app, this would open a modal to select a playlist.
    // We can default to the first playlist for this demo:
    console.log("Open playlist selector for:", track.title);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={handlePlay}
      className={`
        group flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-300
        ${isCurrent 
          ? 'bg-white/10 border border-white/10 shadow-lg shadow-black/5' 
          : 'hover:bg-white/5 border border-transparent hover:border-white/5'}
      `}
    >
      {/* 1. Album Art + Play Overlay */}
      <div className="relative w-12 h-12 mr-4 flex-shrink-0">
        <img 
          src={track.cover} 
          alt={track.title} 
          className={`w-full h-full object-cover rounded-xl shadow-md transition-transform duration-500 ${isCurrent && isPlaying ? 'scale-105 shadow-cyan-500/20' : ''}`} 
        />
        
        {/* Overlay: Shows 'Equalizer' if playing, or 'Play' on hover */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {isCurrent && isPlaying ? (
            <BarChart2 className="w-5 h-5 text-cyan-400 fill-current animate-pulse" />
          ) : (
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          )}
        </div>
      </div>
      
      {/* 2. Track Info */}
      <div className="flex-1 min-w-0 mr-4">
        <h4 className={`font-medium truncate text-base ${isCurrent ? 'text-cyan-400' : 'text-slate-200 group-hover:text-white'}`}>
          {track.title}
        </h4>
        <p className="text-xs text-slate-500 truncate group-hover:text-slate-400 transition-colors">
          {track.artist}
        </p>
      </div>

      {/* 3. Meta & Actions (Hidden on mobile, visible on desktop hover) */}
      <div className="flex items-center gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        
        {/* Mood Tag (Desktop only) */}
        {track.mood && (
          <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] uppercase text-slate-400 tracking-wider">
            {track.mood[0]}
          </span>
        )}

        {/* Favorite Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleFavorite}
          className={`h-8 w-8 hover:bg-white/10 ${isLiked ? 'text-pink-500' : 'text-slate-500 hover:text-pink-400'}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </Button>

        {/* Add Playlist Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleAddToPlaylist}
          className="h-8 w-8 text-slate-500 hover:text-cyan-400 hover:bg-white/10 hidden md:flex"
        >
          <Plus className="w-4 h-4" />
        </Button>

        {/* Duration */}
        <span className="text-xs font-mono text-slate-600 group-hover:text-slate-500 w-10 text-right">
          {formatTime(track.duration)}
        </span>
      </div>
    </motion.div>
  );
};