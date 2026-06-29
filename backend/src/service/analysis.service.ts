import {
  fingerprintAudio,
  inferAudioWithModel,
} from "./pythonInference.service";
import { uploadAudioToS3 } from "./s3.service";
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
  const [inference, s3Url] = await Promise.all([
    inferAudioWithModel(
      params.buffer,
      params.originalName,
      params.mimeType,
    ),
    uploadAudioToS3(
      params.buffer,
      params.originalName,
      params.mimeType,
    ).catch((err) => {
      // eslint-disable-next-line no-console
      console.error("[analysis-service] S3 upload promise rejected:", err);
      return undefined;
    }),
  ]);

  const probabilityMargin = getProbabilityMargin(inference.probabilities);
  const isStrongRipePrediction =
    inference.label.trim().toLowerCase() === "ripe" &&
    inference.confidence >= env.predictionThreshold &&
    probabilityMargin >= 0.2;

  const normalizedLabel = isStrongRipePrediction ? "ripe" : "unripe";

  const result = buildDurianAnalysisResult({
    label: normalizedLabel,
    confidence: inference.confidence,
    audioSeed: fingerprintAudio(params.buffer),
  });

  if (s3Url) {
    result.audioUri = s3Url;
  }

  return result;
}
