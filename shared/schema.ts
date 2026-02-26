import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  startTime: timestamp("start_time").defaultNow().notNull(),
  returnedAt: timestamp("returned_at"),
});

// === BASE SCHEMAS ===
export const insertQuestSchema = createInsertSchema(quests).omit({ id: true, startTime: true, returnedAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;

export type CreateQuestRequest = InsertQuest;
export type QuestResponse = Quest;
export type QuestsListResponse = Quest[];
