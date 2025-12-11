import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodSchema, insertJournalEntrySchema, insertPlaylistSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Groq API proxy route
  app.post("/api/groq", async (req, res) => {
    try {
      const { model, messages } = req.body;
      const groqApiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
      
      if (!groqApiKey) {
        return res.status(500).json({ error: "Groq API key not configured" });
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model || "llama3-70b-8192",
          messages,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Groq API error:", error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // YouTube API proxy route
  app.get("/api/youtube/search", async (req, res) => {
    try {
      const { q, maxResults = 10 } = req.query;
      const youtubeApiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
      
      if (!youtubeApiKey) {
        return res.status(500).json({ error: "YouTube API key not configured" });
      }

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q as string)}&maxResults=${maxResults}&type=video&key=${youtubeApiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("YouTube API error:", error);
      res.status(500).json({ error: "Failed to search YouTube" });
    }
  });

  // Mood tracking routes
  app.post("/api/moods", async (req, res) => {
    try {
      const validatedData = insertMoodSchema.parse(req.body);
      const mood = await storage.createMood(validatedData);
      res.json(mood);
    } catch (error) {
      res.status(400).json({ error: "Invalid mood data" });
    }
  });

  app.get("/api/moods/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const moods = await storage.getMoodsByUserId(userId);
      res.json(moods);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch moods" });
    }
  });

  // Journal routes
  app.post("/api/journal", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(validatedData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ error: "Invalid journal entry data" });
    }
  });

  app.get("/api/journal/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const entries = await storage.getJournalEntriesByUserId(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  // Playlist routes
  app.post("/api/playlists", async (req, res) => {
    try {
      const validatedData = insertPlaylistSchema.parse(req.body);
      const playlist = await storage.createPlaylist(validatedData);
      res.json(playlist);
    } catch (error) {
      res.status(400).json({ error: "Invalid playlist data" });
    }
  });

  app.get("/api/playlists/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const playlists = await storage.getPlaylistsByUserId(userId);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch playlists" });
    }
  });

  // Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid chat message data" });
    }
  });

  app.get("/api/chat/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const messages = await storage.getChatMessagesByUserId(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
