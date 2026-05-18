"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScanHistory = createScanHistory;
exports.listUserScanHistory = listUserScanHistory;
exports.listGlobalScanHistory = listGlobalScanHistory;
exports.deleteScanHistoryById = deleteScanHistoryById;
const scanHistory_model_1 = require("../models/scanHistory.model");
function mapScan(scan) {
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
async function createScanHistory(input) {
    const created = await scanHistory_model_1.ScanHistoryModel.create({
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
async function listUserScanHistory(username, limit = 50) {
    const scans = await scanHistory_model_1.ScanHistoryModel.find({ username })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    return scans.map(mapScan);
}
async function listGlobalScanHistory(limit = 10) {
    const scans = await scanHistory_model_1.ScanHistoryModel.find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    return scans.map(mapScan);
}
async function deleteScanHistoryById(id, username) {
    const where = username ? { _id: id, username } : { _id: id };
    const result = await scanHistory_model_1.ScanHistoryModel.deleteOne(where);
    return result.deletedCount > 0;
}
