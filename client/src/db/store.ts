// src/db/store.ts 
// 🔹 FINAL CLEAN DATABASE WRAPPER
// This file stores ONLY encrypted payloads.
// No encryption or business logic is allowed here.

import { db } from "./db";

// Add a new encrypted item to IndexedDB
export async function storeAdd(item: any) {
  return await db.items.add(item);
}

// Update an existing encrypted item
export async function storeUpdate(id: number, changes: any) {
  return await db.items.update(id, changes);
}

// Get all encrypted items by type
export async function storeGetByType(type: string) {
  return await db.items
    .where("type")
    .equals(type)
    .reverse()
    .sortBy("timestamp");
}

// Delete a specific encrypted item
export async function storeDelete(id: number) {
  return await db.items.delete(id);
}

// Clear ALL encrypted data (used for full reset)
export async function storeClearAll() {
  return await db.items.clear();
}
export { Vault } from "../vault";
