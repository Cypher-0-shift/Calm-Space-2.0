// client/src/pages/ProfileSetup.tsx

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

/* --------------------------------------------------------------------------------
   CONFIGURATION: Tuning Questions
   -------------------------------------------------------------------------------- */
const QUESTIONS = [
  {
    id: 'support_style',
    text: "When something feels heavy, what helps more?",
    subtext: "We’ll adjust how we respond to difficult moments.",
    options: [
      { label: "Being understood", value: "empathy" },
      { label: "Being gently distracted", value: "distraction" },
      { label: "Being guided step by step", value: "guidance" },
      { label: "I don’t know yet", value: "neutral" },
    ],
  },
  {
    id: 'silence_pref',
    text: "When things go quiet here, what feels better?",
    subtext: "Silence can be empty, or it can be a presence.",
    options: [
      { label: "Silence itself", value: "silence" },
      { label: "Soft words", value: "words" },
      { label: "Gentle sounds", value: "sound" },
      { label: "I don’t know yet", value: "neutral" },
    ],
  },
  {
    id: 'energy_level',
    text: "When you open a space like this, your energy is usually…",
    subtext: "This helps us match your pace.",
    options: [
      { label: "Low, I need softness", value: "low" },
      { label: "Steady, I can engage", value: "medium" },
      { label: "Restless, I need grounding", value: "high" },
      { label: "I don’t know yet", value: "neutral" },
    ],
  },
  {
    id: 'memory_permission',
    text: "Would you like this space to remember what helps you?",
    subtext: "You are always in control of your memories.",
    options: [
      { label: "Yes, gently over time", value: "persistent" },
      { label: "Only during this session", value: "session" },
      { label: "No, keep things temporary", value: "ephemeral" },
      { label: "I don’t know yet", value: "neutral" },
    ],
  },
];

const ProfileSetup: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Local state for answers before committing to storage
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = QUESTIONS[currentStep];

  /* --------------------------------------------------------------------------------
     HANDLERS
     -------------------------------------------------------------------------------- */
  
  const handleSelect = (value: string) => {
    // 1. Record answer
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // 2. Advance or Finish
    if (currentStep < QUESTIONS.length - 1) {
      // Small delay for UX feel
      setTimeout(() => setCurrentStep((prev) => prev + 1), 250);
    } else {
      finishSetup(newAnswers);
    }
  };

  const handleSkip = () => {
    // Advancing without recording a specific preference (implies neutral)
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishSetup(answers);
    }
  };

  const finishSetup = (finalAnswers: Record<string, string>) => {
    // 1. Commit preferences to Local Storage (No API calls)
    Object.entries(finalAnswers).forEach(([key, value]) => {
      localStorage.setItem(`calm_pref_${key}`, value);
    });

    // 2. Mark onboarding as complete to unlock Full Mode features
    localStorage.setItem("calm_onboarding_complete", "true");

    // 3. Navigate to Dashboard (Main Space)
    // Using window.location.href to ensure a clean state reload if needed, 
    // or setLocation for SPA transition. 
    setLocation("/"); 
  };

  /* --------------------------------------------------------------------------------
     RENDER
     -------------------------------------------------------------------------------- */
  
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Subtle Ambient Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-slate-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Header / Question */}
            <div className="space-y-4 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-light text-slate-900 leading-tight tracking-tight">
                {currentQuestion.text}
              </h1>
              <p className="text-lg text-slate-500 font-light">
                {currentQuestion.subtext}
              </p>
            </div>

            {/* Options */}
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="group w-full text-left p-6 rounded-2xl bg-white border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex items-center justify-between"
                >
                  <span className="text-lg font-light text-slate-800 group-hover:text-slate-900">
                    {option.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-300 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* Footer / Navigation */}
            <div className="flex items-center justify-center pt-4">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-slate-400 hover:text-slate-600 font-light text-sm"
              >
                Skip for now
              </Button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots (Optional, subtle) */}
      <div className="absolute bottom-8 flex gap-2">
        {QUESTIONS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentStep ? "w-6 bg-slate-900" : "w-1.5 bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileSetup;