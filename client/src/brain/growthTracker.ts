// growthTracker.ts

import { EmotionLabel } from "./EmotionModel";

interface GrowthSignal {
  improved: boolean;
  message?: string;
}

export function detectGrowth(
  pastEmotion: EmotionLabel | null,
  currentEmotion: EmotionLabel,
  pastIntensity: number | null,
  currentIntensity: number
): GrowthSignal {
  if (!pastEmotion || pastIntensity === null) {
    return { improved: false };
  }

  // Same emotion but calmer
  if (
    pastEmotion === currentEmotion &&
    currentIntensity < pastIntensity - 2
  ) {
    return {
      improved: true,
      message: "You're handling this more calmly than before.",
    };
  }

  // Emotion shifted to a healthier state
  const positiveShift =
    ["anxious", "stressed", "angry"].includes(pastEmotion) &&
    ["neutral", "happy"].includes(currentEmotion);

  if (positiveShift) {
    return {
      improved: true,
      message:
        "Earlier this felt much heavier. It seems a bit lighter now.",
    };
  }

  return { improved: false };
}
