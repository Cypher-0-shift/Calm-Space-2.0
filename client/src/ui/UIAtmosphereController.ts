// client/src/ui/UIAtmosphereController.ts

import { BrainDecisionState } from "../brain/BrainDecisionState";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface UIAtmosphere {
  /** CSS background gradient string */
  backgroundGradient: string;
  /** Overall tonal quality of the UI surfaces */
  surfaceTone: "soft" | "balanced" | "bright";
  /** Animation speed and complexity cap */
  motionPreset: "still" | "gentle";
  /** White space distribution strategy */
  spacingScale: "loose" | "standard";
}

// Alias for cleaner function signature
type UIDecision = BrainDecisionState["uiDecision"];

// ------------------------------------------------------------------
// Constants: Environmental Definitions
// ------------------------------------------------------------------

const GRADIENTS = {
  calm: "linear-gradient(180deg, #F0F9FF 0%, #E0F2FE 100%)", // Cool, airy blues
  neutral: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)", // Stable, crisp slates
  uplifting: "linear-gradient(180deg, #FFF7ED 0%, #FFEDD5 100%)", // Warm, gentle ambers
};

// ------------------------------------------------------------------
// Pure Mapping Function
// ------------------------------------------------------------------

export function deriveUIAtmosphere(decision: UIDecision): UIAtmosphere {
  const { themeTone, animationIntensity, contentDensity } = decision;

  // 1. Map Theme Tone -> Background & Surface Tone
  // Logic: Calm = Soft, Uplifting = Bright, Neutral = Balanced
  let backgroundGradient = GRADIENTS.neutral;
  let surfaceTone: UIAtmosphere["surfaceTone"] = "balanced";

  switch (themeTone) {
    case "calm":
      backgroundGradient = GRADIENTS.calm;
      surfaceTone = "soft";
      break;
    case "uplifting":
      backgroundGradient = GRADIENTS.uplifting;
      surfaceTone = "bright";
      break;
    case "neutral":
    default:
      backgroundGradient = GRADIENTS.neutral;
      surfaceTone = "balanced";
      break;
  }

  // 2. Map Animation Intensity -> Motion Preset
  // Logic: Low intensity = Stillness, Medium = Gentle motion
  const motionPreset: UIAtmosphere["motionPreset"] =
    animationIntensity === "low" ? "still" : "gentle";

  // 3. Map Content Density -> Spacing Scale
  // Logic: Minimal density = Loose spacing (more breath), Normal = Standard
  const spacingScale: UIAtmosphere["spacingScale"] =
    contentDensity === "minimal" ? "loose" : "standard";

  return {
    backgroundGradient,
    surfaceTone,
    motionPreset,
    spacingScale,
  };
}