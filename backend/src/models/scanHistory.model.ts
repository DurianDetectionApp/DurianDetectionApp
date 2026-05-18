import { Schema, model } from "mongoose";
import type { RipenessType } from "./durian";

export interface ScanHistoryDocument {
  username: string;
  userId?: string;
  ripeness: RipenessType;
  confidence: number;
  variety: string;
  texture: string;
  description: string;
  timestamp: Date;
  audioUri?: string;
}

const scanHistorySchema = new Schema<ScanHistoryDocument>(
  {
    username: { type: String, required: true, index: true },
    userId: { type: String },
    ripeness: {
      type: String,
      required: true,
      enum: ["ripe", "under_ripe", "over_ripe", "undetected"],
    },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    variety: { type: String, required: true },
    texture: { type: String, required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, required: true, default: () => new Date() },
    audioUri: { type: String },
  },
  {
    collection: "scan_history",
    versionKey: false,
  },
);

scanHistorySchema.index({ timestamp: -1 });

export const ScanHistoryModel = model<ScanHistoryDocument>(
  "ScanHistory",
  scanHistorySchema,
);
