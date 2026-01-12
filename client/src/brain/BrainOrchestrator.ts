// src/brain/BrainOrchestrator.ts
// Central decision coordinator for Calm Space

import { getUserContext } from "./ContextAssembler";
import { getDashboardState as deriveDashboardState } from "./DashboardEngine";
import { BrainDecisionState } from "./BrainDecisionState.ts";
import { BrainMusicAnalyzer } from "./music/BrainMusicAnalyzer";
import type { SpotifyBrainSnapshot } from "./music/SpotifyBrainSnapshot";

/* ============================
   BRAIN ORCHESTRATOR
============================ */

/**
 * Temporary placeholder for Phase 3 integration.
 * Currently returns null to simulate "Spotify not connected".
 */
function getSpotifySnapshot(): SpotifyBrainSnapshot | null {
  return null;
}

export const BrainOrchestrator = {
  /**
   * 🧠 MASTER BRAIN CYCLE
   * This is the SINGLE authoritative decision output
   */
  runBrainCycle(): BrainDecisionState {
    const context = getUserContext();
    const { emotion } = context;

    /* ============================
       DERIVED CORE STATE
    ============================ */

    const derivedIntensity: BrainDecisionState["intensity"] =
      emotion.intensity > 0.7
        ? "high"
        : emotion.intensity > 0.4
        ? "medium"
        : "low";

    let derivedMode: BrainDecisionState["mode"] = "explore";

    if (emotion.isOverwhelmed || emotion.intensity > 0.75) {
      derivedMode = "recover";
    } else if (emotion.isLowEnergy) {
      derivedMode = "calm";
    } else if (emotion.isReflective) {
      derivedMode = "reflect";
    } else if (emotion.isFocused) {
      derivedMode = "focus";
    } else if (emotion.isHighEnergy) {
      derivedMode = "energize";
    }

    /* ============================
       SAFETY CONSTRAINTS
    ============================ */

    const avoidOverstimulation =
      derivedMode === "recover" || derivedIntensity === "high";

    const avoidCognitiveLoad =
      derivedMode === "recover" || derivedMode === "calm";

    /* ============================
       UI INTENT
    ============================ */

    const uiDensity =
      avoidCognitiveLoad
        ? "minimal"
        : derivedMode === "focus" || derivedMode === "reflect"
        ? "focused"
        : "expansive";

    const uiMotion =
      avoidOverstimulation ? "slow" : "normal";

    const uiThemeTone =
      derivedMode === "recover" || derivedMode === "reflect"
        ? "dark"
        : derivedMode === "calm"
        ? "soft"
        : "neutral";

    /* ============================
       DASHBOARD INTENT
    ============================ */

    const dashboardPrimary =
      derivedMode === "recover"
        ? "breathing"
        : derivedMode === "reflect"
        ? "journal"
        : derivedMode === "focus"
        ? "music"
        : derivedMode === "energize"
        ? "games"
        : "inspiration";

    const dashboardSecondary =
      derivedMode === "recover"
        ? ["music"]
        : derivedMode === "reflect"
        ? ["chat", "music"]
        : derivedMode === "focus"
        ? ["journal"]
        : ["journal", "music"];


    /* ============================
       MUSIC INTENT (INTEGRATED)
    ============================ */

    const spotifySnapshot = getSpotifySnapshot();
    const musicAnalysis = BrainMusicAnalyzer.analyze(spotifySnapshot);

    /* ============================
       AI INTENT
    ============================ */

    const aiTone =
      derivedMode === "recover"
        ? "supportive"
        : derivedMode === "focus"
        ? "coach"
        : "neutral";

    const aiVerbosity =
      derivedMode === "recover"
        ? "short"
        : derivedMode === "reflect"
        ? "deep"
        : "medium";

    /* ============================
       FINAL BRAIN DECISION
    ============================ */

    const decision: BrainDecisionState = {
      mode: derivedMode,
      intensity: derivedIntensity,

      ui: {
        density: uiDensity,
        motion: uiMotion,
        themeTone: uiThemeTone,
      },

      dashboard: {
        primaryModule: dashboardPrimary,
        secondaryModules: dashboardSecondary,
      },

      music: {
        intent: musicAnalysis.intent,
        mood: musicAnalysis.suggestedMood,
        source: spotifySnapshot ? "spotify" : "none",
        confidence: musicAnalysis.confidence,
      },

      ai: {
        tone: aiTone,
        verbosity: aiVerbosity,
      },

      constraints: {
        avoidOverstimulation,
        avoidCognitiveLoad,
      },

      reasoning: [
        `Mode=${derivedMode}, intensity=${derivedIntensity}, emotion=${emotion.label}`,
        musicAnalysis.reasoning
      ].filter(Boolean).join(" | "),
    };

    return decision;
  },

  /* ============================
     COMPATIBILITY HELPERS
     (Phase-2 will remove these)
  ============================ */

  getDashboardState() {
    const context = getUserContext();
    return deriveDashboardState(context);
  },

  getChatBehavior() {
    const brain = this.runBrainCycle();

    return {
      tone:
        brain.ai.tone === "supportive"
          ? "calm"
          : brain.ai.tone === "coach"
          ? "warm"
          : "neutral",

      verbosity:
        brain.ai.verbosity === "short"
          ? "low"
          : brain.ai.verbosity === "deep"
          ? "high"
          : "medium",

      allowQuestions: brain.mode !== "recover",
      injectGrounding: brain.mode === "recover",
    };
  },

  notifyAction(actionId: string, payload?: unknown) {
    console.log("[Brain] Action received:", actionId, payload);
  },
};