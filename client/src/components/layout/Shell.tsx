// client/src/components/layout/Shell.tsx

import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useUI } from '@/context/UIContext';
import { Navbar } from './Navbar';
import { Background } from './Background';
import { Trash2 } from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { uiAtmosphere } = useUI();
  const [, setLocation] = useLocation();

  // 🔴 SYSTEM ACTION: GLOBAL RESET
  const handleSystemReset = () => {
    // Double confirmation for safety
    if (confirm("⚠️ SYSTEM RESET\n\nThis will permanently delete all your data, journals, and settings.\n\nAre you sure you want to proceed?")) {
      if (confirm("Final Check: This cannot be undone.")) {
        localStorage.clear();
        // Force reload to clear memory and restart flow
        window.location.href = "/";
      }
    }
  };

  // 1. Spacing Logic based on Atmosphere
  const spacingClasses = uiAtmosphere.spacingScale === 'loose'
    ? "p-6 md:p-12 gap-8"
    : "p-4 md:p-6 gap-4";

  // 2. Motion Logic: Only animate if preset is 'gentle'
  const isGentle = uiAtmosphere.motionPreset === 'gentle';

  return (
    <motion.div
      // A. Motion Preset Application (Gentle Fade vs Still)
      initial={isGentle ? { opacity: 0 } : undefined}
      animate={isGentle ? { opacity: 1 } : undefined}
      transition={{ duration: 0.5 }}

      // B. Background Gradient (Atmosphere)
      style={{ background: uiAtmosphere.backgroundGradient }}

      // C. Surface Tone (Exposed for CSS selectors)
      data-surface-tone={uiAtmosphere.surfaceTone}

      className={`relative min-h-screen w-full flex flex-col overflow-x-hidden transition-colors duration-700 ease-in-out`}
    >
      
      {/* 1. Global Atmosphere (Particles/Ambient Visuals) */}
      <Background />

      {/* 2. Global Navigation */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* 3. Main Content Slot */}
      <main className={`relative z-10 flex-grow w-full flex flex-col ${spacingClasses}`}>
        {children}
      </main>

      {/* 4. SYSTEM LEVEL RESET BUTTON (Fixed, Highest Z-Index) */}
      <button
        onClick={handleSystemReset}
        className="fixed bottom-6 right-6 z-[9999] w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ring-4 ring-red-500/20"
        title="System Reset (Delete All Data)"
        aria-label="Reset System"
      >
        <Trash2 className="w-5 h-5 fill-current" />
      </button>

    </motion.div>
  );
};