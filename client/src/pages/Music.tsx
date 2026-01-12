import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Heart, Plus, Search, Music as MusicIcon, List,
  Shuffle, Repeat, X, Trash2, Check,
  Disc, BarChart2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageContainer } from "@/components/layout/PageContainer";

/* =======================
   TYPES & INTERFACES
======================= */

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  mood?: string;
  coverGradient?: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  trackIds: string[];
  coverGradient: string;
  createdAt: number;
}

/* =======================
   MOCK DATA
======================= */

const MOCK_TRACKS: Track[] = [
  { id: 't1', title: 'Midnight Rainfall', artist: 'Nature Sounds', duration: 185, mood: 'Sleep', audioUrl: '#', coverGradient: 'from-blue-900 to-slate-900' },
  { id: 't2', title: 'Deep Focus Alpha', artist: 'Brainwave', duration: 240, mood: 'Focus', audioUrl: '#', coverGradient: 'from-indigo-500 to-purple-600' },
  { id: 't3', title: 'Morning Sunlight', artist: 'Acoustic Cafè', duration: 165, mood: 'Morning', audioUrl: '#', coverGradient: 'from-orange-100 to-amber-200' },
  { id: 't4', title: 'Forest Walk', artist: 'Ambient Earth', duration: 300, mood: 'Relax', audioUrl: '#', coverGradient: 'from-emerald-600 to-teal-800' },
  { id: 't5', title: 'Lo-Fi Study Beats', artist: 'Chillhop', duration: 195, mood: 'Focus', audioUrl: '#', coverGradient: 'from-pink-300 to-rose-400' },
  { id: 't6', title: 'Ocean Waves', artist: 'Nature Sounds', duration: 420, mood: 'Sleep', audioUrl: '#', coverGradient: 'from-cyan-700 to-blue-900' },
  { id: 't7', title: 'Piano Solitude', artist: 'Classical Moods', duration: 210, mood: 'Melancholy', audioUrl: '#', coverGradient: 'from-slate-200 to-slate-400' },
  { id: 't8', title: 'Zen Garden', artist: 'Meditation Bells', duration: 330, mood: 'Meditate', audioUrl: '#', coverGradient: 'from-green-200 to-emerald-400' },
];

const MOOD_FILTERS = ['All', 'Focus', 'Sleep', 'Relax', 'Morning', 'Meditate'];

const GRADIENTS = [
  'bg-gradient-to-br from-rose-400 to-orange-300',
  'bg-gradient-to-br from-indigo-400 to-cyan-400',
  'bg-gradient-to-br from-emerald-400 to-teal-500',
  'bg-gradient-to-br from-fuchsia-500 to-purple-600',
  'bg-gradient-to-br from-slate-500 to-slate-800',
  'bg-gradient-to-br from-amber-200 to-yellow-400',
];

/* =======================
   UTILS
======================= */

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};


const getRandomGradient = () => GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

// --- COMPONENTS ---

