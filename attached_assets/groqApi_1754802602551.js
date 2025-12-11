// client/src/utils/groqApi.js
export async function getGroqReply(messages) {
  const res = await fetch("/api/groq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages,
    }),
  });

  if (!res.ok) {
    throw new Error("Groq API request failed");
  }

  return await res.json();
}
