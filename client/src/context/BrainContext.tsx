// client/src/context/BrainContext.tsx

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { BrainDecisionState } from "../brain/BrainDecisionState";
import { runBrain, BrainInputs } from "../brain/BrainController";

interface BrainContextType {
  brainState: BrainDecisionState | null;
  isBrainReady: boolean;
  recomputeBrain: (inputs: BrainInputs) => void;
}

const BrainContext = createContext<BrainContextType | undefined>(undefined);

export const BrainProvider = ({ children }: { children: ReactNode }) => {
  const [brainState, setBrainState] = useState<BrainDecisionState | null>(null);
  const [isBrainReady, setIsBrainReady] = useState(false);

  /**
   * Triggers the BrainController to process inputs and update state.
   * Calling this manually is required to initialize the brain.
   */
  const recomputeBrain = useCallback((inputs: BrainInputs) => {
    const decision = runBrain(inputs);
    setBrainState(decision);
    
    // Mark brain as ready after first successful run
    if (!isBrainReady) {
      setIsBrainReady(true);
    }
  }, [isBrainReady]);

  return (
    <BrainContext.Provider value={{ brainState, isBrainReady, recomputeBrain }}>
      {children}
    </BrainContext.Provider>
  );
};

export const useBrain = () => {
  const context = useContext(BrainContext);
  if (!context) {
    throw new Error("useBrain must be used within a BrainProvider");
  }
  return context;
};