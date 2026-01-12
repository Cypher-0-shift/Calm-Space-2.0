// src/context/MoodContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// 🔐 Secure Vault
import { Vault } from "@/vault";

// 🎯 Suggestion Engine (Upgraded)
import {
  getSmartSuggestion,
  type Suggestion,
} from "@/lib/suggestionEngine";

// 🧠 CalmSpace Brain Engine
import { brain } from "@/brain/BrainEngine";

// 🧠 Reinforcement memory loader
import { getBrainSignals } from "@/vault/brainStore";

interface MoodContextType {
  currentMood: string | null;
  userName: string;

  theme: any;
  greeting: string;
  subtitle: string;
  actionLabel: string;
  recommendedRoute: string;
  icon: string;
  suggestions: any[];

  refreshMood: () => Promise<void>;
  logMood: (mood: string) => Promise<void>;

  isLoading: boolean;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Friend");
  const [isLoading, setIsLoading] = useState(true);

  const [suggestion, setSuggestion] = useState<Suggestion>(
    getSmartSuggestion("Friend", null, new Date().getHours())
  );

  /**
   * 🧠 Build reinforcement summary
   * Converts raw brain signals → counts → used by suggestion engine
   */
  const buildReinforcementSummary = (signals: any[] | undefined) => {
    if (!signals || signals.length === 0) return undefined;

    const summary: any = {
      suggestion_used: {},
      suggestion_ignored: {},
      category_preference: { wellness: 0, creative: 0, productivity: 0 },
    };

    for (const s of signals) {
      const type = s.type;

      if (type === "suggestion_used") {
        const id = s.payload?.suggestionId;
        const cat = s.payload?.category;

        if (id) summary.suggestion_used[id] = (summary.suggestion_used[id] || 0) + 1;
        if (cat) summary.category_preference[cat] = (summary.category_preference[cat] || 0) + 1;
      }

      if (type === "suggestion_ignored") {
        const id = s.payload?.suggestionId;
        if (id) summary.suggestion_ignored[id] = (summary.suggestion_ignored[id] || 0) + 1;
      }
    }

    return summary;
  };

  /**
   * MAIN CONTEXT INITIALIZER
   */
  const loadContext = useCallback(async () => {
    try {
      // A. Load encrypted profile
      const profile = await Vault.getProfile();
      const name = profile?.name || "Friend";
      setUserName(name);

      // B. Load encrypted mood history
      const history = await Vault.getMoodHistory();
      const lastMoodEntry = history[0];
      const lastMood = lastMoodEntry ? lastMoodEntry.mood : null;
      setCurrentMood(lastMood);

      // C. Load reinforcement memory
      const signals = await getBrainSignals();
      brain.loadSignals(signals);

      const reinforcementSummary = buildReinforcementSummary(signals);

      // D. Boot Brain Engine
      if (lastMood) {
        await brain.handleEvent({ type: "explicit_mood", mood: lastMood });
      }

      // E. Suggestion Engine (personalized)
      const hour = new Date().getHours();
      const newSuggestion = getSmartSuggestion(
        name,
        lastMood,
        hour,
        reinforcementSummary
      );

      setSuggestion(newSuggestion);
    } catch (error) {
      console.error("❌ [MoodContext] loadContext failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * LOG MOOD SECURELY + RECALCULATE
   */
  const logMood = async (mood: string) => {
    try {
      // Send to Brain Engine
      await brain.handleEvent({ type: "explicit_mood", mood });

      // Save encrypted mood
      await Vault.saveMood({
        mood,
        intensity: 5,
        timestamp: new Date().toISOString(),
      });

      setCurrentMood(mood);

      // Reload reinforcement memory
      const latestSignals = await getBrainSignals();
      const reinforcementSummary = buildReinforcementSummary(latestSignals);

      // Apply new suggestion with personalization
      const hour = new Date().getHours();
      const newSuggestion = getSmartSuggestion(
        userName,
        mood,
        hour,
        reinforcementSummary
      );

      setSuggestion(newSuggestion);
    } catch (error) {
      console.error("❌ [MoodContext] logMood failed:", error);
    }
  };

  // 📌 On App Start
  useEffect(() => {
    loadContext();
  }, [loadContext]);

  /**
   * ⏱ SMART TIME-OF-DAY RECALIBRATION (Part B)
   */
  useEffect(() => {
    let lastHour = new Date().getHours();

    const timer = setInterval(async () => {
      const currentHour = new Date().getHours();

      if (currentHour !== lastHour) {
        lastHour = currentHour;

        // Reload reinforcement summary
        const signals = await getBrainSignals();
        const reinforcementSummary = buildReinforcementSummary(signals);

        setSuggestion(
          getSmartSuggestion(userName, currentMood, currentHour, reinforcementSummary)
        );

        if (currentMood) {
          brain.handleEvent({ type: "explicit_mood", mood: currentMood });
        }
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [userName, currentMood]);

  /**
   * 🔄 Recalibrate when app returns to focus (Part B)
   */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadContext();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [loadContext]);

  /**
   * 🧠 Apply BrainEngine theme signals → UI theme
   */
  useEffect(() => {
    brain.registerThemeListener((signal) => {
      setSuggestion((prev) => ({
        ...prev,
        theme: { ...prev.theme, ...signal },
      }));
    });
  }, []);

  return (
    <MoodContext.Provider
      value={{
        currentMood,
        userName,

        theme: suggestion.theme,
        greeting: suggestion.greeting,
        subtitle: suggestion.subtitle,
        actionLabel: suggestion.actionLabel,
        recommendedRoute: suggestion.recommendedRoute,
        icon: suggestion.icon,
        suggestions: suggestion.suggestions,

        refreshMood: loadContext,
        logMood,

        isLoading,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error("useMood must be used inside MoodProvider");
  }
  return context;
};
