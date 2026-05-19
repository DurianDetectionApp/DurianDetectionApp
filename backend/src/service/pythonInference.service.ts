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

  // Prefer system python3 paths commonly available in Linux containers
  candidates.push(
    { command: "/usr/bin/python3", args: [] },
    { command: "/usr/bin/python", args: [] },
    { command: "python3", args: [] },
    { command: "python", args: [] },
  );

  let lastError: string | undefined;
  const attempts: string[] = [];

  try {
    for (const candidate of candidates) {
      // Log which candidate we are about to try (helps debugging in production)
      try {
        // eslint-disable-next-line no-console
        console.log(
          `[python-infer] trying command: ${candidate.command} ${candidate.args.join(" ")}`,
        );
      } catch (err) {
        // ignore
      }
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
      const errMsg =
        stderr ||
        stdout ||
        result.error?.message ||
        `Python exited with code ${result.status ?? "unknown"}`;

      // record attempt detail
      attempts.push(
        `${candidate.command} -> status=${result.status ?? "?"} error=${(result.error as NodeJS.ErrnoException | undefined)?.message ?? "none"} stdout=${JSON.stringify(
          stdout,
        )} stderr=${JSON.stringify(stderr)}`,
      );

      lastError = errMsg;

      const errorCode = (result.error as NodeJS.ErrnoException | undefined)
        ?.code;

      if (errorCode === "ENOENT") {
        continue;
      }
    }

    const details = attempts.join("\n");
    throw new Error(
      (lastError ? lastError + " - " : "") +
        "Unable to execute Python inference. Attempts:\n" +
        details,
    );
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

export function fingerprintAudio(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex");
}
