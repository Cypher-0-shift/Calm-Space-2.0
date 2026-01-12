// src/vault/brainStore.ts
// Stores reinforcement signals for BrainEngine
// Fully encrypted through the Vault layer

import { storeAdd, storeGetByType } from "@/db/store";
import { saveEncrypted, loadDecrypted } from "./vault";

const TYPE = "brain_signal";

export interface BrainSignal {
  type: string;      // "suggestion_used" | "suggestion_ignored" | "mood_repeat" | ...
  payload?: any;     // e.g. { suggestionId, mood, timestamp }
  timestamp: string; // ISO date
}

export async function saveBrainSignal(signal: BrainSignal) {
  const timestamp = new Date().toISOString();

  const encryptedPayload = await saveEncrypted(`${TYPE}_${timestamp}`, signal);

  return await storeAdd({
    type: TYPE,
    timestamp,
    encryptedPayload,
  });
}

export async function getBrainSignals(): Promise<BrainSignal[]> {
  const raw = await storeGetByType(TYPE);
  const results: BrainSignal[] = [];

  for (const item of raw) {
    const decrypted = await loadDecrypted(`${TYPE}_${item.timestamp}`);
    if (decrypted) results.push(decrypted as BrainSignal);
  }

  return results;
}
