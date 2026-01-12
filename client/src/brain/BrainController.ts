// client/src/brain/BrainController.ts

import { EmotionLabel } from "./EmotionModel";
import { BrainDecisionState } from "./BrainDecisionState";
import { runThinkingLoop, BrainInput, BrainState } from "./brainThinkingLoop";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export type BrainMode = "glimpse" | "full";

export interface BrainInputs {
  mood: EmotionLabel;
  intensity: number; // 0-10
  sessionDuration?: number; // minutes
  mode: BrainMode; // New execution mode requirement
}

// ------------------------------------------------------------------
// Internal Helpers (Pure Mapping Logic)
// ------------------------------------------------------------------

/**
 * Maps the internal BrainState (Focus/Energy) to UI parameters.
 */
function mapToUIDecision(state: BrainState): BrainDecisionState["uiDecision"] {
  // Default values
  let themeTone: "calm" | "neutral" | "uplifting" = "neutral";
  let animationIntensity: "low" | "medium" = "medium";
  let contentDensity: "minimal" | "normal" = "normal";

  // Logic based on Focus strategy from Thinking Loop
  if (state.focus === "stabilization") {
    themeTone = "calm";
    animationIntensity = "low"; // Reduce noise
    contentDensity = "minimal"; // Reduce cognitive load
  } else if (state.focus === "enhancement") {
    themeTone = "uplifting";
    animationIntensity = "medium";
    contentDensity = "normal";
  } else {
    // Maintenance
    themeTone = "neutral";
    animationIntensity = "low";
    contentDensity = "normal";
  }

  return { themeTone, animationIntensity, contentDensity };
}

/**
 * Maps the internal BrainState to Dashboard actions.
 */
function mapToDashboardDecision(
  state: BrainState
): BrainDecisionState["dashboardDecision"] {
  let primaryAction: "music" | "journal" | "chat" | "grounding" | "none" = "none";
  let allowSecondaryActions = true;

  if (state.focus === "stabilization") {
    // If energy is high (anxiety/anger), prioritize grounding
    if (state.energyLevel === "high") {
      primaryAction = "grounding";
      allowSecondaryActions = false; // Focus mode
    } else {
      // If energy is low (sadness), gentle journaling or music
      primaryAction = "journal";
    }
  } else if (state.focus === "enhancement") {
    primaryAction = "journal"; // Gratitude / reflection
  }

  return {
    reflectionText: state.reasoning,
    primaryAction,
    allowSecondaryActions,
  };
}

// ------------------------------------------------------------------
// Main Controller Function
// ------------------------------------------------------------------

export function runBrain(
  inputs: BrainInputs
): BrainDecisionState {
  // 1. Prepare Input for Thinking Loop
  const loopInput: BrainInput = {
    mood: inputs.mood,
    intensity: inputs.intensity,
    sessionDuration: inputs.sessionDuration,
  };

  // 2. Run the Thinking Loop (Observe -> Interpret -> Decide -> Learn)
  // The loop is pure and unaware of "modes"
  let brainState = runThinkingLoop(loopInput);

  // --------------------------------------------------------------
  // CONSTRAINT APPLICATION: GLIMPSE MODE
  // --------------------------------------------------------------
  if (inputs.mode === "glimpse") {
    // Constraint 1: Trust level cap (Glimpse implies lack of deep history)
    // If trust was calculated as 'high', downgrade it to 'medium'
    if (brainState.trustLevel === "high") {
      brainState = { ...brainState, trustLevel: "medium" };
    }
    // Note: Since this controller is pure, "No Persistence" is achieved 
    // simply by the caller (System/Context) not saving the result when in 'glimpse' mode.
  }

  // 3. Map Internal State to Final Decision Contract
  const uiDecision = mapToUIDecision(brainState);
  const dashboardDecision = mapToDashboardDecision(brainState);

  // 4. Derive Confidence (Signal Strength Logic)
  // High intensity = clearer signal = higher confidence
  // Low intensity = potential noise = lower confidence
  let confidenceLevel: "low" | "medium" | "high" = "medium";
  
  if (inputs.intensity >= 8) confidenceLevel = "high";
  if (inputs.intensity <= 2) confidenceLevel = "low";

  // Constraint 2: Confidence cap for Glimpse Mode
  // A glimpse should never claim "high" confidence due to lack of session context
  if (inputs.mode === "glimpse" && confidenceLevel === "high") {
    confidenceLevel = "medium";
  }

  // 5. Construct Final State
  return {
    emotionalSnapshot: {
      interpretedEmotion: brainState.interpretedEmotion,
      energyLevel: brainState.energyLevel,
      trustLevel: brainState.trustLevel,
    },
    uiDecision,
    dashboardDecision,
    recommendationDecision: {
      type: dashboardDecision.primaryAction,
      reason: brainState.reasoning,
    },
    meta: {
      lastUpdated: Date.now(),
      confidenceLevel,
    },
  };
}