// 1. MINI COMPONENT: Track Row
const TrackRow = ({ 
  track, 
  isPlaying, 
  isCurrent, 
  isLiked, 
  onPlay, 
  onToggleLike, 
  onAddToPlaylist 
}: { 
  track: Track, 
  isPlaying: boolean, 
  isCurrent: boolean, 
  isLiked: boolean,
  onPlay: () => void,
  onToggleLike: (e: React.MouseEvent) => void,
  onAddToPlaylist: (e: React.MouseEvent) => void
}) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
      className={`
        group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300
        ${isCurrent ? 'bg-slate-100 shadow-sm border border-slate-200/50' : 'hover:bg-white/40 border border-transparent'}
      `}
      onClick={onPlay}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Cover / Icon */}
        <div className={`
          relative w-12 h-12 rounded-lg overflow-hidden shadow-sm flex items-center justify-center text-white
          bg-gradient-to-br ${track.coverGradient || 'from-slate-400 to-slate-600'}
        `}>
          {isCurrent && isPlaying ? (
            <div className="flex items-end gap-[2px] h-4 pb-1">
               <motion.div animate={{ height: [4, 12, 6, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-white rounded-full" />
               <motion.div animate={{ height: [8, 16, 8, 4, 8] }} transition={{ repeat: Infinity, duration: 1.1 }} className="w-1 bg-white rounded-full" />
               <motion.div animate={{ height: [6, 10, 14, 8, 6] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1 bg-white rounded-full" />
            </div>
          ) : (
            <MusicIcon className="w-5 h-5 opacity-80" />
          )}
          
          {/* Hover Play Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Play className="w-5 h-5 fill-white text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h4 className={`font-medium text-sm tracking-tight ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
            {track.title}
          </h4>
          <span className="text-xs text-slate-400">{track.artist}</span>
        </div>
      </div>

      {/* Actions (Right Side) */}
      <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
        <span className="text-xs text-slate-400 font-mono w-10 text-right">
          {formatTime(track.duration)}
        </span>
        
        <button 
          onClick={onToggleLike}
          className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} 
          />
        </button>

        <button 
          onClick={onAddToPlaylist}
          className="p-2 rounded-full hover:bg-slate-200/50 transition-colors"
        >
          <Plus className="w-4 h-4 text-slate-400 hover:text-slate-900" />
        </button>
      </div>
    </motion.div>
  );
};

// 2. MINI COMPONENT: Playlist Card
const PlaylistCard = ({ playlist, onClick, onDelete }: { playlist: Playlist, onClick: () => void, onDelete: (e: React.MouseEvent) => void }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative flex-shrink-0 w-40 space-y-3 cursor-pointer group"
      onClick={onClick}
    >
      <div className={`
        relative w-40 h-40 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-500 overflow-hidden
        ${playlist.coverGradient}
      `}>
        <div className="absolute inset-0 flex items-center justify-center">
          <List className="w-10 h-10 text-white/50 group-hover:scale-110 transition-transform duration-500" />
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
           <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
             <Play className="w-4 h-4 fill-slate-900 text-slate-900 ml-0.5" />
           </div>
        </div>

        {/* Delete Button (Hover) */}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(e); }}
          className="absolute top-2 right-2 p-1.5 bg-white/20 hover:bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-0.5">
        <h3 className="font-medium text-slate-800 text-sm truncate">{playlist.name}</h3>
        <p className="text-xs text-slate-400">{playlist.trackIds.length} tracks</p>
      </div>
    </motion.div>
  );
};

