// src/vault/vault.ts
// Low-level AES encrypted read/write helpers

import { encryptString, decryptString } from "@/security/encryption";
import { getStoredMasterKey, generateAndStoreMasterKey } from "@/security/keyManager";

// Ensure master AES key exists before encrypt/decrypt
async function ensureKey(): Promise<CryptoKey> {
  let key = await getStoredMasterKey();
  if (!key) key = await generateAndStoreMasterKey();
  return key;
}

/**
 * Save encrypted data in localStorage (metadata linking)
 * High-level Vault API (index.ts) will handle actual DB insertion.
 */
export async function saveEncrypted(namespace: string, data: any) {
  const key = await ensureKey();
  const plain = JSON.stringify(data);
  const encrypted = await encryptString(plain, key);
  localStorage.setItem(namespace, encrypted);
  return encrypted;
}

export async function loadDecrypted<T = any>(
  namespace: string
): Promise<T | null> {
  const encrypted = localStorage.getItem(namespace);
  if (!encrypted) return null;

  const key = await ensureKey();

  try {
    const decrypted = await decryptString(encrypted, key);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error("Vault load error:", error);
    return null;
  }
}
export { vault } from "./index";