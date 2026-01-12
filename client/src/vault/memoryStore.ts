import { Vault } from "./index";

export interface MemoryInsight {
  id?: number;
  type: "preference" | "trigger" | "pattern" | "mood_insight";
  content: string;
  weight: number;         // 0–1
  timestamp: string;      // ISO string
}

export const MemoryStore = {
  async saveInsight(insight: MemoryInsight) {
    return Vault._save("memory_insight", insight);
  },

  async getInsights(): Promise<MemoryInsight[]> {
    return (await Vault._get("memory_insight")) as MemoryInsight[];
  },

  async clearInsights() {
    const all = (await Vault._get("memory_insight")) as MemoryInsight[];

    for (const item of all) {
      if (item.id) {
        await Vault._delete(item.id);
      }
    }
  },
};
