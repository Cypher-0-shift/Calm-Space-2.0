// src/vault/index.ts
// High-level Vault API
// This is the ONLY place higher layers should talk to storage.

import { saveEncrypted, loadDecrypted } from "./vault";

const PROFILE_KEY = "user_profile";

export const Vault = {
  // -------------------------
  // Generic low-level helpers
  // -------------------------

  async _save(namespace: string, data: any) {
    return saveEncrypted(namespace, data);
  },

  async _get<T = any>(namespace: string): Promise<T | null> {
    return loadDecrypted<T>(namespace);
  },

  async _delete(namespace: string) {
    localStorage.removeItem(namespace);
  },

  async clearAllData() {
    localStorage.clear();
  },

  // -------------------------
  // Profile helpers (Dashboard expects these)
  // -------------------------

  async getProfile<T = any>(): Promise<T | null> {
    return loadDecrypted<T>(PROFILE_KEY);
  },

  async setProfile(profile: any) {
    return saveEncrypted(PROFILE_KEY, profile);
  },

  // 🔹 Backward-compat alias (DO NOT REMOVE)
  async saveProfile(profile: any) {
    return this.setProfile(profile);
  },
};

// -------------------------
// Backward-compatible alias
// -------------------------
export const vault = Vault;
