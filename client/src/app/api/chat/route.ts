// app/api/chat/route.ts
// Next.js App Router - AI Chat Backend
// ----------------------------------------------------
// Dev Mode: Uses OLLAMA running locally
// Prod Mode: You can switch to MLC or cloud ollama easily
// Endpoint: POST /api/chat
// ----------------------------------------------------

import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ensures Node runtime, not Edge

// -------------------------------
// OLLAMA CALL (LOCAL DEV)
// -------------------------------
async function callOllama(messages: any[]) {
  try {
    const prompt = messages.map((m) => `${m.role}: ${m.content}`).join("\n");

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2", // pull with "ollama pull llama3.2"
        prompt,
        stream: false,
      }),
    });

    const json = await res.json();

    return {
      text: json.response || "I'm here with you. Tell me more.",
      meta: {
        model: "llama3.2",
        total_duration: json.total_duration,
      },
    };
  } catch (err: any) {
    console.error("❌ OLLAMA ERROR:", err);
    return {
      text: "Sorry, I’m having trouble connecting right now.",
      meta: { error: err.toString() },
    };
  }
}

// -------------------------------
// NEXT.JS API ENDPOINT
// -------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array missing" },
        { status: 400 }
      );
    }

    // DEV: Local LLM
    const response = await callOllama(messages);

    return NextResponse.json({
      reply: response.text,
      meta: response.meta,
    });
  } catch (err: any) {
    console.error("❌ CHAT API ERROR:", err);
    return NextResponse.json(
      { error: err.toString() },
      { status: 500 }
    );
  }
}
