import React from 'react';
import { useUI } from './hooks/useUI';
import { Background } from './Background';

// Production Ready: specific layout for focus tasks
export const OnboardingShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tokens } = useUI();

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden ${tokens.textClasses} ${tokens.transitionClasses}`}>
      <Background />
      
      <main className="relative z-10 w-full max-w-md p-8 flex flex-col items-center text-center">
        {/* Glass Container for the Form */}
        <div className={`w-full rounded-3xl p-8 ${tokens.blurClasses} shadow-2xl ring-1 ring-white/10`}>
          {children}
        </div>
      </main>
    </div>
  );
};