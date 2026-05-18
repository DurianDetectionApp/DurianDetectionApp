"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanHistoryModel = void 0;
const mongoose_1 = require("mongoose");
const scanHistorySchema = new mongoose_1.Schema({
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
}, {
    collection: "scan_history",
    versionKey: false,
});
scanHistorySchema.index({ timestamp: -1 });
exports.ScanHistoryModel = (0, mongoose_1.model)("ScanHistory", scanHistorySchema);
