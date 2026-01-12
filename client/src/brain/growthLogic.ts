// src/brain/growthLogic.ts
// Adapter layer for growth detection
// Keeps existing growthTracker untouched

import { detectGrowth as detectGrowthInternal } from "./growthTracker";
import type { EmotionalState } from "./EmotionModel";

export function detectGrowth(
  previous: EmotionalState | null,
  current: EmotionalState | null
): { improved: boolean; message?: string } {
  if (!previous || !current) {
    return { improved: false };
  }

  return detectGrowthInternal(
    previous.mood,
    current.mood,
    previous.intensity * 10,
    current.intensity * 10
  );
}
