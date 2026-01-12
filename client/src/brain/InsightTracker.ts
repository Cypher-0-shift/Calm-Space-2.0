// src/brain/InsightTracker.ts
/**
 * Minimal insight tracker v1 -- stores in-memory statistics and can be extended to persist.
 */

type AnyEvent = any;

export class InsightTracker {
  private events: AnyEvent[] = [];

  record(evt: AnyEvent, estimation: any) {
    this.events.push({ evt, estimation, ts: Date.now() });
    // pruning simple policy
    if (this.events.length > 2000) this.events.splice(0, 1000);
  }

  getRecent(count = 50) {
    return this.events.slice(-count);
  }
}
