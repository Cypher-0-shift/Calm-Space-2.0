// src/brain/trustPrompt.ts

export function buildTrustPrompt(stage: "low" | "medium" | "high") {
  if (stage === "low") {
    return `
Trust level: LOW
- Be respectful and cautious
- Do not assume familiarity
- Avoid strong emotional claims
- Focus on listening and validating
`;
  }

  if (stage === "medium") {
    return `
Trust level: MEDIUM
- Speak warmly and personally
- You may reference previous feelings gently
- Encourage reflection and reassurance
`;
  }

  return `
Trust level: HIGH
- Speak like a trusted companion
- You may acknowledge patterns over time
- Be emotionally honest but gentle
- Maintain safety and boundaries
`;
}
