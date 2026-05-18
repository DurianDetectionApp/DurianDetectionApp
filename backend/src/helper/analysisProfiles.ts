import crypto from "crypto";
import type { DurianAnalysisResult, RipenessType } from "../models/durian";

const DURIAN_VARIETIES = [
  "Musang King",
  "D24 Sultan",
  "Black Thorn",
  "Golden Phoenix",
  "Red Prawn",
];

const TEXTURES: Record<RipenessType, string[]> = {
  ripe: ["Buttery Smooth", "Creamy Rich", "Silky Dense"],
  under_ripe: ["Firm & Dry", "Slightly Bitter", "Dense & Compact"],
  over_ripe: ["Overly Sweet", "Soft & Mushy", "Strong Odor"],
  undetected: ["Unknown", "Inconclusive"],
};

const DESCRIPTIONS: Record<RipenessType, string[]> = {
  ripe: [
    "Your durian has reached peak creaminess. Time to feast!",
    "Perfect ripeness detected — rich, complex flavor awaits!",
    "Optimal eating window. The flesh is at its creamiest!",
  ],
  under_ripe: [
    "This durian needs a few more days. Patience pays off!",
    "Not quite there yet — let it rest in a cool, dry place.",
    "Give it 2–3 more days for best flavor development.",
  ],
  over_ripe: [
    "Better eat it now before it ferments further!",
    "Over-ripe but still edible — great for cooking!",
    "The window has passed slightly. Consume today if possible.",
  ],
  undetected: [
    "Could not determine ripeness. Try recording again closer to the stem.",
    "Unclear result — ensure you tap the widest part of the durian.",
  ],
};

function pickStable<T>(seed: string, values: T[]): T {
  const hash = crypto.createHash("sha1").update(seed).digest();
  const index = hash.readUInt32BE(0) % values.length;
  return values[index];
}

export function normalizeRipeness(
  label: string,
  confidence: number,
): RipenessType {
  if (confidence < 0.55) {
    return "undetected";
  }

  const normalized = label.trim().toLowerCase();

  if (normalized === "ripe") return "ripe";
  if (normalized === "unripe" || normalized === "under_ripe")
    return "under_ripe";
  if (normalized === "overripe" || normalized === "over_ripe")
    return "over_ripe";

  return "undetected";
}

export function buildDurianAnalysisResult(params: {
  label: string;
  confidence: number;
  audioSeed: string;
}): DurianAnalysisResult {
  const ripeness = normalizeRipeness(params.label, params.confidence);
  const seed = `${params.audioSeed}:${ripeness}:${params.confidence.toFixed(4)}`;

  const variety =
    ripeness === "undetected" ? "Unknown" : pickStable(seed, DURIAN_VARIETIES);
  const texture = pickStable(seed, TEXTURES[ripeness]);
  const description = pickStable(seed, DESCRIPTIONS[ripeness]);

  return {
    ripeness,
    confidence: Math.max(0, Math.min(1, Number(params.confidence.toFixed(2)))),
    variety,
    texture,
    description,
    timestamp: new Date().toISOString(),
  };
}
