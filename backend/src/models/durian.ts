export type RipenessType = "ripe" | "unripe" | "undetected";

export interface DurianAnalysisResult {
  ripeness: RipenessType;
  confidence: number;
  variety: string;
  texture: string;
  description: string;
  timestamp: string;
  audioUri?: string;
}

export interface PythonInferenceResult {
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
}
