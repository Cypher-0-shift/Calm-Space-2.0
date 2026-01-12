// app/api/sentiment/route.ts
// Lightweight emotion classifier using Ollama

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Missing text for emotion analysis" },
        { status: 400 }
      );
    }

    // Short, efficient prompt for sentiment detection
    const prompt = `
Classify the user's emotional state from this message:

"${text}"

Return ONLY a JSON object:
{
  "emotion": "...",
  "confidence": 0-1
}
    `;

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral", // fast model
        prompt,
        stream: false,
      }),
    });

    const json = await res.json();
    const raw = json.response.trim();

    // try to parse JSON safely
    const parsed = JSON.parse(raw);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("❌ Sentiment Error:", err);
    return NextResponse.json(
      {
        emotion: "unknown",
        confidence: 0,
        error: err.toString(),
      },
      { status: 200 }
    );
  }
}
