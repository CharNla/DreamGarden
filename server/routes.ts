import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlarmSchema, insertSleepRecordSchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const userId = "demo-user"; // For demo purposes, using a fixed user ID

  // Get user profile
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Alarm routes
  app.get("/api/alarms", async (req, res) => {
    try {
      const alarms = await storage.getAlarms(userId);
      res.json(alarms);
    } catch (error) {
      res.status(500).json({ message: "Failed to get alarms" });
    }
  });

  app.post("/api/alarms", async (req, res) => {
    try {
      const validatedData = insertAlarmSchema.parse(req.body);
      const alarm = await storage.createAlarm(userId, validatedData);
      res.status(201).json(alarm);
    } catch (error) {
      res.status(400).json({ message: "Invalid alarm data" });
    }
  });

  app.put("/api/alarms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAlarmSchema.partial().parse(req.body);
      const alarm = await storage.updateAlarm(id, validatedData);
      if (!alarm) {
        return res.status(404).json({ message: "Alarm not found" });
      }
      res.json(alarm);
    } catch (error) {
      res.status(400).json({ message: "Invalid alarm data" });
    }
  });

  app.delete("/api/alarms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAlarm(id);
      if (!success) {
        return res.status(404).json({ message: "Alarm not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete alarm" });
    }
  });

  // Sleep record routes
  app.get("/api/sleep-records", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const records = await storage.getSleepRecords(userId, limit);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to get sleep records" });
    }
  });

  app.post("/api/sleep-records", async (req, res) => {
    try {
      const validatedData = insertSleepRecordSchema.parse(req.body);
      
      // Check if record already exists for this date
      const existingRecord = await storage.getSleepRecordByDate(userId, validatedData.date);
      if (existingRecord) {
        return res.status(409).json({ message: "Sleep record already exists for this date" });
      }

      // Calculate rewards based on rating
      const dewdropsEarned = validatedData.rating * 2;
      const sunlightEarned = validatedData.rating === 5 ? 5 : validatedData.rating;
      
      const recordWithRewards = {
        ...validatedData,
        dewdropsEarned,
        sunlightEarned,
      };

      const record = await storage.createSleepRecord(userId, recordWithRewards);
      
      // Update user currency
      await storage.updateUserCurrency(userId, dewdropsEarned, sunlightEarned);
      
      res.status(201).json(record);
    } catch (error) {
      res.status(400).json({ message: "Invalid sleep record data" });
    }
  });

  // Chat routes
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChatMessages(userId, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      const userMessage = await storage.createChatMessage(userId, validatedData);
      
      // Generate AI response
      const aiResponse = generateAIResponse(validatedData.message);
      const aiMessage = await storage.createChatMessage(userId, {
        message: aiResponse,
        isFromUser: false,
      });
      
      res.status(201).json({ userMessage, aiMessage });
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  // Simple AI response generator
  function generateAIResponse(userMessage: string): string {
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('ไม่สบาย') || lowercaseMessage.includes('แย่') || lowercaseMessage.includes('เศร้า')) {
      return 'ได้ยินว่าเมื่อคืนนอนไม่สบายเลย ไม่เป็นไรนะ วันนี้ลองหาเวลาพักผ่อนดูนะ 💙';
    }
    
    if (lowercaseMessage.includes('ดี') || lowercaseMessage.includes('สบาย') || lowercaseMessage.includes('ขอบคุณ')) {
      return 'ดีใจด้วยนะ! การนอนหลับที่ดีจะช่วยให้ต้นไม้ของคุณเติบโตแข็งแรง 🌱✨';
    }
    
    if (lowercaseMessage.includes('ฝัน')) {
      return 'ความฝันสะท้อนจิตใจของเรานะ บันทึกไว้เพื่อดูรูปแบบการนอนหลับกันเถอะ 🌙';
    }
    
    if (lowercaseMessage.includes('ต้นไม้') || lowercaseMessage.includes('สวน')) {
      return 'ต้นไม้ของคุณกำลังเติบโตไปพร้อมกับการนอนหลับที่ดีขึ้นนะ ให้รดน้ำทุกเช้าเพื่อให้แข็งแรง 🌿';
    }
    
    // Default responses
    const responses = [
      'เข้าใจแล้วนะ ขอบคุณที่บอกฉัน 😊',
      'ฉันอยู่ที่นี่เพื่อช่วยดูแลการนอนหลับของคุณเสมอ 💚',
      'การนอนหลับที่ดีเป็นพื้นฐานของสุขภาพที่ดี ดูแลตัวเองด้วยนะ 🌸',
      'มีอะไรอยากปรึกษาเกี่ยวกับการนอนหลับไหม? ฉันพร้อมช่วยเสมอ 🤗'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const httpServer = createServer(app);
  return httpServer;
}
