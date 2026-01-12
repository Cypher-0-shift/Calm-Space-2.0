import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMood } from '@/context/MoodContext';
import { useUI } from '@/hooks/useUI'; // ✅ ADD THIS
import { BrainDecisionState } from '@/brain/BrainDecisionState'; // ✅ ADD THIS
import { PremiumBackground } from '@/components/ui/PremiumBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import MoodSelector from '@/components/ui/MoodSelector';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const MoodCheck = () => {
  const [, setLocation] = useLocation();
  const { currentMood } = useMood();
  const { applyBrainDecision } = useUI(); // ✅ UI bridge

  // 🧠 Apply brain decision when mood is selected
  useEffect(() => {
    if (!currentMood) return;

    const decision: BrainDecisionState = {
      uiDecision: {
        mood: currentMood,
        intensity: 'normal',
      },
    };

    applyBrainDecision(decision);
  }, [currentMood, applyBrainDecision]);

  const handleMoodLogged = () => {
    setTimeout(() => {
      setLocation('/suggestion');
    }, 800);
  };

  const handleSkip = () => {
    // Optional: apply a neutral decision
    const decision: BrainDecisionState = {
      uiDecision: {
        mood: 'neutral',
        intensity: 'low',
      },
    };

    applyBrainDecision(decision);
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden">
      <PremiumBackground />

      <GlassCard
        className="max-w-4xl w-full p-8 md:p-12 border-white/40 dark:border-white/10"
        delay={0.2}
      >
        <div className="text-center mb-10 space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-7xl mb-6 inline-block"
          >
            🎭
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-light text-slate-800 dark:text-slate-100 tracking-tight">
            How are you feeling?
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 font-light max-w-xl mx-auto leading-relaxed">
            Select your current mood to unlock a personalized sanctuary experience tailored just for you.
          </p>
        </div>

        <div className="mb-12">
          <MoodSelector onLog={handleMoodLogged} />
        </div>

        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-slate-500 hover:text-slate-700 hover:bg-black/5 dark:hover:bg-white/10 rounded-full px-8"
          >
            Skip for Now
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default MoodCheck;
