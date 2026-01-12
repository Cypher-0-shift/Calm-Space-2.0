// groundingRules.ts

export function needsGrounding(
  emotion: string,
  intensity: number
): boolean {
  if (intensity < 6) return false;

  return [
    "anxious",
    "stressed",
    "angry",
    "confused",
    "sad",
  ].includes(emotion);
}
