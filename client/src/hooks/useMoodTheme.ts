import { useEffect } from "react";
import { emotionModel } from "@/brain/EmotionModel";

export function useMoodTheme() {
  useEffect(() => {
    const state = emotionModel.getCurrentState();
    if (!state) return;

    document.documentElement.setAttribute(
      "data-mood",
      state.mood
    );
  }, []);
}
