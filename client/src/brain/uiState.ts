// src/brain/uiState.ts

export type UITone = "calm" | "warm" | "neutral";

export interface UIState {
  tone: UITone;

  theme: {
    background: "soft-dark" | "light" | "dim";
    blur: "low" | "medium" | "high";
  };

  motion: {
    speed: "very-slow" | "slow" | "normal";
  };

  layout: {
    density: "airy" | "normal";
  };

  visibility: {
    showChat: boolean;
    showPanic: boolean;
    showGames: boolean;
  };

  suggestions: {
    id: string;
    label: string;
    priority: number;
  }[];
}
