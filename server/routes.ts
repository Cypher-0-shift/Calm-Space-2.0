import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check (production standard)
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Future APIs yahin add hongi
  // app.post("/api/panic", ...)
  // app.post("/api/chat", ...)

  const server = createServer(app);
  return server;
}
