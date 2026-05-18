"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listScanHistoryQuerySchema = exports.createScanHistorySchema = void 0;
const zod_1 = require("zod");
exports.createScanHistorySchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    userId: zod_1.z.string().optional(),
    ripeness: zod_1.z.enum(["ripe", "under_ripe", "over_ripe", "undetected"]),
    confidence: zod_1.z.number().min(0).max(1),
    variety: zod_1.z.string().min(1),
    texture: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    timestamp: zod_1.z.string().datetime().optional(),
    audioUri: zod_1.z.string().optional(),
});
exports.listScanHistoryQuerySchema = zod_1.z.object({
    username: zod_1.z.string().optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).optional(),
});
