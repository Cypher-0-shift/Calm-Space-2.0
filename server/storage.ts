import { type User, type InsertUser, type Mood, type InsertMood, type JournalEntry, type InsertJournalEntry, type Playlist, type InsertPlaylist, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Mood methods
  getMoodsByUserId(userId: string): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  
  // Journal methods
  getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  
  // Playlist methods
  getPlaylistsByUserId(userId: string): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  
  // Chat methods
  getChatMessagesByUserId(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moods: Map<string, Mood>;
  private journalEntries: Map<string, JournalEntry>;
  private playlists: Map<string, Playlist>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.moods = new Map();
    this.journalEntries = new Map();
    this.playlists = new Map();
    this.chatMessages = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getMoodsByUserId(userId: string): Promise<Mood[]> {
    return Array.from(this.moods.values()).filter(mood => mood.userId === userId);
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    const id = randomUUID();
    const mood: Mood = {
      ...insertMood,
      id,
      createdAt: new Date()
    };
    this.moods.set(id, mood);
    return mood;
  }

  async getJournalEntriesByUserId(userId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values()).filter(entry => entry.userId === userId);
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const entry: JournalEntry = {
      ...insertEntry,
      id,
      createdAt: new Date()
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async getPlaylistsByUserId(userId: string): Promise<Playlist[]> {
    return Array.from(this.playlists.values()).filter(playlist => playlist.userId === userId);
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = randomUUID();
    const playlist: Playlist = {
      ...insertPlaylist,
      id,
      createdAt: new Date()
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async getChatMessagesByUserId(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(message => message.userId === userId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
