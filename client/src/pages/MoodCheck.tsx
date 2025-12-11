import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMoodTheme } from '@/hooks/useMoodTheme';
import ParticlesBackground from '@/components/ParticlesBackground';
import MoodSelector from '@/components/MoodSelector';
import { Button } from '@/components/ui/button';

const MoodCheck = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { setMood } = useMoodTheme();

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setMood(mood as any);
  };

  const handleContinue = () => {
    if (selectedMood) {
      localStorage.setItem('currentMood', selectedMood);
    }
    setLocation('/suggestion');
  };

  const handleSkip = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <ParticlesBackground />
      
      <div className="glass rounded-3xl p-8 md:p-12 max-w-4xl mx-4 animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How Are You Feeling?
          </h1>
          <p className="text-lg text-gray-600">
            Select your current mood to get personalized recommendations
          </p>
        </div>

        <MoodSelector onMoodSelect={handleMoodSelect} />

        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="px-6 py-3"
          >
            Skip for Now
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={!selectedMood}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            Get Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoodCheck;
