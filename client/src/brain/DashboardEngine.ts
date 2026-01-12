// src/brain/DashboardEngine.ts
// Dashboard intent mapper (NO UI, NO emotions, NO context logic)

import { BrainDecisionState } from "./BrainDecisionState.ts";

/* ============================
   TYPES
============================ */

export interface DashboardRecommendation {
  id: string;
  label: string;
  priority: number;
}

export interface DashboardState {
  calmLine: string | null;
  recommendations: DashboardRecommendation[];
  primaryFocus?: string;
}

/* ======================================================
   NEW: BRAIN-DRIVEN DASHBOARD (PHASE 2)
====================================================== */

/**
 * This is the NEW canonical dashboard mapper.
 * Dashboard must listen ONLY to BrainDecisionState.
 */
export function getDashboardStateFromBrain(
  brain: BrainDecisionState
): DashboardState {
  const recommendations: DashboardRecommendation[] = [];

  // --- Calm Line (top message) ---
  let calmLine: string | null = null;

  switch (brain.mode) {
    case "recover":
      calmLine = "Let’s slow things down. You’re safe here.";
      break;
    case "reflect":
      calmLine = "A good moment to sit with your thoughts.";
      break;
    case "focus":
      calmLine = "Let’s channel your attention gently.";
      break;
    case "energize":
      calmLine = "You’re full of energy today.";
      break;
    case "calm":
      calmLine = "Everything feels steady right now.";
      break;
    default:
      calmLine = null;
  }

  // --- Primary module (highest priority) ---
  recommendations.push({
    id: brain.dashboard.primaryModule,
    label: labelForModule(brain.dashboard.primaryModule),
    priority: 100,
  });

  // --- Secondary modules ---
  brain.dashboard.secondaryModules.forEach((mod, index) => {
    recommendations.push({
      id: mod,
      label: labelForModule(mod),
      priority: 50 - index * 5,
    });
  });

  return {
    calmLine,
    recommendations,
    primaryFocus: brain.dashboard.primaryModule,
  };
}

/* ======================================================
   OLD CONTEXT-BASED DASHBOARD (KEPT FOR SAFETY)
   ⚠️ This will be deprecated later
====================================================== */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDashboardState(context: any): DashboardState {
  // ⚠️ Legacy behavior retained
  return {
    calmLine: null,
    recommendations: [],
  };
}

/* ============================
   INTERNAL HELPERS
============================ */

function labelForModule(moduleId: string): string {
  switch (moduleId) {
    case "music":
      return "Listen to calming sounds";
    case "journal":
      return "Write your thoughts";
    case "chat":
      return "Talk it out";
    case "breathing":
      return "Breathe slowly";
    case "inspiration":
      return "Find inspiration";
    case "games":
      return "Light games to refresh";
    default:
      return "Explore";
  }
}
