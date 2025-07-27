import { type User, type InsertUser, type Alarm, type InsertAlarm, type SleepRecord, type InsertSleepRecord, type ChatMessage, type InsertChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";
import { mockUser, mockAlarms, mockSleepRecords, mockChatMessages } from "./mockdata";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCurrency(userId: string, dewdrops: number, sunlight: number): Promise<User | undefined>;

  // Alarm operations
  getAlarms(userId: string): Promise<Alarm[]>;
  createAlarm(userId: string, alarm: InsertAlarm): Promise<Alarm>;
  updateAlarm(id: number, alarm: Partial<InsertAlarm>): Promise<Alarm | undefined>;
  deleteAlarm(id: number): Promise<boolean>;

  // Sleep record operations
  getSleepRecords(userId: string, limit?: number): Promise<SleepRecord[]>;
  getSleepRecordByDate(userId: string, date: string): Promise<SleepRecord | undefined>;
  createSleepRecord(userId: string, record: InsertSleepRecord): Promise<SleepRecord>;
  
  // Chat operations
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(userId: string, message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private alarms: Map<number, Alarm>;
  private sleepRecords: Map<number, SleepRecord>;
  private chatMessages: Map<number, ChatMessage>;
  private nextAlarmId: number = 1;
  private nextSleepRecordId: number = 1;
  private nextChatMessageId: number = 1;

  constructor() {
    this.users = new Map();
    this.alarms = new Map();
    this.sleepRecords = new Map();
    this.chatMessages = new Map();
    // ใช้ mock data แทน
    this.users.set(mockUser.id, {
      ...mockUser,
      username: "demo",
      password: "demo",
      dewdrops: 127,
      sunlight: 89,
      createdAt: new Date(),
    });
    mockAlarms.forEach(alarm => {
      this.alarms.set(alarm.id, alarm);
      if (alarm.id >= this.nextAlarmId) this.nextAlarmId = alarm.id + 1;
    });
    mockSleepRecords.forEach(record => {
      this.sleepRecords.set(record.id, record);
      if (record.id >= this.nextSleepRecordId) this.nextSleepRecordId = record.id + 1;
    });
    mockChatMessages.forEach(msg => {
      this.chatMessages.set(msg.id, msg);
      if (msg.id >= this.nextChatMessageId) this.nextChatMessageId = msg.id + 1;
    });
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
      dewdrops: 0, 
      sunlight: 0, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCurrency(userId: string, dewdrops: number, sunlight: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      dewdrops: (user.dewdrops || 0) + dewdrops, 
      sunlight: (user.sunlight || 0) + sunlight 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getAlarms(userId: string): Promise<Alarm[]> {
    return Array.from(this.alarms.values()).filter(alarm => alarm.userId === userId);
  }

  async createAlarm(userId: string, alarm: InsertAlarm): Promise<Alarm> {
    const id = this.nextAlarmId++;
    const newAlarm: Alarm = {
      ...alarm,
      id,
      userId,
      createdAt: new Date(),
    };
    this.alarms.set(id, newAlarm);
    return newAlarm;
  }

  async updateAlarm(id: number, alarm: Partial<InsertAlarm>): Promise<Alarm | undefined> {
    const existingAlarm = this.alarms.get(id);
    if (!existingAlarm) return undefined;
    
    const updatedAlarm = { ...existingAlarm, ...alarm };
    this.alarms.set(id, updatedAlarm);
    return updatedAlarm;
  }

  async deleteAlarm(id: number): Promise<boolean> {
    return this.alarms.delete(id);
  }

  async getSleepRecords(userId: string, limit?: number): Promise<SleepRecord[]> {
    const records = Array.from(this.sleepRecords.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? records.slice(0, limit) : records;
  }

  async getSleepRecordByDate(userId: string, date: string): Promise<SleepRecord | undefined> {
    return Array.from(this.sleepRecords.values())
      .find(record => record.userId === userId && record.date === date);
  }

  async createSleepRecord(userId: string, record: InsertSleepRecord): Promise<SleepRecord> {
    const id = this.nextSleepRecordId++;
    const newRecord: SleepRecord = {
      ...record,
      id,
      userId,
      createdAt: new Date(),
    };
    this.sleepRecords.set(id, newRecord);
    return newRecord;
  }

  async getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
    
    return limit ? messages.slice(-limit) : messages;
  }

  async createChatMessage(userId: string, message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.nextChatMessageId++;
    const newMessage: ChatMessage = {
      ...message,
      id,
      userId,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
