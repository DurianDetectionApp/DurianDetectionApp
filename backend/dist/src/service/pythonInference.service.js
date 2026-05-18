"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferAudioWithModel = inferAudioWithModel;
exports.fingerprintAudio = fingerprintAudio;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
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
function runPython(command, args, scriptPath, audioPath) {
    return (0, child_process_1.spawnSync)(command, [...args, scriptPath, audioPath], {
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024,
    });
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
    const tempDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), "durly-"));
    const extension = path_1.default.extname(originalName) || guessExtension(mimeType);
    const audioPath = path_1.default.join(tempDir, `audio${extension}`);
    fs_1.default.writeFileSync(audioPath, audioBuffer);
    const scriptPath = path_1.default.join(env_1.env.aiModelDir, "src", "predict.py");
    const candidates = [];
    if (env_1.env.pythonBin) {
        candidates.push({ command: env_1.env.pythonBin, args: [] });
    }
    candidates.push({ command: "python", args: [] }, { command: "python3", args: [] }, { command: "py", args: ["-3"] });
    let lastError;
    try {
        for (const candidate of candidates) {
            const result = runPython(candidate.command, candidate.args, scriptPath, audioPath);
            if (result.status === 0 && result.stdout.trim()) {
                return parseJsonFromStdout(result.stdout);
            }
            const stderr = `${result.stderr ?? ""}`.trim();
            const stdout = `${result.stdout ?? ""}`.trim();
            lastError =
                stderr ||
                    stdout ||
                    result.error?.message ||
                    `Python exited with code ${result.status ?? "unknown"}`;
            const errorCode = result.error
                ?.code;
            if (errorCode === "ENOENT") {
                continue;
            }
        }
        throw new Error(lastError || "Unable to execute Python inference.");
    }
    finally {
        fs_1.default.rmSync(tempDir, { recursive: true, force: true });
    }
}
function fingerprintAudio(buffer) {
    return crypto_1.default.createHash("sha1").update(buffer).digest("hex");
}
