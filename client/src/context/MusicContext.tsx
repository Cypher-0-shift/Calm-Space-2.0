import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage'; // Assuming you have this from Journal

// --- TYPES ---
export interface Track {
  id: string; // YouTube Video ID
  title: string;
  artist: string;
  cover: string;
  duration: number; // in seconds
  album?: string;
  mood?: string[];
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  cover?: string;
  isSystem?: boolean; // e.g. "Favorites"
}

interface MusicContextType {
  // State
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  playlists: Playlist[];
  favorites: string[]; // List of Track IDs
  
  // Controls
  play: (track: Track, context?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  
  // Library Actions
  toggleFavorite: (track: Track) => void;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Persistence
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>('calm_playlists', []);
  const [favorites, setFavorites] = useLocalStorage<string[]>('calm_favorites', []);

  // Audio Engine (Mocking HTML5 Audio / YouTube IFrame API)
  // In production, you would wrap the YouTube IFrame API here.
  useEffect(() => {
    if (isPlaying && currentTrack) {
      console.log(`[AudioEngine] Playing: ${currentTrack.title} (${currentTrack.id})`);
    }
  }, [isPlaying, currentTrack]);

  // --- ACTIONS ---

  const play = useCallback((track: Track, context?: Track[]) => {
    setCurrentTrack(track);
    if (context) setQueue(context);
    else if (queue.length === 0) setQueue([track]);
    
    setIsPlaying(true);
  }, [queue]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const resume = useCallback(() => setIsPlaying(true), []);

  const next = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const nextTrack = queue[(idx + 1) % queue.length];
    play(nextTrack);
  }, [currentTrack, queue, play]);

  const prev = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const prevTrack = queue[(idx - 1 + queue.length) % queue.length];
    play(prevTrack);
  }, [currentTrack, queue, play]);

  const seek = useCallback((time: number) => {
    console.log(`[AudioEngine] Seek to ${time}`);
    // Implement YouTube SeekTo here
  }, []);

  // --- LIBRARY MANAGEMENT ---

  const toggleFavorite = useCallback((track: Track) => {
    setFavorites(prev => {
      if (prev.includes(track.id)) return prev.filter(id => id !== track.id);
      return [...prev, track.id];
    });
  }, [setFavorites]);

  const createPlaylist = useCallback((name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  }, [setPlaylists]);

  const addToPlaylist = useCallback((playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        // Prevent duplicates
        if (p.tracks.find(t => t.id === track.id)) return p;
        return { ...p, tracks: [...p.tracks, track], cover: p.cover || track.cover };
      }
      return p;
    }));
  }, [setPlaylists]);

  const removeFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
      }
      return p;
    }));
  }, [setPlaylists]);

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      queue,
      playlists,
      favorites,
      play,
      pause,
      resume,
      next,
      prev,
      seek,
      toggleFavorite,
      createPlaylist,
      addToPlaylist,
      removeFromPlaylist
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};