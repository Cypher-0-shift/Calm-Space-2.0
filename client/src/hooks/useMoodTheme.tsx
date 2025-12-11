import { useState, useEffect, createContext, useContext } from 'react';
import { moodThemes } from '@/utils/moodThemes';

type MoodType = 'Happy' | 'Sad' | 'Anxious' | 'Angry' | null;

interface MoodThemeContextType {
  mood: MoodType;
  theme: string;
  setMood: (mood: MoodType) => void;
}

const MoodThemeContext = createContext<MoodThemeContextType | undefined>(undefined);

export function MoodThemeProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMoodState] = useState<MoodType>(null);
  const [theme, setTheme] = useState(moodThemes.Default.background);

  useEffect(() => {
    // Load saved mood from localStorage
    const savedMood = localStorage.getItem('currentMood') as MoodType;
    if (savedMood) {
      setMoodState(savedMood);
    }
  }, []);

  useEffect(() => {
    // Update theme when mood changes
    if (mood && moodThemes[mood]) {
      setTheme(moodThemes[mood].background);
      localStorage.setItem('moodTheme', moodThemes[mood].background);
    } else {
      setTheme(moodThemes.Default.background);
      localStorage.setItem('moodTheme', moodThemes.Default.background);
    }
  }, [mood]);

  const setMood = (newMood: MoodType) => {
    setMoodState(newMood);
    if (newMood) {
      localStorage.setItem('currentMood', newMood);
    } else {
      localStorage.removeItem('currentMood');
    }
  };

  return (
    <MoodThemeContext.Provider value={{ mood, theme, setMood }}>
      {children}
    </MoodThemeContext.Provider>
  );
}

export function useMoodTheme() {
  const context = useContext(MoodThemeContext);
  if (context === undefined) {
    // Return safe defaults if provider is not found
    const savedMood = localStorage.getItem('currentMood') as MoodType;
    const savedTheme = localStorage.getItem('moodTheme') || moodThemes.Default.background;
    
    return {
      mood: savedMood,
      theme: savedTheme,
      setMood: (mood: MoodType) => {
        if (mood) {
          localStorage.setItem('currentMood', mood);
          localStorage.setItem('moodTheme', moodThemes[mood]?.background || moodThemes.Default.background);
        } else {
          localStorage.removeItem('currentMood');
          localStorage.setItem('moodTheme', moodThemes.Default.background);
        }
      }
    };
  }
  return context;
}
