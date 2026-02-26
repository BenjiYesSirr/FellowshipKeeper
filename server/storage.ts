import { db } from "./db";
import { quests, type Quest, type InsertQuest } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getQuests(): Promise<Quest[]>;
  getQuest(id: number): Promise<Quest | undefined>;
  createQuest(quest: InsertQuest): Promise<Quest>;
  returnQuest(id: number): Promise<Quest | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getQuests(): Promise<Quest[]> {
    return await db.select().from(quests).orderBy(desc(quests.startTime));
  }

  async getQuest(id: number): Promise<Quest | undefined> {
    const [quest] = await db.select().from(quests).where(eq(quests.id, id));
    return quest;
  }

  async createQuest(insertQuest: InsertQuest): Promise<Quest> {
    const [quest] = await db.insert(quests).values(insertQuest).returning();
    return quest;
  }

  async returnQuest(id: number): Promise<Quest | undefined> {
    const [quest] = await db.update(quests)
      .set({ returnedAt: new Date() })
      .where(eq(quests.id, id))
      .returning();
    return quest;
  }
}

export const storage = new DatabaseStorage();
