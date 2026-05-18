import { z } from "zod";

export const createScanHistorySchema = z.object({
  username: z.string().min(1),
  userId: z.string().optional(),
  ripeness: z.enum(["ripe", "under_ripe", "over_ripe", "undetected"]),
  confidence: z.number().min(0).max(1),
  variety: z.string().min(1),
  texture: z.string().min(1),
  description: z.string().min(1),
  timestamp: z.string().datetime().optional(),
  audioUri: z.string().optional(),
});

export const listScanHistoryQuerySchema = z.object({
  username: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});
