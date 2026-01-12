// src/brain/EmotionModel.ts

export type EmotionLabel =
  | "anxious"
  | "sad"
  | "stressed"
  | "angry"
  | "confused"
  | "happy"
  | "neutral";

export interface EmotionalState {
  mood: EmotionLabel;
  intensity: number; // 0 → 1
  lastUpdated: number;
}

/**
 * Emotional inertia values
 * Higher = harder to change
 */
const EMOTION_INERTIA: Record<EmotionLabel, number> = {
  anxious: 0.75,
  sad: 0.65,
  stressed: 0.6,
  angry: 0.7,
  confused: 0.55,
  neutral: 0.4,
  happy: 0.3,
};

class EmotionModel {
  private state: EmotionalState | null = null;

  // how fast emotion fades (per minute)
  private DECAY_RATE = 0.03;

  // how strongly new emotion affects old
  private BLEND_WEIGHT = 0.35;

  /**
   * 🔄 Restore emotional baseline after reload
   * ✅ Preserves emotional timeline
   */
  hydrate(state: EmotionalState) {
    if (!state || !state.mood) return;

    const now = Date.now();
    const minutesPassed =
      (now - state.lastUpdated) / (1000 * 60);

    const decayedIntensity = Math.max(
      0,
      state.intensity - minutesPassed * this.DECAY_RATE
    );

    // Emotion fully cooled → reset safely
    if (decayedIntensity < 0.15) {
      this.state = {
        mood: "neutral",
        intensity: 0,
        lastUpdated: now,
      };
      return;
    }

    this.state = {
      mood: state.mood,
      intensity: Number(decayedIntensity.toFixed(2)),
      lastUpdated: state.lastUpdated, // ⚠️ do NOT overwrite timeline
    };
  }

  /**
   * 📤 Export current state for persistence
   */
  exportState(): EmotionalState | null {
    if (!this.state) return null;
    return { ...this.state };
  }

  /**
   * 🔁 Update emotional state using new detected emotion
   * detectedIntensity expected in range 0–10
   */
  update(
    detectedMood: EmotionLabel,
    detectedIntensity: number
  ): EmotionalState {
    const now = Date.now();

    const intensity = Math.min(
      1,
      Math.max(0, detectedIntensity / 10)
    );

    // First emotion ever
    if (!this.state) {
      this.state = {
        mood: detectedMood,
        intensity,
        lastUpdated: now,
      };
      return this.state;
    }

    // ⏳ Apply decay
    const minutesPassed =
      (now - this.state.lastUpdated) / (1000 * 60);

    const decayedIntensity = Math.max(
      0,
      this.state.intensity - minutesPassed * this.DECAY_RATE
    );

    const currentMood = this.state.mood;
    const inertia = EMOTION_INERTIA[currentMood] ?? 0.5;

    let finalMood = currentMood;
    let finalIntensity = decayedIntensity;

    if (detectedMood === currentMood) {
      // Reinforce same emotion
      finalIntensity = Math.min(
        1,
        decayedIntensity + intensity * this.BLEND_WEIGHT
      );
    } else {
      // Competing emotion with inertia
      const blendedIncoming =
        intensity * (1 - inertia) +
        decayedIntensity * inertia;

      if (blendedIncoming > decayedIntensity) {
        finalMood = detectedMood;
        finalIntensity = blendedIncoming;
      } else {
        finalIntensity = decayedIntensity * 0.95;
      }
    }

    this.state = {
      mood: finalMood,
      intensity: Number(finalIntensity.toFixed(2)),
      lastUpdated: now,
    };

    return this.state;
  }

  /**
   * 📊 Get emotional baseline without mutating state
   */
  getCurrentState(): EmotionalState | null {
    if (!this.state) return null;

    const now = Date.now();
    const minutesPassed =
      (now - this.state.lastUpdated) / (1000 * 60);

    const decayedIntensity = Math.max(
      0,
      this.state.intensity - minutesPassed * this.DECAY_RATE
    );

    if (decayedIntensity < 0.15) {
      return {
        mood: "neutral",
        intensity: 0,
        lastUpdated: now,
      };
    }

    return {
      mood: this.state.mood,
      intensity: Number(decayedIntensity.toFixed(2)),
      lastUpdated: this.state.lastUpdated,
    };
  }

  /**
   * 🧠 Helper: Is there an active lingering emotion?
   */
  hasActiveEmotion(): boolean {
    return !!this.state && this.state.intensity > 0.15;
  }
}

export const emotionModel = new EmotionModel();

/**
 * 🔍 Lightweight mood estimation helper
 * Used by BrainEngine only (non-mutating)
 */
export function estimateMood(text: string): {
  mood: EmotionLabel;
  intensity: number;
} {
  const lower = text.toLowerCase();

  if (
    lower.includes("panic") ||
    lower.includes("anxious") ||
    lower.includes("anxiety")
  ) {
    return { mood: "anxious", intensity: 8 };
  }

  if (lower.includes("stress") || lower.includes("overwhelmed")) {
    return { mood: "stressed", intensity: 7 };
  }

  if (lower.includes("sad") || lower.includes("down")) {
    return { mood: "sad", intensity: 6 };
  }

  if (lower.includes("angry") || lower.includes("mad")) {
    return { mood: "angry", intensity: 6 };
  }

  if (lower.includes("happy") || lower.includes("good")) {
    return { mood: "happy", intensity: 5 };
  }

  return { mood: "neutral", intensity: 2 };
}
