import Dexie, { type Table } from 'dexie';

// We use a "Single Secure Table" strategy. 
// Instead of creating 20 tables, we create one flexible table for everything.
export interface VaultItem {
  id?: number;
  type: string;         // 'journal' | 'mood' | 'chat_history'
  timestamp: string;    // ISO Date
  encryptedPayload: string; // The encrypted data from security.ts
}

export class CalmSpaceDB extends Dexie {
  items!: Table<VaultItem>; 

  constructor() {
    super('CalmSpaceDB');
    this.version(1).stores({
      items: '++id, type, timestamp' // Indexed fields for fast searching
    });
  }
}

export const db = new CalmSpaceDB();