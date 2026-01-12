// src/brain/music/SpotifyBrainSnapshot.ts

export interface SpotifyBrainSnapshot {
  availability: {
    connected: boolean;
    premium: boolean;
    lastSyncAt: number | null;
  };

  listeningProfile: {
    preferredGenres: string[];
    dominantEnergy: number;      // 0 (calm) → 1 (intense)
    dominantValence: number;     // 0 (sad) → 1 (happy)
    instrumentalBias: number;    // 0 (vocals) → 1 (instrumental)
  };

  temporalPatterns: {
    nightListening: boolean;
    focusHours: number[];
    lateNightCalmUser: boolean;
  };

  recentBehavior: {
    averageTempo: number;
    repeatAffinity: number;
    skipRate: number;
  };

  inferredState: {
    regulationStyle: "music-calm" | "music-focus" | "music-escape" | "unknown";
    emotionalReliance: number;
  };
}
