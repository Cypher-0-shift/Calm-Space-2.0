// client/src/brain/BrainDecisionState.ts

import { EmotionLabel } from "./EmotionModel";

export interface BrainDecisionState {
  emotionalSnapshot: {
    interpretedEmotion: EmotionLabel;
    energyLevel: "low" | "medium" | "high";
    trustLevel: "low" | "medium" | "high";
  };

  uiDecision: {
    themeTone: "calm" | "neutral" | "uplifting";
    animationIntensity: "low" | "medium";
    contentDensity: "minimal" | "normal";
  };

  dashboardDecision: {
    reflectionText: string;
    primaryAction: "music" | "journal" | "chat" | "grounding" | "none";
    allowSecondaryActions: boolean;
  };

  recommendationDecision: {
    type: "music" | "journal" | "chat" | "grounding" | "none";
    reason: string;
  };

  meta: {
    lastUpdated: number; // ISO Timestamp or Unix Epoch
    confidenceLevel: "low" | "medium" | "high";
  };
}