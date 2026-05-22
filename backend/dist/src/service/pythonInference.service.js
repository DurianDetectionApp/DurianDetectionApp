"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferAudioWithModel = inferAudioWithModel;
exports.fingerprintAudio = fingerprintAudio;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
function parseJsonFromStdout(stdout) {
    const trimmed = stdout.trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start < 0 || end < 0 || end <= start) {
        throw new Error("Python inference did not return JSON output.");
    }
    return JSON.parse(trimmed.slice(start, end + 1));
}
function guessExtension(mimeType) {
    if (mimeType.includes("webm"))
        return ".webm";
    if (mimeType.includes("wav"))
        return ".wav";
    if (mimeType.includes("mp3"))
        return ".mp3";
    if (mimeType.includes("mp4") ||
        mimeType.includes("m4a") ||
        mimeType.includes("aac"))
        return ".m4a";
    return ".wav";
}
async function inferAudioWithModel(audioBuffer, originalName, mimeType) {
    // For production we require an external HTTP inference service.
    if (!env_1.env.aiModelHttpUrl) {
        throw new Error("AI_MODEL_HTTP_URL is not configured. Backend is configured to use HTTP inference only.");
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
        // TypeScript DOM typings expect BodyInit; cast Buffer to any to satisfy compiler
        const resp = await fetch(env_1.env.aiModelHttpUrl, {
            method: "POST",
            headers: {
                "content-type": mimeType || "application/octet-stream",
                "x-filename": originalName || "audio",
                ...(env_1.env.inferenceApiKey ? { "x-api-key": env_1.env.inferenceApiKey } : {}),
            },
            body: audioBuffer,
            signal: controller.signal,
        });
        clearTimeout(timeout);
        if (!resp.ok) {
            throw new Error(`Inference service HTTP ${resp.status}`);
        }
        const json = await resp.json();
        return json;
    }
    catch (err) {
        clearTimeout(timeout);
        // eslint-disable-next-line no-console
        console.error(`[python-infer] HTTP inference failed: ${err.message}`);
        throw err;
    }
}
function fingerprintAudio(buffer) {
    return crypto_1.default.createHash("sha1").update(buffer).digest("hex");
}
