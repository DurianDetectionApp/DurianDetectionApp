"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScanHistoryController = createScanHistoryController;
exports.listUserScanHistoryController = listUserScanHistoryController;
exports.listGlobalScanHistoryController = listGlobalScanHistoryController;
exports.deleteScanHistoryController = deleteScanHistoryController;
const database_1 = require("../config/database");
const scanHistory_validator_1 = require("../validator/scanHistory.validator");
const scanHistory_service_1 = require("../service/scanHistory.service");
function requireDatabase(res) {
    if (!(0, database_1.isDatabaseReady)()) {
        res.status(503).json({
            message: "Database is not ready. Configure MONGODB_URI and restart backend.",
        });
        return false;
    }
    return true;
}
async function createScanHistoryController(req, res) {
    if (!requireDatabase(res))
        return;
    const parsed = scanHistory_validator_1.createScanHistorySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: "Invalid scan history payload",
            errors: parsed.error.flatten(),
        });
        return;
    }
    const created = await (0, scanHistory_service_1.createScanHistory)(parsed.data);
    res.status(201).json(created);
}
async function listUserScanHistoryController(req, res) {
    if (!requireDatabase(res))
        return;
    const parsed = scanHistory_validator_1.listScanHistoryQuerySchema.safeParse(req.query);
    if (!parsed.success || !parsed.data.username) {
        res.status(400).json({
            message: "Query param username is required",
        });
        return;
    }
    const scans = await (0, scanHistory_service_1.listUserScanHistory)(parsed.data.username, parsed.data.limit ?? 50);
    res.json(scans);
}
async function listGlobalScanHistoryController(req, res) {
    if (!requireDatabase(res))
        return;
    const parsed = scanHistory_validator_1.listScanHistoryQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        res.status(400).json({
            message: "Invalid query params",
        });
        return;
    }
    const scans = await (0, scanHistory_service_1.listGlobalScanHistory)(parsed.data.limit ?? 10);
    res.json(scans);
}
async function deleteScanHistoryController(req, res) {
    if (!requireDatabase(res))
        return;
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const username = typeof req.query.username === "string" ? req.query.username : undefined;
    const deleted = await (0, scanHistory_service_1.deleteScanHistoryById)(id, username);
    if (!deleted) {
        res.status(404).json({ message: "Scan not found" });
        return;
    }
    res.status(204).send();
}
