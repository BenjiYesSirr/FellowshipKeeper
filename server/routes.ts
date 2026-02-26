import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { db } from "./db";
import { quests } from "@shared/schema";

async function seedDatabase() {
  const existingQuests = await storage.getQuests();
  if (existingQuests.length === 0) {
    const now = new Date();
    
    // 1. Returned successfully (started 30 mins ago, returned 10 mins ago)
    await db.insert(quests).values({
      studentName: "Frodo Baggins",
      startTime: new Date(now.getTime() - 30 * 60 * 1000),
      returnedAt: new Date(now.getTime() - 10 * 60 * 1000),
    });

    // 2. Active Quest (started 20 mins ago)
    await db.insert(quests).values({
      studentName: "Samwise Gamgee",
      startTime: new Date(now.getTime() - 20 * 60 * 1000),
    });

    // 3. Failed Quest (started 2 hours ago, active)
    await db.insert(quests).values({
      studentName: "Peregrin Took",
      startTime: new Date(now.getTime() - 120 * 60 * 1000),
    });

    // 4. Failed Quest (started 3 hours ago, returned 1 hour ago -> took 2 hours)
    await db.insert(quests).values({
      studentName: "Meriadoc Brandybuck",
      startTime: new Date(now.getTime() - 180 * 60 * 1000),
      returnedAt: new Date(now.getTime() - 60 * 60 * 1000),
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Call seed database
  seedDatabase().catch(console.error);

  app.get(api.quests.list.path, async (req, res) => {
    const questList = await storage.getQuests();
    res.json(questList);
  });

  app.post(api.quests.create.path, async (req, res) => {
    try {
      const input = api.quests.create.input.parse(req.body);
      const quest = await storage.createQuest(input);
      res.status(201).json(quest);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.quests.return.path, async (req, res) => {
    const id = Number(req.params.id);
    const quest = await storage.returnQuest(id);
    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }
    res.json(quest);
  });

  return httpServer;
}
