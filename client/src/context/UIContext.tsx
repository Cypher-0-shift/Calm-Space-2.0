// client/src/context/UIContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrainDecisionState } from '../brain/BrainDecisionState';
import { UIAtmosphere, deriveUIAtmosphere } from '../ui/UIAtmosphereController';

// ------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------

const DEFAULT_ATMOSPHERE: UIAtmosphere = {
  backgroundGradient: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
  surfaceTone: "balanced",
  motionPreset: "gentle",
  spacingScale: "standard",
};

// ------------------------------------------------------------------
// Context Shape
// ------------------------------------------------------------------

interface UIContextType {
  /** The current calculated atmosphere settings (pure data) */
  uiAtmosphere: UIAtmosphere;
  
  /** Purely updates atmosphere based on a brain decision snapshot */
  applyBrainDecision: (decision: BrainDecisionState) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// ------------------------------------------------------------------
// Provider
// ------------------------------------------------------------------

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure state only. No side effects, no API fetching.
  const [uiAtmosphere, setUiAtmosphere] = useState<UIAtmosphere>(DEFAULT_ATMOSPHERE);

  /**
   * Accepts a Brain Decision, derives the atmosphere purely, and updates state.
   */
  const applyBrainDecision = useCallback((decision: BrainDecisionState) => {
    // 1. Purely derive the visual atmosphere from the decision intent
    const newAtmosphere = deriveUIAtmosphere(decision.uiDecision);
    
    // 2. Update state (React will handle the propagation)
    setUiAtmosphere(newAtmosphere);
  }, []);

  return (
    <UIContext.Provider value={{ uiAtmosphere, applyBrainDecision }}>
      {children}
    </UIContext.Provider>
  );
};

// ------------------------------------------------------------------
// Hook
// ------------------------------------------------------------------

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
};