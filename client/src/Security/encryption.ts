// src/security/encryption.ts
/**
 * Lightweight AES-GCM encryption helpers using Web Crypto API (TypeScript)
 * - encryptString(plain, key) -> base64 string (iv + ciphertext)
 * - decryptString(base64, key) -> plain string
 *
 * NOTE: The key is a CryptoKey for AES-GCM (256-bit).
 */

const IV_LENGTH = 12; // AES-GCM recommended IV size

export async function generateAesKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function exportKeyToJwk(key: CryptoKey): Promise<JsonWebKey> {
  return crypto.subtle.exportKey("jwk", key);
}

export async function importKeyFromJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  return crypto.subtle.importKey("jwk", jwk, { name: "AES-GCM" }, true, [
    "encrypt",
    "decrypt",
  ]);
}

function concatUint8Arrays(a: Uint8Array, b: Uint8Array) {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

function uint8ArrayToBase64(bytes: Uint8Array) {
  // browser-friendly base64
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToUint8Array(base64: string) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function encryptString(
  plainText: string,
  key: CryptoKey
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const enc = new TextEncoder();
  const data = enc.encode(plainText);

  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  const cipherBytes = new Uint8Array(cipher);
  const combined = concatUint8Arrays(iv, cipherBytes);
  return uint8ArrayToBase64(combined);
}

export async function decryptString(
  base64Combined: string,
  key: CryptoKey
): Promise<string> {
  const combined = base64ToUint8Array(base64Combined);
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );
  const dec = new TextDecoder();
  return dec.decode(decrypted);
}
