// src/pages/Panic.tsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Hand, 
  Ear, 
  Wind, 
  Coffee, 
  CheckCircle2, 
  X, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- TYPES & DATA ---

type StepData = {
  id: number;
  count: number;
  title: string;
  instruction: string;
  icon: React.ElementType;
  color: string;
};

const STEPS: StepData[] = [
  {
    id: 1,
    count: 5,
    title: "Sight",
    instruction: "Look around. Find 5 things you can see.",
    icon: Eye,
    color: "text-blue-400"
  },
  {
    id: 2,
    count: 4,
    title: "Touch",
    instruction: "Feel 4 things around you (fabric, table, hair).",
    icon: Hand,
    color: "text-purple-400"
  },
  {
    id: 3,
    count: 3,
    title: "Sound",
    instruction: "Listen carefully. Name 3 sounds you hear.",
    icon: Ear,
    color: "text-pink-400"
  },
  {
    id: 4,
    count: 2,
    title: "Smell",
    instruction: "Identify 2 things you can smell, or breathe deep.",
    icon: Wind,
    color: "text-teal-400"
  },
  {
    id: 5,
    count: 1,
    title: "Taste",
    instruction: "Name 1 thing you can taste, or your favorite flavor.",
    icon: Coffee,
    color: "text-orange-400"
  }
];

// --- COMPONENT ---

