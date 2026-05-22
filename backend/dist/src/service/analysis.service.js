"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeAudioFile = analyzeAudioFile;
const pythonInference_service_1 = require("./pythonInference.service");
const analysisProfiles_1 = require("../helper/analysisProfiles");
const env_1 = require("../config/env");
function getProbabilityMargin(probabilities) {
    const scores = Object.values(probabilities).sort((a, b) => b - a);
    const top = scores[0] ?? 0;
    const runnerUp = scores[1] ?? 0;
    return top - runnerUp;
}
async function analyzeAudioFile(params) {
    const inference = await (0, pythonInference_service_1.inferAudioWithModel)(params.buffer, params.originalName, params.mimeType);
    const probabilityMargin = getProbabilityMargin(inference.probabilities);
    const isStrongRipePrediction = inference.label.trim().toLowerCase() === "ripe" &&
        inference.confidence >= env_1.env.predictionThreshold &&
        probabilityMargin >= 0.2;
    const normalizedLabel = isStrongRipePrediction ? "ripe" : "unripe";
    return (0, analysisProfiles_1.buildDurianAnalysisResult)({
        label: normalizedLabel,
        confidence: inference.confidence,
        audioSeed: (0, pythonInference_service_1.fingerprintAudio)(params.buffer),
    });
}
