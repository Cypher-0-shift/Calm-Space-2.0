// src/security/keyManager.ts
/**
 * Simple master key manager.
 * - generateMasterKey() -> creates and persists key (JWK) locally
 * - getMasterKey() -> returns CryptoKey if exists, else null
 * - clearMasterKey() -> deletes persisted key
 *
 * NOTE: For higher security, replace localStorage with platform secure storage / biometrics.
 */

import {
  generateAesKey,
  exportKeyToJwk,
  importKeyFromJwk,
} from "./encryption";

const MASTER_KEY_STORAGE = "calmspace_master_key_jwk_v1";

export async function generateAndStoreMasterKey(): Promise<CryptoKey> {
  const key = await generateAesKey();
  const jwk = await exportKeyToJwk(key);
  localStorage.setItem(MASTER_KEY_STORAGE, JSON.stringify(jwk));
  return key;
}

export async function getStoredMasterKey(): Promise<CryptoKey | null> {
  const raw = localStorage.getItem(MASTER_KEY_STORAGE);
  if (!raw) return null;
  try {
    const jwk = JSON.parse(raw) as JsonWebKey;
    const key = await importKeyFromJwk(jwk);
    return key;
  } catch (err) {
    console.error("Failed to parse/import stored master key", err);
    return null;
  }
}

export function clearMasterKey(): void {
  localStorage.removeItem(MASTER_KEY_STORAGE);
}