const Panic = () => {
  const [, setLocation] = useLocation();
  const [stepIndex, setStepIndex] = useState(-1); // -1 is Welcome, 0-4 are steps, 5 is Complete
  const [subCount, setSubCount] = useState(0);    // Tracks user taps for each item (e.g., 0/5)

  // -- HAPTIC HELPER --
  const triggerHaptic = (pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // -- PROGRESS LOGIC --
  const handleTap = () => {
    const currentStep = STEPS[stepIndex];
    
    // Safety check
    if (!currentStep) return;

    const nextCount = subCount + 1;
    triggerHaptic(50); // Light tap feedback

    if (nextCount < currentStep.count) {
      setSubCount(nextCount);
    } else {
      // Step Complete
      setSubCount(currentStep.count); // Visually fill
      triggerHaptic([50, 50, 50]); // Success vibration
      
      // Small delay before next card to allow user to see "Complete" state
      setTimeout(() => {
        setStepIndex(prev => prev + 1);
        setSubCount(0);
      }, 600);
    }
  };

  const startSession = () => {
    triggerHaptic(100);
    setStepIndex(0);
  };

  const exitSession = () => {
    setLocation('/dashboard');
  };

  // -- KEYBOARD SUPPORT --
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (stepIndex === -1) startSession();
        else if (stepIndex >= 0 && stepIndex < 5) handleTap();
        else if (stepIndex === 5) exitSession();
      }
      if (e.code === 'Escape') exitSession();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepIndex, subCount]);


  // --- RENDER HELPERS ---

  // 1. Welcome Screen
  if (stepIndex === -1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        {/* Ambient Background */}
        <BackgroundPulse />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md p-8 text-center"
        >
          <div className="mb-8 flex justify-center">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="p-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Wind className="w-12 h-12 text-blue-300" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-light mb-4 text-white/90">Just Breathe.</h1>
          <p className="text-xl text-white/60 mb-12 leading-relaxed">
            You are safe. <br/> Let's ground yourself, together.
          </p>

          <Button 
            onClick={startSession}
            className="w-full h-14 text-lg bg-white text-slate-900 hover:bg-blue-50 rounded-2xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all"
          >
            Start Grounding
          </Button>
          
          <button 
            onClick={exitSession}
            className="mt-6 text-sm text-white/40 hover:text-white/80 transition-colors"
          >
            No thanks, take me back
          </button>
        </motion.div>
      </div>
    );
  }

  // 2. Completion Screen
  if (stepIndex >= STEPS.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <BackgroundPulse />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md p-8 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-6 w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50"
          >
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>
          
          <h2 className="text-3xl font-semibold mb-4">Well done.</h2>
          <p className="text-white/70 mb-8">
            You've successfully grounded yourself. Take this calmness with you.
          </p>
          
          <Button 
            onClick={exitSession}
            className="w-full h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  // 3. Main Step Screen (0-4)
  const currentStep = STEPS[stepIndex];
  const Icon = currentStep.icon;
  const progressPercent = ((stepIndex) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-slate-900 text-white transition-colors duration-1000">
       
       {/* Dynamic Background Gradient that shifts slightly per step */}
       <div className={`absolute inset-0 bg-gradient-to-br opacity-50 transition-all duration-1000 ease-in-out
         ${stepIndex === 0 ? 'from-blue-900/40 to-slate-900' : ''}
         ${stepIndex === 1 ? 'from-purple-900/40 to-slate-900' : ''}
         ${stepIndex === 2 ? 'from-pink-900/40 to-slate-900' : ''}
         ${stepIndex === 3 ? 'from-teal-900/40 to-slate-900' : ''}
         ${stepIndex === 4 ? 'from-orange-900/40 to-slate-900' : ''}
       `} />
       
       <BackgroundPulse />

       {/* Top Bar: Progress & Exit */}
       <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-white/50" 
               initial={{ width: 0 }}
               animate={{ width: `${progressPercent}%` }}
             />
          </div>
          <button 
             onClick={exitSession}
             className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/60 hover:text-white transition-all backdrop-blur-sm"
          >
            <X className="w-6 h-6" />
          </button>
       </div>

       {/* Main Card */}
       <AnimatePresence mode="wait">
         <motion.div
           key={currentStep.id}
           initial={{ opacity: 0, x: 50, scale: 0.95 }}
           animate={{ opacity: 1, x: 0, scale: 1 }}
           exit={{ opacity: 0, x: -50, scale: 0.95 }}
           transition={{ duration: 0.4, ease: "easeOut" }}
           className="relative z-10 w-full max-w-lg px-6"
         >
           <div className="glass-card bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
             
             {/* Header */}
             <div className="flex flex-col items-center mb-8">
                <div className={`p-4 rounded-full bg-white/5 border border-white/10 mb-4 ${currentStep.color}`}>
                   <Icon className="w-10 h-10" />
                </div>
                <h2 className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-2">
                   Step {currentStep.id} of 5
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">
                   {currentStep.title}
                </h3>
                <p className="text-lg text-white/80 max-w-xs mx-auto">
                   {currentStep.instruction}
                </p>
             </div>

             {/* Interactive Area */}
             <div className="grid grid-cols-5 gap-3 mb-10 h-16 items-center justify-center">
                {Array.from({ length: currentStep.count }).map((_, idx) => (
                   <motion.div
                     key={idx}
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     className="flex justify-center"
                   >
                     <div 
                       className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 ${
                         idx < subCount 
                           ? `bg-current ${currentStep.color} scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)]` 
                           : 'bg-white/10'
                       }`} 
                     />
                   </motion.div>
                ))}
             </div>

             {/* Action Button */}
             <Button
                onClick={handleTap}
                className="w-full h-16 text-xl rounded-2xl bg-white/90 hover:bg-white text-slate-900 transition-all active:scale-95 shadow-lg"
             >
                {subCount < currentStep.count ? "I found one" : "Great job"}
             </Button>

           </div>
         </motion.div>
       </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENT: Background Animation ---
const BackgroundPulse = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
     <motion.div
        animate={{ 
           scale: [1, 1.2, 1],
           opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
           duration: 8, 
           repeat: Infinity, 
           ease: "easeInOut" 
        }}
        className="absolute -top-[20%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-purple-500/20 blur-[100px]"
     />
     <motion.div
        animate={{ 
           scale: [1, 1.3, 1],
           opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ 
           duration: 10, 
           repeat: Infinity, 
           ease: "easeInOut",
           delay: 2
        }}
        className="absolute -bottom-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-500/20 blur-[100px]"
     />
  </div>
);

export default Panic;