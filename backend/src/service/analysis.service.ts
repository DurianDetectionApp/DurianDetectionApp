import {
  fingerprintAudio,
  inferAudioWithModel,
} from "./pythonInference.service";
import { buildDurianAnalysisResult } from "../helper/analysisProfiles";

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

  return buildDurianAnalysisResult({
    label: inference.label,
    confidence: inference.confidence,
    audioSeed: fingerprintAudio(params.buffer),
  });
}
