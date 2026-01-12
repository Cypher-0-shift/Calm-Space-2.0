/**
 * BrainEngine v1.6
 * ---------------------------------------------
 * - Handles mood + behavioral events
 * - Emits theme signals
 * - Tracks insights
 * - Stores reinforcement signals
 * - Loads reinforcement memory automatically
 * - ✅ Emotional Continuity via EmotionModel
 */

import { saveMood } from "@/vault/moodStore";
import { estimateMood } from "./EmotionModel";
import { InsightTracker } from "./InsightTracker";
import { recommend } from "./RecommendationEngine";
import { saveBrainSignal } from "@/vault/brainStore";
import { emotionModel } from "./EmotionModel";

export type ThemeSignal = {
  mode?: "light" | "dark";
  background?: string;
  text?: string;
  accent?: string;
  mood?: string;
  tone?: "calm" | "neutral" | "uplift";
};

export type EventPayload =
  | { type: "explicit_mood"; mood: string; intensity?: number }
  | { type: "page_open"; page: string; ts?: number }
  | { type: "panic_used"; exerciseId?: string; ts?: number }
  | { type: "journal_written"; emotionalScore?: number; ts?: number };

class BrainEngine {
  private themeListeners: ((s: ThemeSignal) => void)[] = [];
  private insightTracker = new InsightTracker();

  // Reinforcement memory
  private reinforcementHistory: any[] = [];

  // 🔥 Emotional baseline (continuity)
  private currentMood: string = "neutral";
  private moodIntensity: number = 0.3;

  registerThemeListener(fn: (s: ThemeSignal) => void) {
    this.themeListeners.push(fn);
  }

  private emitTheme(signal: ThemeSignal) {
    this.themeListeners.forEach((fn) => {
      try {
        fn(signal);
      } catch (err) {
        console.error("BrainEngine theme listener error:", err);
      }
    });
  }

  /**
   * Main event processor
   */
  async handleEvent(evt: EventPayload) {
    // ---------------------------------------------
    // 1️⃣ Explicit mood update → Emotional Continuity
    // ---------------------------------------------
    if (evt.type === "explicit_mood") {
      const updatedState = emotionModel.update(
        evt.mood as any,
        evt.intensity ?? 0.6
      );

      this.currentMood = updatedState.mood;
      this.moodIntensity = updatedState.intensity;

      // Persist mood
      await saveMood({
        mood: updatedState.mood,
        intensity: Math.round(updatedState.intensity * 10),
        timestamp: new Date().toISOString(),
      });
    }

    // ---------------------------------------------
    // 2️⃣ Estimate mood using system logic
    // ---------------------------------------------
    const estimation = await estimateMood({
      ...evt,
      baselineMood: this.currentMood,
      baselineIntensity: this.moodIntensity,
    });

    // ---------------------------------------------
    // 3️⃣ Track insights
    // ---------------------------------------------
    this.insightTracker.record(evt, estimation);

    // ---------------------------------------------
    // 4️⃣ Generate recommendations
    // ---------------------------------------------
    const rec = recommend(estimation);

    // ---------------------------------------------
    // 5️⃣ Emit UI signals
    // ---------------------------------------------
    this.emitTheme({
      ...rec.themeSignal,
      mood: this.currentMood,
    });
  }

  /**
   * Reinforcement memory handler
   */
  async handleReinforcement(event: any) {
    await saveBrainSignal({
      type: event.type,
      payload: event.payload,
      timestamp: new Date().toISOString(),
    });

    // Micro emotional stabilization
    this.emitTheme({
      tone: "neutral",
    });
  }

  /**
   * Load reinforcement memory
   */
  loadSignals(signals: any[]) {
    this.reinforcementHistory = signals;
  }

  /**
   * Expose emotional baseline (optional use in UI / AI)
   */
  getEmotionalState() {
    return emotionModel.getCurrentState();
  }
}

export const brain = new BrainEngine();
