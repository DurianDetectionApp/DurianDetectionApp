import {
  fingerprintAudio,
  inferAudioWithModel,
} from "./pythonInference.service";
import { buildDurianAnalysisResult } from "../helper/analysisProfiles";
import { env } from "../config/env";

function getProbabilityMargin(probabilities: Record<string, number>) {
  const scores = Object.values(probabilities).sort((a, b) => b - a);
  const top = scores[0] ?? 0;
  const runnerUp = scores[1] ?? 0;
  return top - runnerUp;
}

export async function analyzeAudioFile(params: {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}) {
  const inference = await inferAudioWithModel(
    params.buffer,
    params.originalName,
    params.mimeType,
  );

  const probabilityMargin = getProbabilityMargin(inference.probabilities);
  const isStrongRipePrediction =
    inference.label.trim().toLowerCase() === "ripe" &&
    inference.confidence >= env.predictionThreshold &&
    probabilityMargin >= 0.2;

  const normalizedLabel = isStrongRipePrediction ? "ripe" : "unripe";

  return buildDurianAnalysisResult({
    label: normalizedLabel,
    confidence: inference.confidence,
    audioSeed: fingerprintAudio(params.buffer),
  });
}
