// src/vault/chatStore.ts
import { storeAdd, storeGetByType, storeDelete } from "@/db/store";
import { saveEncrypted, loadDecrypted } from "./vault";

const TYPE = "chat";

export async function saveChatMessage(message: any) {
  const timestamp = new Date().toISOString();

  const encryptedPayload = await saveEncrypted(`${TYPE}_${timestamp}`, message);

  return await storeAdd({
    type: TYPE,
    timestamp,
    encryptedPayload,
  });
}

export async function getChatMessages() {
  const raw = await storeGetByType(TYPE);

  const results = [];
  for (const item of raw) {
    const decrypted = await loadDecrypted(`${TYPE}_${item.timestamp}`);
    if (decrypted) results.push({ ...decrypted, id: item.id });
  }

  return results;
}

export async function clearChat() {
  // Optionally delete one-by-one
  const raw = await storeGetByType(TYPE);
  for (const item of raw) await storeDelete(item.id);
}
