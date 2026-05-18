export type RipenessType = "ripe" | "under_ripe" | "over_ripe" | "undetected";

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
