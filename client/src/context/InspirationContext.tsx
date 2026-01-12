import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// --- TYPES ---
export interface Quote {
  id: string;
  text: string;
  author: string;
  category: 'dreams' | 'inspiration' | 'motivation' | 'perseverance' | 'mindset' | 'mindfulness' | 'presence' | 'strength' | 'hope' | 'courage';
  type: 'quote' | 'affirmation';
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  readTime: string;
  author: string;
  isUserStory: boolean;
  likes: number;
  tags: string[];
}

export interface UserStorySubmission {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  approved: boolean;
}

interface InspirationContextType {
  quotes: Quote[];
  affirmations: Quote[];
  stories: Story[];
  favorites: string[]; // IDs of fav quotes
  likedStories: string[]; // IDs of liked stories
  userStories: UserStorySubmission[];
  
  // Actions
  toggleFavoriteQuote: (quoteId: string) => void;
  toggleLikeStory: (storyId: string) => void;
  submitStory: (data: { title: string; content: string; author: string }) => void;
}

const InspirationContext = createContext<InspirationContextType | undefined>(undefined);

// --- MOCK DATA ---
const INITIAL_QUOTES: Quote[] = [
  { id: 'q1', text: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.", author: "Dr. A.P.J. Abdul Kalam", category: 'dreams', type: 'quote' },
  { id: 'q2', text: "If you want to shine like a sun, first burn like a sun.", author: "Dr. A.P.J. Abdul Kalam", category: 'motivation', type: 'quote' },
  { id: 'q3', text: "You are not your thoughts. You are the observer of your thoughts.", author: "Eckhart Tolle", category: 'mindfulness', type: 'quote' },
  { id: 'q4', text: "The only way out is through.", author: "Robert Frost", category: 'courage', type: 'quote' },
  { id: 'q5', text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: 'strength', type: 'quote' },
  { id: 'q6', text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: 'hope', type: 'quote' },
];

const INITIAL_AFFIRMATIONS: Quote[] = [
  { id: 'a1', text: "I am worthy of love and respect", author: "Self", category: 'strength', type: 'affirmation' },
  { id: 'a2', text: "I choose peace over worry", author: "Self", category: 'mindfulness', type: 'affirmation' },
  { id: 'a3', text: "My feelings are valid and temporary", author: "Self", category: 'mindset', type: 'affirmation' },
  { id: 'a4', text: "I am stronger than my challenges", author: "Self", category: 'courage', type: 'affirmation' },
];

const INITIAL_STORIES: Story[] = [
  {
    id: 's1',
    title: "The Rocket Man's Journey",
    author: "Dr. A.P.J. Abdul Kalam",
    summary: "From selling newspapers to becoming India's Missile Man",
    content: "Born into a poor Tamil family in Rameswaram, Abdul Kalam's early life was marked by hardship...",
    category: "Scientific Achievement",
    readTime: "5 min",
    isUserStory: false,
    likes: 156,
    tags: ['Resilience', 'Science', 'India']
  },
  {
    id: 's2',
    title: "27 Years to Freedom",
    author: "Nelson Mandela",
    summary: "How imprisonment became preparation for leadership",
    content: "When Nelson Mandela walked into Robben Island prison in 1964...",
    category: "Leadership",
    readTime: "5 min",
    isUserStory: false,
    likes: 178,
    tags: ['Freedom', 'Leadership', 'Forgiveness']
  },
  {
    id: 'u1',
    title: "From Anxiety to Advocacy",
    author: "Sarah M.",
    summary: "How I transformed my social anxiety into a mission",
    content: "Three years ago, I couldn't order pizza over the phone...",
    category: "Mental Health",
    readTime: "4 min",
    isUserStory: true,
    likes: 47,
    tags: ['Anxiety', 'Growth']
  },
  {
    id: 'u2',
    title: "The Power of Small Habits",
    author: "Marcus T.",
    summary: "How daily 5-minute actions helped me overcome depression",
    content: "Depression hit me like a freight train after I lost my job...",
    category: "Recovery",
    readTime: "3 min",
    isUserStory: true,
    likes: 63,
    tags: ['Depression', 'Habits']
  }
];

export const InspirationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('inspire_fav_quotes', []);
  const [likedStories, setLikedStories] = useLocalStorage<string[]>('inspire_liked_stories', []);
  const [userStories, setUserStories] = useLocalStorage<UserStorySubmission[]>('inspire_user_submissions', []);

  // --- ACTIONS ---

  const toggleFavoriteQuote = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const toggleLikeStory = (id: string) => {
    setLikedStories(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const submitStory = (data: { title: string; content: string; author: string }) => {
    const newStory: UserStorySubmission = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString(),
      approved: false // Requires moderation simulation
    };
    setUserStories(prev => [...prev, newStory]);
  };

  return (
    <InspirationContext.Provider value={{
      quotes: INITIAL_QUOTES,
      affirmations: INITIAL_AFFIRMATIONS,
      stories: INITIAL_STORIES,
      favorites,
      likedStories,
      userStories,
      toggleFavoriteQuote,
      toggleLikeStory,
      submitStory
    }}>
      {children}
    </InspirationContext.Provider>
  );
};

export const useInspiration = () => {
  const context = useContext(InspirationContext);
  if (!context) throw new Error("useInspiration must be used within InspirationProvider");
  return context;
};