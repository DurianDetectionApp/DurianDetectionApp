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
    // If an external HTTP inference service is configured, POST the audio bytes
    if (env_1.env.aiModelHttpUrl) {
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
                // `audioBuffer` is a Node Buffer — cast to any so tsc in Docker build doesn't complain
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
            // fallback to local python execution below
            // eslint-disable-next-line no-console
            console.warn(`[python-infer] HTTP inference failed: ${err.message}`);
        }
    }
    const tempDir = fs_1.default.mkdtempSync(path_1.default.join(os_1.default.tmpdir(), "durly-"));
    const extension = path_1.default.extname(originalName) || guessExtension(mimeType);
    const audioPath = path_1.default.join(tempDir, `audio${extension}`);
    fs_1.default.writeFileSync(audioPath, audioBuffer);
    const scriptPath = path_1.default.join(env_1.env.aiModelDir, "src", "predict.py");
    const candidates = [];
    if (env_1.env.pythonBin) {
        candidates.push({ command: env_1.env.pythonBin, args: [] });
    }
    // Prefer system python3 paths commonly available in Linux containers
    candidates.push({ command: "/usr/bin/python3", args: [] }, { command: "/usr/bin/python", args: [] }, { command: "python3", args: [] }, { command: "python", args: [] });
    let lastError;
    const attempts = [];
    try {
        for (const candidate of candidates) {
            // Log which candidate we are about to try (helps debugging in production)
            try {
                // eslint-disable-next-line no-console
                console.log(`[python-infer] trying command: ${candidate.command} ${candidate.args.join(" ")}`);
            }
            catch (err) {
                // ignore
            }
            const result = runPython(candidate.command, candidate.args, scriptPath, audioPath);
            if (result.status === 0 && result.stdout.trim()) {
                return parseJsonFromStdout(result.stdout);
            }
            const stderr = `${result.stderr ?? ""}`.trim();
            const stdout = `${result.stdout ?? ""}`.trim();
            const errMsg = stderr ||
                stdout ||
                result.error?.message ||
                `Python exited with code ${result.status ?? "unknown"}`;
            // record attempt detail
            attempts.push(`${candidate.command} -> status=${result.status ?? "?"} error=${result.error?.message ?? "none"} stdout=${JSON.stringify(stdout)} stderr=${JSON.stringify(stderr)}`);
            lastError = errMsg;
            const errorCode = result.error
                ?.code;
            if (errorCode === "ENOENT") {
                continue;
            }
        }
        const details = attempts.join("\n");
        throw new Error((lastError ? lastError + " - " : "") +
            "Unable to execute Python inference. Attempts:\n" +
            details);
    }
    finally {
        fs_1.default.rmSync(tempDir, { recursive: true, force: true });
    }
}
function fingerprintAudio(buffer) {
    return crypto_1.default.createHash("sha1").update(buffer).digest("hex");
}
