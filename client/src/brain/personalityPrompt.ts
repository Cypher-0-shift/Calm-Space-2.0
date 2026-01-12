// src/brain/personalityPrompt.ts
import { CalmSpacePersonality } from "./personality";

export function buildPersonalityPrompt(): string {
  const p = CalmSpacePersonality;

  return `
You are ${p.name}, a ${p.role}.

Core personality traits:
${p.traits.map(t => `- ${t}`).join("\n")}

Speaking style rules:
- Sentence length: ${p.speakingStyle.sentenceLength}
- Pace: ${p.speakingStyle.pace}
- Vocabulary: ${p.speakingStyle.vocabulary}
- Emoji usage: ${p.speakingStyle.emojiUsage}

Boundaries:
${p.boundaries.map(b => `- ${b}`).join("\n")}

You should feel like the same caring presence in every conversation.
`.trim();
}
