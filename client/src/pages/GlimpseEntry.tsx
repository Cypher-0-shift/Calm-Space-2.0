// client/src/pages/GlimpseEntry.tsx

import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useBrain } from '@/context/BrainContext';

const GlimpseEntry = () => {
  const [, setLocation] = useLocation();
  const { recomputeBrain } = useBrain();

  const handleEnterQuietly = () => {
    // Mark glimpse as seen (entry experience completed)
    localStorage.setItem("calm_glimpse_seen", "true");

    // Initialize Brain in ephemeral glimpse mode
    recomputeBrain({
      mood: "neutral",
      intensity: 2,
      sessionDuration: 0,
      mode: "glimpse"
    });

    // Let router decide next step
    setLocation("/");
  };

  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-12"
      >
        {/* Message */}
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 tracking-tight">
            A quiet space, just for now.
          </h1>
          <p className="text-lg text-slate-500 font-light leading-relaxed">
            Nothing is saved. No one is watching.
            <br />
            Simply breathe and be here.
          </p>
        </div>

        {/* Single Action */}
        <div className="pt-8 flex justify-center">
          <Button
            variant="ghost"
            size="lg"
            className="rounded-full px-10 h-14 text-lg font-normal border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-500"
            onClick={handleEnterQuietly}
          >
            Enter quietly
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default GlimpseEntry;
