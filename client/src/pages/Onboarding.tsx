// client/src/pages/Onboarding.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrainAPI } from '@/api/BrainAPI';
import { useBrain } from '@/context/BrainContext';

const SCREENS = [
  {
    id: 'visual_density',
    title: "When you’re here, how should CalmSpace feel?",
    options: [
      { id: 'quiet', label: 'Like a quiet room', value: 'low' },
      { id: 'flowing', label: 'Like something flowing in the background', value: 'medium' },
      { id: 'window', label: 'Like a window I can look through', value: 'high' },
      { id: 'unsure', label: 'I don’t know yet', value: 'neutral' }
    ]
  },
  {
    id: 'silence_reaction',
    title: "When things go quiet, what feels better?",
    options: [
      { id: 'silence', label: 'Silence itself', value: 'silence' },
      { id: 'words', label: 'Soft words', value: 'words' },
      { id: 'sound', label: 'Gentle sound', value: 'sound' },
      { id: 'focus', label: 'Something to focus on', value: 'focus' }
    ]
  },
  {
    id: 'decision_style',
    title: "How do you like choosing things?",
    options: [
      { id: 'one', label: 'Tell me one good option', value: 'curated' },
      { id: 'few', label: 'Show me a few, I’ll decide', value: 'balanced' },
      { id: 'explore', label: 'Let me explore on my own', value: 'open' },
      { id: 'change', label: 'I change depending on the day', value: 'dynamic' }
    ]
  },
  {
    id: 'emotional_proximity',
    title: "When something feels heavy, what helps more?",
    options: [
      { id: 'understood', label: 'Being understood', value: 'empathy' },
      { id: 'distracted', label: 'Being distracted', value: 'distraction' },
      { id: 'guided', label: 'Being guided gently', value: 'guidance' },
      { id: 'alone', label: 'Being left alone', value: 'solitude' }
    ]
  },
  {
    id: 'connection_time',
    title: "When do you usually open an app like this?",
    options: [
      { id: 'morning', label: 'Morning', value: 'morning' },
      { id: 'evening', label: 'Evening', value: 'evening' },
      { id: 'late', label: 'Late night', value: 'night' },
      { id: 'change', label: 'It changes', value: 'dynamic' }
    ]
  },
  {
    id: 'attention_span',
    title: "How long do you usually stay once you open an app?",
    options: [
      { id: 'minute', label: 'Just a minute', value: 'short' },
      { id: 'few', label: 'A few minutes', value: 'medium' },
      { id: 'while', label: 'I settle in for a while', value: 'long' },
      { id: 'mood', label: 'Depends on the mood', value: 'dynamic' }
    ]
  },
  {
    id: 'expression_comfort',
    title: "When thoughts come up, what feels easier?",
    options: [
      { id: 'writing', label: 'Writing them out', value: 'journal' },
      { id: 'saying', label: 'Saying them (chat)', value: 'chat' },
      { id: 'passing', label: 'Letting them pass', value: 'passive' },
      { id: 'unsure', label: 'I’m not sure', value: 'neutral' }
    ]
  },
  {
    id: 'control_surrender',
    title: "Right now, do you prefer to…",
    options: [
      { id: 'control', label: 'Stay in control', value: 'autonomous' },
      { id: 'guided', label: 'Be gently guided', value: 'directive' },
      { id: 'observe', label: 'Just observe', value: 'passive' },
      { id: 'decide_not', label: 'Not decide anything', value: 'surrender' }
    ]
  }
];

const Onboarding = () => {
  const [, setLocation] = useLocation();
  const { recomputeBrain, isBrainReady } = useBrain();
  
  const [showIntro, setShowIntro] = useState(true); 
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isInitializing, setIsInitializing] = useState(false); 

  // Watch for Brain Ready Signal
  useEffect(() => {
    if (isInitializing && isBrainReady) {
      setLocation("/");
    }
  }, [isInitializing, isBrainReady, setLocation]);

  const handleSelect = (value: string) => {
    const screen = SCREENS[currentStep];
    
    // Save locally via BrainAPI (Fire & Forget)
    BrainAPI.notifyAction('SET_PREFERENCE', { key: `calm_pref_${screen.id}`, value });
    
    setSelections(prev => ({ ...prev, [screen.id]: value }));

    // Auto-advance
    setTimeout(() => {
      if (currentStep < SCREENS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        finishOnboarding();
      }
    }, 350);
  };

  const finishOnboarding = async () => {
    // 1. Mark onboarding as complete 
    localStorage.setItem("calm_onboarding_complete", "true");
    
    // 2. Notify Brain (Fire & Forget - DO NOT AWAIT)
    BrainAPI.notifyAction('ONBOARDING_COMPLETE');

    // 3. Initialize Brain Logic (Cold Start)
    setIsInitializing(true);
    recomputeBrain({ 
      mood: 'neutral', 
      intensity: 2, 
      sessionDuration: 0 
    });
  };

  const currentScreen = SCREENS[currentStep];
  const progress = ((currentStep + 1) / SCREENS.length) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background ambient blob */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        <AnimatePresence mode="wait">
          
          {/* 🔴 STATE: LOADING / INITIALIZING */}
          {isInitializing ? (
            <motion.div
              key="initializing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
              </div>
              <h2 className="text-xl font-light text-slate-600">
                Getting your space ready…
              </h2>
            </motion.div>
          ) : showIntro ? (
            /* 🟢 STEP 1: THE INTRO SCREEN */
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center space-y-10 py-8"
            >
              <div className="flex justify-center">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <Sparkles className="w-6 h-6 text-slate-400" />
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl font-serif text-slate-900 tracking-tight">One thing to know</h1>
                
                <div className="text-lg text-slate-600 leading-relaxed space-y-6 max-w-md mx-auto font-light">
                  <p>
                    CalmSpace doesn’t guess who you are.<br />
                    It learns slowly — the way a person would.
                  </p>
                  <p>
                    The next few choices help it understand how to be with you: <br/>
                    <span className="text-slate-800 font-normal">your pace, your comfort, your boundaries.</span>
                  </p>
                  <p className="text-base text-slate-500">
                    There are no right answers. You can skip anything.<br />
                    These aren’t labels. They’re just starting points.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  size="lg"
                  onClick={() => setShowIntro(false)}
                  className="rounded-full px-8 py-6 bg-slate-900 text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] text-lg font-normal"
                >
                  Okay, let’s begin
                </Button>
              </div>
            </motion.div>
          ) : (
            /* 🟢 STEP 2: MICRO-ONBOARDING */
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-12">
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-slate-900" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2 text-right">Step {currentStep + 1} of {SCREENS.length}</p>
              </div>

              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
              >
                <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight leading-tight">
                  {currentScreen.title}
                </h1>

                <div className="grid gap-3">
                  {currentScreen.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt.value)}
                      className={`
                        group relative w-full p-5 text-left rounded-2xl border transition-all duration-300
                        ${selections[currentScreen.id] === opt.value 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.02]' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-md hover:scale-[1.01]'}
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium">{opt.label}</span>
                        {selections[currentScreen.id] === opt.value && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                          >
                            <Check className="w-5 h-5" />
                          </motion.div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center pt-8">
                  <Button 
                    variant="ghost" 
                    onClick={finishOnboarding}
                    className="text-slate-400 hover:text-slate-600 text-sm font-normal"
                  >
                    Skip setup
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;