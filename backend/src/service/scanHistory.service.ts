import { ScanHistoryModel } from "../models/scanHistory.model";
import type { DurianAnalysisResult } from "../models/durian";

interface CreateScanHistoryInput extends Omit<
  DurianAnalysisResult,
  "timestamp"
> {
  username: string;
  userId?: string;
  timestamp?: string;
}

function mapScan(scan: {
  _id: unknown;
  username: string;
  userId?: string;
  ripeness: string;
  confidence: number;
  variety: string;
  texture: string;
  description: string;
  timestamp: Date;
  audioUri?: string;
}) {
  return {
    id: String(scan._id),
    username: scan.username,
    userId: scan.userId,
    ripeness: scan.ripeness,
    confidence: scan.confidence,
    variety: scan.variety,
    texture: scan.texture,
    description: scan.description,
    timestamp: scan.timestamp.toISOString(),
    audioUri: scan.audioUri,
  };
}

export async function createScanHistory(input: CreateScanHistoryInput) {
  const created = await ScanHistoryModel.create({
    username: input.username,
    userId: input.userId,
    ripeness: input.ripeness,
    confidence: input.confidence,
    variety: input.variety,
    texture: input.texture,
    description: input.description,
    timestamp: input.timestamp ? new Date(input.timestamp) : new Date(),
    audioUri: input.audioUri,
  });

  return mapScan(created);
}

export async function listUserScanHistory(username: string, limit = 50) {
  const scans = await ScanHistoryModel.find({ username })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();

  return scans.map(mapScan);
}

export async function listGlobalScanHistory(limit = 10) {
  const scans = await ScanHistoryModel.find({})
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();

  return scans.map(mapScan);
}

export async function deleteScanHistoryById(id: string, username?: string) {
  const where = username ? { _id: id, username } : { _id: id };
  const result = await ScanHistoryModel.deleteOne(where as never);
  return result.deletedCount > 0;
}
