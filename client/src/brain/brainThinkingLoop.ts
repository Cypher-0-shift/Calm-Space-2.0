// client/src/brain/brainThinkingLoop.ts

import { EmotionLabel } from "./EmotionModel";

// ------------------------------------------------------------------
// Constants & Configuration
// ------------------------------------------------------------------

// Arousal categorization for energy derivation
const HIGH_AROUSAL_MOODS: EmotionLabel[] = ["anxious", "stressed", "angry"];
const LOW_AROUSAL_MOODS: EmotionLabel[] = ["sad"];
// 'neutral', 'confused', 'happy' defaults to Medium unless intensity is extreme

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface BrainInput {
  mood: EmotionLabel;
  intensity: number; // 0-10
  sessionDuration?: number; // minutes
}

export interface BrainState {
  interpretedEmotion: EmotionLabel;
  energyLevel: "low" | "medium" | "high";
  trustLevel: "low" | "medium" | "high";
  reasoning: string;
  focus: "stabilization" | "enhancement" | "maintenance";
}

// ------------------------------------------------------------------
// 1. Observe: Validate and Normalize Inputs
// ------------------------------------------------------------------
function observe(input: BrainInput): BrainInput {
  // Clamp intensity 0-10
  const normalizedIntensity = Math.min(10, Math.max(0, input.intensity));
  
  return {
    mood: input.mood,
    intensity: normalizedIntensity,
    sessionDuration: input.sessionDuration ?? 0,
  };
}

// ------------------------------------------------------------------
// 2. Interpret: Derive Internal State (Energy & Trust)
// ------------------------------------------------------------------
function interpret(input: BrainInput) {
  const { mood, intensity, sessionDuration } = input;

  // 2a. Derive Energy Level (Conservative Arousal Logic)
  let energyLevel: "low" | "medium" | "high" = "medium";

  if (HIGH_AROUSAL_MOODS.includes(mood)) {
    // High arousal emotions always imply high energy expenditure
    energyLevel = "high";
  } else if (LOW_AROUSAL_MOODS.includes(mood)) {
    energyLevel = "low";
  } else if (mood === "happy" && intensity > 7) {
    // Happiness is medium arousal unless ecstatic
    energyLevel = "high";
  }

  // 2b. Derive Symbolic Trust Level
  // Vulnerability (high intensity negative) implies Trust
  let trustLevel: "low" | "medium" | "high" = "low";

  if (intensity > 6 || (sessionDuration && sessionDuration > 10)) {
    trustLevel = "medium";
  }
  
  // High vulnerability sharing or very long sessions
  if (intensity > 8 || (sessionDuration && sessionDuration > 30)) {
    trustLevel = "high";
  }

  return {
    mood,
    intensity,
    energyLevel,
    trustLevel,
  };
}

// ------------------------------------------------------------------
// 3. Decide: Formulate Reasoning & Strategy
// ------------------------------------------------------------------
function decide(interpretation: ReturnType<typeof interpret>) {
  const { mood, intensity, energyLevel, trustLevel } = interpretation;
  
  let reasoning = "";
  let focus: BrainState["focus"] = "maintenance";

  // Strategy Selection Logic
  if (energyLevel === "high" && mood !== "happy") {
    reasoning = `High arousal detected (${mood}). System prioritizes de-escalation to reduce cognitive load.`;
    focus = "stabilization";
  } else if (energyLevel === "low") {
    reasoning = `Low energy state (${mood}). System suggests gentle support without demand.`;
    focus = "stabilization";
  } else if (mood === "happy") {
    reasoning = `Positive state. System encourages reflection to anchor this feeling.`;
    focus = "enhancement";
  } else {
    reasoning = `Stable neutral state. System stands by for user intent.`;
    focus = "maintenance";
  }

  return {
    ...interpretation,
    reasoning,
    focus,
  };
}

// ------------------------------------------------------------------
// 4. Learn: Extract Insight Markers (No Payload)
// ------------------------------------------------------------------
function learn(decision: ReturnType<typeof decide>): BrainState {
  // In this refactored loop, 'Learn' finalizes the state structure
  // ready for consumption by the BrainEngine or InsightTracker.
  
  return {
    interpretedEmotion: decision.mood,
    energyLevel: decision.energyLevel,
    trustLevel: decision.trustLevel,
    reasoning: decision.reasoning,
    focus: decision.focus,
  };
}

// ------------------------------------------------------------------
// Main Execution Pipeline
// ------------------------------------------------------------------
export function runThinkingLoop(input: BrainInput): BrainState {
  const observation = observe(input);
  const interpretation = interpret(observation);
  const decision = decide(interpretation);
  const result = learn(decision);

  return result;
}