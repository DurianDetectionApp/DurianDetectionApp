import { spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import crypto from "crypto";
import { env } from "../config/env";
import type { PythonInferenceResult } from "../models/durian";

function parseJsonFromStdout(stdout: string): PythonInferenceResult {
  const trimmed = stdout.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");

  if (start < 0 || end < 0 || end <= start) {
    throw new Error("Python inference did not return JSON output.");
  }

  return JSON.parse(trimmed.slice(start, end + 1)) as PythonInferenceResult;
}

function runPython(
  command: string,
  args: string[],
  scriptPath: string,
  audioPath: string,
) {
  return spawnSync(command, [...args, scriptPath, audioPath], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
}

function guessExtension(mimeType: string): string {
  if (mimeType.includes("webm")) return ".webm";
  if (mimeType.includes("wav")) return ".wav";
  if (mimeType.includes("mp3")) return ".mp3";
  if (
    mimeType.includes("mp4") ||
    mimeType.includes("m4a") ||
    mimeType.includes("aac")
  )
    return ".m4a";
  return ".wav";
}

export async function inferAudioWithModel(
  audioBuffer: Buffer,
  originalName: string,
  mimeType: string,
) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "durly-"));
  const extension = path.extname(originalName) || guessExtension(mimeType);
  const audioPath = path.join(tempDir, `audio${extension}`);

  fs.writeFileSync(audioPath, audioBuffer);

  const scriptPath = path.join(env.aiModelDir, "src", "predict.py");
  const candidates: Array<{ command: string; args: string[] }> = [];

  if (env.pythonBin) {
    candidates.push({ command: env.pythonBin, args: [] });
  }

  candidates.push(
    { command: "python", args: [] },
    { command: "python3", args: [] },
    { command: "py", args: ["-3"] },
  );

  let lastError: string | undefined;

  try {
    for (const candidate of candidates) {
      const result = runPython(
        candidate.command,
        candidate.args,
        scriptPath,
        audioPath,
      );

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

      const errorCode = (result.error as NodeJS.ErrnoException | undefined)
        ?.code;

      if (errorCode === "ENOENT") {
        continue;
      }
    }

    throw new Error(lastError || "Unable to execute Python inference.");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

export function fingerprintAudio(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex");
}
