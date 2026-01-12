// src/brain/BrainAPI.ts

import { getUserContext } from "./ContextAssembler";
import type { UIState } from "./uiState";

export const BrainAPI = {
  getUIState(): UIState {
    const ctx = getUserContext();

    // ---- DECISION LOGIC v1 ----
    if (ctx.mood === "anxious" && ctx.intensity > 0.6) {
      return {
        tone: "calm",
        theme: {
          background: "soft-dark",
          blur: "high",
        },
        motion: {
          speed: "very-slow",
        },
        layout: {
          density: "airy",
        },
        visibility: {
          showChat: false,
          showPanic: true,
          showGames: false,
        },
        suggestions: [
          { id: "panic", label: "Take a slow breath", priority: 1 },
          { id: "music", label: "Sit with a calming sound", priority: 2 },
        ],
      };
    }

    // ---- DEFAULT / NEUTRAL ----
    return {
      tone: "warm",
      theme: {
        background: "light",
        blur: "medium",
      },
      motion: {
        speed: "normal",
      },
      layout: {
        density: "normal",
      },
      visibility: {
        showChat: true,
        showPanic: false,
        showGames: true,
      },
      suggestions: [
        { id: "chat", label: "Talk for a bit", priority: 1 },
        { id: "journal", label: "Write a few thoughts", priority: 2 },
      ],
    };
  },
};
