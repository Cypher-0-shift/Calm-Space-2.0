// src/vault/journalStore.ts
import { storeAdd, storeGetByType, storeDelete } from "@/db/store";
import { saveEncrypted, loadDecrypted } from "./vault";

const TYPE = "journal";

export async function saveJournal(entry: any) {
  const timestamp = new Date().toISOString();

  const encryptedPayload = await saveEncrypted(`${TYPE}_${timestamp}`, entry);

  return await storeAdd({
    type: TYPE,
    timestamp,
    encryptedPayload,
  });
}

export async function getJournals() {
  const raw = await storeGetByType(TYPE);

  const results = [];
  for (const item of raw) {
    const decrypted = await loadDecrypted(`${TYPE}_${item.timestamp}`);
    if (decrypted) results.push({ ...decrypted, id: item.id });
  }

  return results;
}

export async function deleteJournal(id: number) {
  return await storeDelete(id);
}
