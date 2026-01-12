// src/brain/music/BrainMusicAnalyzer.ts

import { SpotifyBrainSnapshot } from "./SpotifyBrainSnapshot";

export class BrainMusicAnalyzer {
  static analyze(snapshot: SpotifyBrainSnapshot | null) {
    if (!snapshot || !snapshot.availability.connected) {
      return {
        influenceScore: 0,
        suggestedMood: null,
        intent: "none" as const,
        confidence: 0,
        reasoning: "Spotify not connected",
      };
    }

    const { dominantEnergy, instrumentalBias, recentBehavior } =
      snapshot.listeningProfile
        ? snapshot
        : snapshot;

    // Calm regulators
    if (
      snapshot.listeningProfile.dominantEnergy < 0.4 &&
      snapshot.listeningProfile.instrumentalBias > 0.6 &&
      snapshot.recentBehavior.skipRate < 0.3
    ) {
      return {
        influenceScore: 0.8,
        suggestedMood: "calm",
        intent: "recommend" as const,
        confidence: 0.9,
        reasoning: "Music used for emotional regulation",
      };
    }

    // Overstimulation
    if (
      snapshot.listeningProfile.dominantEnergy > 0.7 &&
      snapshot.recentBehavior.skipRate > 0.6
    ) {
      return {
        influenceScore: 0.6,
        suggestedMood: "grounding",
        intent: "avoid" as const,
        confidence: 0.7,
        reasoning: "High-energy skipping detected",
      };
    }

    return {
      influenceScore: 0.4,
      suggestedMood: null,
      intent: "recommend" as const,
      confidence: 0.5,
      reasoning: "Neutral music behavior",
    };
  }
}
