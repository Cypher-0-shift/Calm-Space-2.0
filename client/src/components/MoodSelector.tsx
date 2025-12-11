import { useState } from 'react';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import AppToast from './AppToast';

type MoodType = 'Happy' | 'Sad' | 'Anxious' | 'Angry';

const moods = [
  { id: 'Happy' as MoodType, emoji: '😊', label: 'Happy', className: 'mood-happy' },
  { id: 'Sad' as MoodType, emoji: '😢', label: 'Sad', className: 'mood-sad' },
  { id: 'Anxious' as MoodType, emoji: '😰', label: 'Anxious', className: 'mood-anxious' },
  { id: 'Angry' as MoodType, emoji: '😠', label: 'Angry', className: 'mood-angry' },
];

interface MoodSelectorProps {
  onMoodSelect?: (mood: MoodType) => void;
  currentMood?: MoodType | null;
}

const MoodSelector = ({ onMoodSelect, currentMood }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(currentMood || null);
  const [showToast, setShowToast] = useState(false);
  const { setMood } = useMoodTheme();

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    setMood(mood);
    localStorage.setItem('currentMood', mood);
    
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
    
    setShowToast(true);
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-6">How are you feeling today?</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {moods.map((mood) => (
          <div
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={`mood-selector glass rounded-2xl p-6 cursor-pointer transition-all duration-300 ${mood.className} ${
              selectedMood === mood.id ? 'ring-4 ring-purple-300' : ''
            }`}
          >
            <div className="text-4xl mb-2">{mood.emoji}</div>
            <div className="font-semibold">{mood.label}</div>
          </div>
        ))}
      </div>
      
      <AppToast 
        message="Mood updated successfully! 🎉" 
        visible={showToast}
        onHide={() => setShowToast(false)}
      />
    </div>
  );
};

export default MoodSelector;
