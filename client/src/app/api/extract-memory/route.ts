// app/api/extract-memory/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const prompt = `
From the following message, extract a long-term memory insight about the user.
Return JSON only. Focus on emotional patterns, preferences, or triggers.

Message: "${text}"

Return ONLY one JSON object:
{
  "type": "preference"|"trigger"|"pattern"|"mood_insight",
  "content": "short, meaningful sentence",
  "weight": 0.0–1.0
}
`;

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "mistral", prompt, stream: false }),
    });

    const data = await res.json();
    const raw = data.response.trim();
    const insight = JSON.parse(raw);

    return NextResponse.json(insight);
  } catch (err: any) {
    console.error("Insight Error:", err);
    return NextResponse.json({ error: err.toString() });
  }
}
