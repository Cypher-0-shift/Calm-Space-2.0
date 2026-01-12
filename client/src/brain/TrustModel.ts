// src/brain/TrustModel.ts

export interface TrustState {
  level: number;          // 0 → 1
  lastInteraction: number;
  interactions: number;
}

export class TrustModel {
  private state: TrustState = {
    level: 0.15, // starts cautious
    lastInteraction: Date.now(),
    interactions: 0,
  };

  /**
   * Update trust based on interaction
   */
  updateTrust(params: {
    emotion?: string;
    intensity?: number;
    disclosed?: boolean;
  }) {
    const now = Date.now();
    const minutesPassed =
      (now - this.state.lastInteraction) / (1000 * 60);

    let delta = 0;

    // Regular interaction builds slow trust
    delta += 0.01;

    // Emotional vulnerability builds more trust
    if (params.disclosed) {
      delta += 0.04;
    }

    // Strong vulnerable emotions deepen bond
    if (
      ["sad", "anxious", "stressed"].includes(params.emotion || "") &&
      (params.intensity ?? 0) > 5
    ) {
      delta += 0.03;
    }

    // Long absence cools trust
    if (minutesPassed > 60) {
      const daysAway = minutesPassed / 1440;
      delta -= Math.min(0.1, daysAway * 0.03);
    }

    this.state.level = Math.min(
      1,
      Math.max(0, this.state.level + delta)
    );

    this.state.lastInteraction = now;
    this.state.interactions += 1;

    return this.state;
  }

  /**
   * 🔐 Restore trust state after reload
   */
  hydrate(state: Partial<TrustState>) {
    if (!state) return;

    const now = Date.now();
    const last = state.lastInteraction ?? now;
    const minutesPassed = (now - last) / (1000 * 60);

    let level =
      typeof state.level === "number"
        ? Math.min(1, Math.max(0, state.level))
        : 0.15;

    // 🧊 Passive decay if user was gone for days
    if (minutesPassed > 1440) {
      const daysAway = minutesPassed / 1440;
      level *= Math.max(0.7, 1 - daysAway * 0.05);
    }

    this.state = {
      level,
      lastInteraction: last,
      interactions: state.interactions ?? 0,
    };
  }

  /**
   * 📤 Export trust for persistence
   */
  exportState(): TrustState {
    return { ...this.state };
  }

  /**
   * Get trust level (0–1)
   */
  getTrustLevel(): number {
    return this.state.level;
  }

  /**
   * Get formatted trust stage for prompting
   */
  getTrustStage(): "stranger" | "acquaintance" | "friend" | "confidant" {
    if (this.state.level < 0.2) return "stranger";
    if (this.state.level < 0.5) return "acquaintance";
    if (this.state.level < 0.8) return "friend";
    return "confidant";
  }
}

// ✅ Singleton instance (used everywhere)
export const trustModel = new TrustModel();
