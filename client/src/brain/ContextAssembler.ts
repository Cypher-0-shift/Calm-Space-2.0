// src/brain/ContextAssembler.ts
// Collects factual user context (NO decisions)

import { emotionModel } from "./EmotionModel";
import { trustModel } from "./TrustModel";
import { detectGrowth } from "./growthTracker";

export interface UserContext {
  emotion: {
    mood: string;
    intensity: number;
  };
  trustStage: "stranger" | "acquaintance" | "friend" | "confidant";
  timeContext: {
    hour: number;
    period: "morning" | "afternoon" | "evening" | "night";
  };
  growth: {
    improved: boolean;
    message?: string;
  };
}

function getTimeContext() {
  const hour = new Date().getHours();
  let period: UserContext["timeContext"]["period"] = "morning";

  if (hour >= 12 && hour < 17) period = "afternoon";
  else if (hour >= 17 && hour < 21) period = "evening";
  else if (hour >= 21 || hour < 5) period = "night";

  return { hour, period };
}

export function getUserContext(): UserContext {
  const current = emotionModel.getCurrentState();

  // Normalize emotion
  const mood = current?.mood ?? "neutral";
  const intensity = current?.intensity ?? 0;

  // Growth signal (safe, non-blocking)
  const growth = detectGrowth(
    null, // past emotion intentionally ignored for now
    mood as any,
    null,
    Math.round(intensity * 10)
  );

  return {
    emotion: { mood, intensity },
    trustStage: trustModel.getTrustStage(), // ✅ FIXED
    timeContext: getTimeContext(),
    growth,
  };
}
