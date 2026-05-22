"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRipeness = normalizeRipeness;
exports.buildDurianAnalysisResult = buildDurianAnalysisResult;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const DURIAN_VARIETIES = [
    "Musang King",
    "D24 Sultan",
    "Black Thorn",
    "Golden Phoenix",
    "Red Prawn",
];
const TEXTURES = {
    ripe: ["Buttery Smooth", "Creamy Rich", "Silky Dense"],
    unripe: [
        "Firm & Dry",
        "Slightly Bitter",
        "Dense & Compact",
        "Overly Sweet",
        "Soft & Mushy",
        "Strong Odor",
    ],
    undetected: ["Unknown", "Inconclusive"],
};
const DESCRIPTIONS = {
    ripe: [
        "Your durian has reached peak creaminess. Time to feast!",
        "Perfect ripeness detected — rich, complex flavor awaits!",
        "Optimal eating window. The flesh is at its creamiest!",
    ],
    unripe: [
        "This durian needs a few more days. Patience pays off!",
        "Not quite there yet — let it rest in a cool, dry place.",
        "Give it 2–3 more days for best flavor development.",
        "Better eat it now before it ferments further!",
        "Over-ripe but still edible — great for cooking!",
        "The window has passed slightly. Consume today if possible.",
    ],
    undetected: [
        "Could not determine ripeness. Try recording again closer to the stem.",
        "Unclear result — ensure you tap the widest part of the durian.",
    ],
};
function pickStable(seed, values) {
    const hash = crypto_1.default.createHash("sha1").update(seed).digest();
    const index = hash.readUInt32BE(0) % values.length;
    return values[index];
}
function normalizeRipeness(label, confidence) {
    const threshold = Number.isFinite(env_1.env.predictionThreshold)
        ? env_1.env.predictionThreshold
        : 0.9;
    // If confidence is below threshold or label is missing/invalid, treat as unripe
    if (!label || typeof label !== "string" || confidence < threshold) {
        return "unripe";
    }
    const normalized = label.trim().toLowerCase();
    if (normalized === "ripe")
        return "ripe";
    // Map both under/over-ripe and 'unripe' to a single 'unripe' class
    if (normalized === "unripe" ||
        normalized === "under_ripe" ||
        normalized === "overripe" ||
        normalized === "over_ripe") {
        return "unripe";
    }
    // Unknown labels → conservative unripe
    return "unripe";
}
function buildDurianAnalysisResult(params) {
    const ripeness = normalizeRipeness(params.label, params.confidence);
    const seed = `${params.audioSeed}:${ripeness}:${params.confidence.toFixed(4)}`;
    const variety = ripeness === "undetected" ? "Unknown" : pickStable(seed, DURIAN_VARIETIES);
    const texture = pickStable(seed, TEXTURES[ripeness]);
    const description = pickStable(seed, DESCRIPTIONS[ripeness]);
    return {
        ripeness,
        confidence: Math.max(0, Math.min(1, Number(params.confidence.toFixed(2)))),
        variety,
        texture,
        description,
        timestamp: new Date().toISOString(),
    };
}
