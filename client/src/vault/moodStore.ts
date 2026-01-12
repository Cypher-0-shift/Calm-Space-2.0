// src/vault/moodStore.ts
import { storeAdd, storeGetByType } from "@/db/store";
import { saveEncrypted, loadDecrypted } from "./vault";

const TYPE = "mood";

export async function saveMood(entry: any) {
  const timestamp = new Date().toISOString();

  const encryptedPayload = await saveEncrypted(`${TYPE}_${timestamp}`, entry);

  return await storeAdd({
    type: TYPE,
    timestamp,
    encryptedPayload,
  });
}

export async function getMoodHistory() {
  const raw = await storeGetByType(TYPE);

  const results = [];
  for (const item of raw) {
    const decrypted = await loadDecrypted(`${TYPE}_${item.timestamp}`);
    if (decrypted) results.push({ ...decrypted, id: item.id });
  }

  return results;
}
