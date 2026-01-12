// src/brain/RecommendationEngine.ts
/**
 * Small rule based recommend function that returns:
 * { themeSignal, suggestions }
 */

import { ThemeSignal } from "./BrainEngine";

export function recommend(estimation: { mood: string; level: number }): { themeSignal: ThemeSignal; suggestions?: string[] } {
  const { mood, level } = estimation;
  if (mood === "anxious" || mood === "tired") {
    return {
      themeSignal: {
        mood: "calm",
        background: "linear-gradient(180deg,#dff3ff,#bfe9ff)",
        text: "#07263a",
        accent: "#2b8cff",
        tone: "calm",
      },
      suggestions: ["Try box breathing", "Play calming music"],
    };
  }
  if (mood === "sad") {
    return {
      themeSignal: {
        mood: "soft",
        background: "linear-gradient(180deg,#fff1f3,#ffe6ea)",
        text: "#2a1f2e",
        accent: "#ff6b9a",
        tone: "calm",
      },
      suggestions: ["Write a short journal", "Listen to a soft playlist"],
    };
  }
  // default neutral
  return {
    themeSignal: {
      mood: "neutral",
      background: "linear-gradient(180deg,#f5f7fa,#eef3ff)",
      text: "#0f1724",
      accent: "#7f5af0",
      tone: "neutral",
    },
    suggestions: ["Open Dashboard"],
  };
}
