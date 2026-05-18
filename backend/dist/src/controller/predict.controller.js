"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictController = predictController;
const analysis_service_1 = require("../service/analysis.service");
async function predictController(req, res) {
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: 'Missing audio file. Send multipart/form-data with field name "audio".',
        });
        return;
    }
    const result = await (0, analysis_service_1.analyzeAudioFile)({
        buffer: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
    });
    res.json({
        ...result,
        model: {
            provider: "python-random-forest",
            source: "DURIAN_RIPENESS_CLASSIFICATION/models/random_forest.pkl",
        },
    });
}
