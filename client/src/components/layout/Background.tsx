import React from 'react';
import { useUI } from '@/context/UIContext';

export const Background: React.FC = () => {
  const { uiAtmosphere } = useUI();

  // Neutral, safe fallback (only if atmosphere is somehow missing)
  const backgroundStyle = uiAtmosphere?.backgroundGradient
    ? { background: uiAtmosphere.backgroundGradient }
    : {
        background:
          'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
      };

  return (
    <div
      className="absolute inset-0 z-0 transition-all duration-700 ease-in-out"
      style={backgroundStyle}
    >
      {/* Depth / vignette layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 pointer-events-none" />
    </div>
  );
};
