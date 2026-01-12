// src/lib/suggestionEngine.ts
/**
 * Upgraded Suggestion Engine (Part C)
 *
 * - Adds categories: wellness, creative, productivity
 * - Produces micro-tasks (short actions) based on mood + intensity + time
 * - Accepts reinforcementSummary to bias suggestions (personalization)
 *
 * API:
 *   getSmartSuggestion(userName, mood, hour, reinforcementSummary?)
 *
 * reinforcementSummary shape:
 *   {
 *     suggestion_used: { <id>: count, ... },
 *     suggestion_ignored: { <id>: count, ... },
 *     category_preference: { wellness: n, creative: n, productivity: n }
 *   }
 *
 * The engine is pure (no Vault) and easy to test.
 */

export type AppTheme = {
  background: string;
  text: string;
  accent: string;
  // ...keep existing fields your UI expects
};

export type Suggestion = {
  greeting: string;
  subtitle: string;
  actionLabel: string;
  recommendedRoute: string;
  icon: string;
  theme: AppTheme;
  suggestions: { id: string; title: string; category: string; note?: string }[];
};

// small utility
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// micro-task templates per category
const MICRO_TASKS = {
  wellness: [
    { id: "w_01", title: "2-minute box breathing", note: "Slow breath cycle" },
    { id: "w_02", title: "Stretch for 2 minutes", note: "Neck & shoulders" },
    { id: "w_03", title: "Hydrate — drink a glass of water", note: "Quick reset" },
    { id: "w_04", title: "Walk to a window & breathe fresh air", note: "Grounding" },
  ],
  creative: [
    { id: "c_01", title: "Write one sentence about today", note: "Tiny journal" },
    { id: "c_02", title: "Draw a 30-second doodle", note: "No pressure" },
    { id: "c_03", title: "Take a quick photo of something you like", note: "Capture beauty" },
  ],
  productivity: [
    { id: "p_01", title: "Set a 10-min focus timer", note: "Small win" },
    { id: "p_02", title: "Clear 1 small task", note: "Inbox zero" },
    { id: "p_03", title: "Write 3 things you can do next", note: "Plan tiny steps" },
  ],
};

const DEFAULT_THEME: AppTheme = {
  background: "linear-gradient(180deg,#f5f7fa,#eef3ff)",
  text: "#0f1724",
  accent: "#7f5af0",
};

function pickByMood(mood: string | null, level = 5) {
  // Basic mapping for greeting and base categories
  const hour = new Date().getHours();
  let greeting = "Hello";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";
  else greeting = "Good evening";

  const moodLower = (mood || "").toLowerCase();

  // Map mood -> preferred category weights and base theme
  if (moodLower.includes("anx") || moodLower.includes("tired")) {
    return {
      greeting,
      subtitle: "A small calm moment can help.",
      primaryCategory: "wellness",
      theme: {
        background: "linear-gradient(180deg,#dff3ff,#bfe9ff)",
        text: "#07263a",
        accent: "#2b8cff",
      } as AppTheme,
    };
  }
  if (moodLower.includes("sad")) {
    return {
      greeting,
      subtitle: "Little kindness for yourself.",
      primaryCategory: "creative",
      theme: {
        background: "linear-gradient(180deg,#fff1f3,#ffe6ea)",
        text: "#2a1f2e",
        accent: "#ff6b9a",
      } as AppTheme,
    };
  }
  if (moodLower.includes("happy") || moodLower.includes("good")) {
    return {
      greeting,
      subtitle: "Nice — keep that momentum.",
      primaryCategory: "productivity",
      theme: {
        background: "linear-gradient(180deg,#fffbe6,#fff1c6)",
        text: "#2b2b1f",
        accent: "#f59e0b",
      } as AppTheme,
    };
  }

  // neutral
  return {
    greeting,
    subtitle: "How are you feeling today?",
    primaryCategory: "wellness",
    theme: DEFAULT_THEME,
  };
}

/**
 * Compute personalization bias from reinforcementSummary.
 * - reward suggestions used (boost)
 * - penalize suggestions ignored (decrease)
 * - prefer categories user engages with
 */
