import { z } from 'zod';
import { insertQuestSchema, quests } from './schema';

// Shared Error Schemas
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// API Contract
export const api = {
  quests: {
    list: {
      method: 'GET' as const,
      path: '/api/quests' as const,
      responses: {
        200: z.array(z.custom<typeof quests.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/quests' as const,
      input: insertQuestSchema,
      responses: {
        201: z.custom<typeof quests.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    return: {
      method: 'PATCH' as const,
      path: '/api/quests/:id/return' as const,
      responses: {
        200: z.custom<typeof quests.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
};

// Helper for URL building
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// Export inferred types
export type CreateQuestInput = z.infer<typeof api.quests.create.input>;
export type QuestResponse = z.infer<typeof api.quests.create.responses[201]>;
export type QuestsListResponse = z.infer<typeof api.quests.list.responses[200]>;
export type ValidationError = z.infer<typeof errorSchemas.validation>;
export type NotFoundError = z.infer<typeof errorSchemas.notFound>;
