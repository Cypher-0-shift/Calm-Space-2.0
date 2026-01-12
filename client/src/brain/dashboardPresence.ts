export function getCalmLine(
  mood: string | null
): string {
  const neutral = [
    "It’s okay to just be here.",
    "You don’t need to rush anything.",
    "Take a moment. This space is yours.",
  ];

  const anxious = [
    "Nothing needs to be solved right now.",
    "You’re safe to slow down here.",
  ];

  const sad = [
    "You don’t have to explain how you feel.",
    "It’s okay to sit with this quietly.",
  ];

  const pool =
    mood === "anxious"
      ? anxious
      : mood === "sad"
      ? sad
      : neutral;

  return pool[Math.floor(Math.random() * pool.length)];
}
