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
  // For production we require an external HTTP inference service.
  if (!env.aiModelHttpUrl) {
    throw new Error(
      "AI_MODEL_HTTP_URL is not configured. Backend is configured to use HTTP inference only.",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // TypeScript DOM typings expect BodyInit; cast Buffer to any to satisfy compiler
    const resp = await fetch(env.aiModelHttpUrl, {
      method: "POST",
      headers: {
        "content-type": mimeType || "application/octet-stream",
        "x-filename": originalName || "audio",
        ...(env.inferenceApiKey ? { "x-api-key": env.inferenceApiKey } : {}),
      },
      body: audioBuffer as unknown as any,
      signal: controller.signal as any,
    });
    clearTimeout(timeout);
    if (!resp.ok) {
      throw new Error(`Inference service HTTP ${resp.status}`);
    }
    const json = await resp.json();
    return json as PythonInferenceResult;
  } catch (err) {
    clearTimeout(timeout);
    // eslint-disable-next-line no-console
    console.error(
      `[python-infer] HTTP inference failed: ${(err as Error).message}`,
    );
    throw err;
  }
}

export function fingerprintAudio(buffer: Buffer): string {
  return crypto.createHash("sha1").update(buffer).digest("hex");
}
