export interface Recommendation {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string; // Emoji or Lucide icon name
  priority: number;
  type: 'action' | 'content' | 'route';
  actionData?: string; // Route path or action ID
}

export type BrainPresence = 'cold' | 'warming' | 'active';

export interface UIState {
  tone: 'neutral' | 'calm' | 'anxious' | 'cheerful';
  
  theme: {
    background: 'soft-dark' | 'light' | 'dim';
    blur: 'low' | 'medium' | 'high';
  };

  motion: {
    speed: 'very-slow' | 'slow' | 'normal';
  };

  layout: {
    density: 'airy' | 'normal';
  };

  visibility: {
    showChat: boolean;
    showPanic: boolean;
    showGames: boolean;
  };

  // 🧠 NEW: Brain Presence & Dynamic Recommendations
  brainPresence: BrainPresence;
  suggestions: Recommendation[];
}

export const INITIAL_UI_STATE: UIState = {
  tone: 'neutral',
  theme: { background: 'light', blur: 'medium' },
  motion: { speed: 'normal' },
  layout: { density: 'normal' },
  visibility: { showChat: false, showPanic: false, showGames: false },
  brainPresence: 'cold',
  suggestions: []
};