function computeBias(reinforcementSummary: any | undefined) {
  const bias = {
    suggestionBoost: new Map<string, number>(),
    categoryBoost: { wellness: 0, creative: 0, productivity: 0 },
  };

  if (!reinforcementSummary) return bias;

  const used = reinforcementSummary.suggestion_used || {};
  const ignored = reinforcementSummary.suggestion_ignored || {};
  const catPref = reinforcementSummary.category_preference || {};

  // suggestion boost = used_count - ignored_count (clamped)
  Object.keys(used).forEach((id) => {
    bias.suggestionBoost.set(
      id,
      clamp((used[id] || 0) - (ignored[id] || 0), -5, 10)
    );
  });
  // category boost = normalized counts
  const totalCat =
    (catPref.wellness || 0) + (catPref.creative || 0) + (catPref.productivity || 0) || 1;

  bias.categoryBoost.wellness = (catPref.wellness || 0) / totalCat;
  bias.categoryBoost.creative = (catPref.creative || 0) / totalCat;
  bias.categoryBoost.productivity = (catPref.productivity || 0) / totalCat;

  return bias;
}

/**
 * Build final suggestions array: pick micro-tasks from main and other categories,
 * score them with mood-intensity and reinforcement bias.
 */
function buildSuggestions(
  primaryCategory: keyof typeof MICRO_TASKS,
  reinforcementSummary: any | undefined,
  intensity = 5,
  max = 3
) {
  const bias = computeBias(reinforcementSummary);

  // gather candidates from primary + one other category (rotate)
  const allCats: (keyof typeof MICRO_TASKS)[] = ["wellness", "creative", "productivity"];
  const primaryIndex = allCats.indexOf(primaryCategory);
  const secondary = allCats[(primaryIndex + 1) % allCats.length];
  const candidates = [
    ...MICRO_TASKS[primaryCategory],
    ...MICRO_TASKS[secondary],
    ...MICRO_TASKS[allCats[(primaryIndex + 2) % allCats.length]],
  ];

  // score candidates
  const scored = candidates.map((c) => {
    // base score from category preference
    const catScore = bias.categoryBoost[primaryCategory] || 0.33;
    const suggestionBoost = bias.suggestionBoost.get(c.id) || 0;
    // intensity increases wellness tasks priority when anxious/tired
    const intensityFactor =
      primaryCategory === "wellness" ? clamp(0.5 + intensity / 10, 0.5, 2) : 1.0;

    const score = 1.0 * catScore * intensityFactor + suggestionBoost * 0.15;
    return { c, score };
  });

  // pick top N unique by id
  scored.sort((a, b) => b.score - a.score);

  const selected = scored.slice(0, max).map((s) => ({
    id: s.c.id,
    title: s.c.title,
    category:
      MICRO_TASKS.wellness.includes(s.c) ? "wellness" : MICRO_TASKS.creative.includes(s.c) ? "creative" : "productivity",
    note: s.c.note,
  }));

  return selected;
}

/**
 * Public API: getSmartSuggestion
 * - userName: string
 * - mood: string | null
 * - hour: number
 * - reinforcementSummary?: object (optional personalization)
 * - intensity?: number (1-10) optional
 */
export function getSmartSuggestion(
  userName: string,
  mood: string | null,
  hour: number,
  reinforcementSummary?: any,
  intensity: number = 5
): Suggestion {
  const moodPick = pickByMood(mood, intensity);
  const primaryCategory = moodPick.primaryCategory as keyof typeof MICRO_TASKS;

  // build personalized micro tasks
  const micro = buildSuggestions(primaryCategory, reinforcementSummary, intensity, 3);

  const greeting = `${moodPick.greeting}, ${userName}`;
  const subtitle = moodPick.subtitle;
  const theme = (moodPick.theme || DEFAULT_THEME) as AppTheme;

  // construct action label and recommended route heuristically
  const actionLabel =
    micro.length > 0 ? `Try: ${micro[0].title}` : "Open Dashboard";

  const recommendedRoute = micro.length > 0 ? "/inspiration" : "/home";
  const icon = primaryCategory === "wellness" ? "🌿" : primaryCategory === "creative" ? "✍️" : "⚡️";

  return {
    greeting,
    subtitle,
    actionLabel,
    recommendedRoute,
    icon,
    theme,
    suggestions: micro,
  };
}