// 3. MINI COMPONENT: Modal Base
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-medium text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const MusicPage = () => {
  // --- STATE ---
  // Using Local State to mock a robust experience, pretending these persist or sync with context
  const [activeTab, setActiveTab] = useState<'all' | 'liked' | string>('all'); // 'all', 'liked', or playlist ID
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState('All');
  
  // Data State
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('calm_playlists');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('calm_liked_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal States
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isAddToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [trackToAddId, setTrackToAddId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  // Player State (Local Simulation of global context)
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0); // 0-100
  const [isMuted, setIsMuted] = useState(false);

  // --- REFS & EFFECTS ---
  
  useEffect(() => {
    localStorage.setItem('calm_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('calm_liked_ids', JSON.stringify(likedTrackIds));
  }, [likedTrackIds]);

  // Simulation of audio progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // --- ACTIONS ---

  const handlePlay = (trackId: string) => {
    if (currentTrackId === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackId(trackId);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const toggleLike = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    if (likedTrackIds.includes(trackId)) {
      setLikedTrackIds(prev => prev.filter(id => id !== trackId));
    } else {
      setLikedTrackIds(prev => [...prev, trackId]);
    }
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName,
      trackIds: [],
      coverGradient: getRandomGradient(),
      createdAt: Date.now()
    };
    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    setCreateModalOpen(false);
  };

  const deletePlaylist = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // prevent opening playlist
    if (confirm("Delete this playlist?")) {
      setPlaylists(prev => prev.filter(p => p.id !== id));
      if (activeTab === id) setActiveTab('all');
    }
  };

  const openAddToPlaylist = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();
    setTrackToAddId(trackId);
    setAddToPlaylistOpen(true);
  };

  const addTrackToPlaylist = (playlistId: string) => {
    if (!trackToAddId) return;
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId && !pl.trackIds.includes(trackToAddId)) {
        return { ...pl, trackIds: [...pl.trackIds, trackToAddId] };
      }
      return pl;
    }));
    setAddToPlaylistOpen(false);
    setTrackToAddId(null);
  };

  // --- DERIVED DATA ---

  const currentTrack = MOCK_TRACKS.find(t => t.id === currentTrackId);

  const filteredTracks = useMemo(() => {
    let tracks = MOCK_TRACKS;

    // 1. Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tracks = tracks.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
    }

    // 2. Filter by Mood
    if (selectedMood !== 'All') {
      tracks = tracks.filter(t => t.mood === selectedMood);
    }

    // 3. Filter by Tab (Playlist/Liked)
    if (activeTab === 'liked') {
      tracks = tracks.filter(t => likedTrackIds.includes(t.id));
    } else if (activeTab !== 'all') {
      const playlist = playlists.find(p => p.id === activeTab);
      if (playlist) {
        tracks = tracks.filter(t => playlist.trackIds.includes(t.id));
      } else {
        tracks = []; // Playlist deleted or not found
      }
    }

    return tracks;
  }, [searchQuery, selectedMood, activeTab, likedTrackIds, playlists]);

  // --- RENDER ---

  return (
    <PageContainer>
      <div className="relative min-h-screen pb-32">
        
        {/* --- HEADER SECTION --- */}
        <header className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-light tracking-tighter text-slate-900">Music</h1>
              <p className="text-slate-500 mt-2 font-light">Soundscapes for focus, sleep, and clarity.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative group w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search tracks..."
                className="
                  w-full pl-10 pr-4 py-2.5 
                  bg-white border border-slate-200 rounded-full 
                  text-sm text-slate-800 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300
                  transition-all shadow-sm
                "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Mood Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {MOOD_FILTERS.map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
                  ${selectedMood === mood 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
                `}
              >
                {mood}
              </button>
            ))}
          </div>
        </header>

        {/* --- PLAYLISTS ROW (Horizontal Scroll) --- */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium tracking-tight text-slate-800">Your Collections</h2>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3 h-3" /> New Playlist
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-1 -mx-1 scrollbar-hide snap-x">
            {/* Liked Songs Card (Special) */}
            <motion.div 
              whileHover={{ y: -5 }}
              onClick={() => setActiveTab(activeTab === 'liked' ? 'all' : 'liked')}
              className={`
                relative flex-shrink-0 w-40 h-40 rounded-2xl cursor-pointer group overflow-hidden snap-start
                bg-gradient-to-br from-rose-100 to-pink-200 border border-white/50
                ${activeTab === 'liked' ? 'ring-2 ring-rose-400 ring-offset-2' : ''}
              `}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="p-3 bg-white/50 backdrop-blur-md rounded-full text-rose-500 shadow-sm">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div className="text-center">
                  <span className="block font-medium text-rose-900">Liked Songs</span>
                  <span className="text-xs text-rose-700/70">{likedTrackIds.length} tracks</span>
                </div>
              </div>
            </motion.div>

            {/* User Playlists */}
            {playlists.map(pl => (
              <div key={pl.id} className={`snap-start ${activeTab === pl.id ? 'ring-2 ring-slate-400 ring-offset-2 rounded-2xl' : ''}`}>
                <PlaylistCard 
                  playlist={pl} 
                  onClick={() => setActiveTab(activeTab === pl.id ? 'all' : pl.id)}
                  onDelete={(e) => deletePlaylist(e, pl.id)}
                />
              </div>
            ))}
            
            {/* Create New Placeholder (At end) */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={() => setCreateModalOpen(true)}
              className="flex-shrink-0 w-40 h-40 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <Plus className="w-8 h-8 opacity-50" />
              <span className="text-xs font-medium">Create New</span>
            </motion.button>
          </div>
        </section>

        {/* --- MAIN TRACK LIST --- */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium tracking-tight text-slate-800 flex items-center gap-2">
              {activeTab === 'all' && 'All Tracks'}
              {activeTab === 'liked' && <><Heart className="w-4 h-4 fill-rose-500 text-rose-500"/> Liked Songs</>}
              {activeTab !== 'all' && activeTab !== 'liked' && playlists.find(p => p.id === activeTab)?.name}
            </h2>
            
            {/* Sort/Filter options could go here */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
               <BarChart2 className="w-3 h-3" />
               <span>{filteredTracks.length} tracks</span>
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredTracks.length > 0 ? (
                filteredTracks.map(track => (
                  <TrackRow 
                    key={track.id}
                    track={track}
                    isPlaying={currentTrackId === track.id && isPlaying}
                    isCurrent={currentTrackId === track.id}
                    isLiked={likedTrackIds.includes(track.id)}
                    onPlay={() => handlePlay(track.id)}
                    onToggleLike={(e) => toggleLike(e, track.id)}
                    onAddToPlaylist={(e) => openAddToPlaylist(e, track.id)}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200"
                >
                  <Disc className="w-12 h-12 opacity-20" />
                  <div>
                    <p className="font-medium text-slate-600">No tracks found</p>
                    <p className="text-sm">Try adjusting your mood filters or search.</p>
                    {activeTab === 'liked' && <p className="text-xs mt-2 text-rose-400">Go explore and like some songs!</p>}
                  </div>
                  {activeTab !== 'all' && (
                    <Button variant="outline" onClick={() => setActiveTab('all')}>
                      View All Tracks
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* --- PERSISTENT PLAYER --- */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 z-40"
          >
            <div className="
              max-w-5xl mx-auto
              bg-white/80 backdrop-blur-xl 
              border border-white/40 ring-1 ring-black/5
              shadow-2xl shadow-slate-900/10
              rounded-2xl p-4 md:p-5
              flex flex-col md:flex-row items-center gap-4 md:gap-8
            ">
              {/* Progress Bar (Absolute top) */}
              <div className="absolute top-0 left-4 right-4 h-1 bg-slate-100 rounded-full overflow-hidden -mt-[1px]">
                 <motion.div 
                   className="h-full bg-slate-900" 
                   style={{ width: `${progress}%` }}
                   layoutId="progress"
                 />
              </div>

              {/* Track Info */}
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className={`
                  w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-white shadow-md
                  bg-gradient-to-br ${currentTrack.coverGradient}
                `}>
                  <MusicIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-slate-900 truncate">{currentTrack.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{currentTrack.artist}</p>
                </div>
                {/* Mobile Like Btn */}
                <button onClick={(e) => toggleLike(e, currentTrack.id)} className="md:hidden ml-auto">
                   <Heart className={`w-5 h-5 ${likedTrackIds.includes(currentTrack.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-2 w-full md:w-1/3">
                <div className="flex items-center gap-6">
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <Shuffle className="w-4 h-4" />
                  </button>
                  <button className="text-slate-800 hover:text-slate-600 transition-colors">
                    <SkipBack className="w-6 h-6 fill-current" />
                  </button>
                  
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  <button className="text-slate-800 hover:text-slate-600 transition-colors">
                    <SkipForward className="w-6 h-6 fill-current" />
                  </button>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <Repeat className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Volume & Extras */}
              <div className="hidden md:flex items-center justify-end gap-4 w-1/3">
                <div className="flex items-center gap-2 w-32">
                   <button onClick={() => setIsMuted(!isMuted)}>
                     {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-slate-400" />}
                   </button>
                   <input 
                     type="range" 
                     min="0" max="1" step="0.01"
                     value={isMuted ? 0 : volume}
                     onChange={(e) => setVolume(parseFloat(e.target.value))}
                     className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-900"
                   />
                </div>
                <button 
                  onClick={(e) => toggleLike(e, currentTrack.id)} 
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                   <Heart className={`w-5 h-5 transition-colors ${likedTrackIds.includes(currentTrack.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALS --- */}

      {/* 1. Create Playlist */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <Modal 
            isOpen={isCreateModalOpen} 
            onClose={() => setCreateModalOpen(false)} 
            title="New Collection"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Playlist Name</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g. Morning Meditation"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && createPlaylist()}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                <Button onClick={createPlaylist} disabled={!newPlaylistName.trim()}>Create Playlist</Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* 2. Add to Playlist */}
      <AnimatePresence>
        {isAddToPlaylistOpen && (
          <Modal 
            isOpen={isAddToPlaylistOpen} 
            onClose={() => setAddToPlaylistOpen(false)} 
            title="Add to Playlist"
          >
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {playlists.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No playlists yet.</p>
                  <button onClick={() => {setAddToPlaylistOpen(false); setCreateModalOpen(true)}} className="text-slate-900 underline text-sm mt-2">Create one</button>
                </div>
              ) : (
                playlists.map(pl => (
                  <button
                    key={pl.id}
                    onClick={() => addTrackToPlaylist(pl.id)}
                    className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${pl.coverGradient}`} />
                      <div className="text-left">
                        <p className="font-medium text-slate-800 text-sm">{pl.name}</p>
                        <p className="text-xs text-slate-400">{pl.trackIds.length} tracks</p>
                      </div>
                    </div>
                    {trackToAddId && pl.trackIds.includes(trackToAddId) && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                ))
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>

    </PageContainer>
  );
};

export default MusicPage;