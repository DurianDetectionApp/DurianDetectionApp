"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeAudioFile = analyzeAudioFile;
const pythonInference_service_1 = require("./pythonInference.service");
const analysisProfiles_1 = require("../helper/analysisProfiles");
async function analyzeAudioFile(params) {
    const inference = await (0, pythonInference_service_1.inferAudioWithModel)(params.buffer, params.originalName, params.mimeType);
    return (0, analysisProfiles_1.buildDurianAnalysisResult)({
        label: inference.label,
        confidence: inference.confidence,
        audioSeed: (0, pythonInference_service_1.fingerprintAudio)(params.buffer),
    });
}
