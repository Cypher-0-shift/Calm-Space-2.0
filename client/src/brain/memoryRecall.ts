import { MemoryInsight } from "@/vault/memoryStore";

/**
 * Selects 1–2 relevant memories for the current emotion.
 * Keeps it subtle and human.
 */
export function selectRelevantMemories(
  memories: MemoryInsight[],
  currentEmotion: string
): MemoryInsight[] {
  if (!memories || memories.length === 0) return [];

  // Prioritize strong memories
  const strong = memories
    .filter(m => m.weight >= 0.6)
    .sort((a, b) => b.weight - a.weight);

  // Emotion-related memories first
  const emotionalMatches = strong.filter(m =>
    m.content.toLowerCase().includes(currentEmotion)
  );

  // Pick max 2 memories
  const selected =
    emotionalMatches.length > 0
      ? emotionalMatches.slice(0, 2)
      : strong.slice(0, 1);

  return selected;
}
