import { AIResult } from "../store/recordStore";
import { RipenessType } from "../theme/colors";
import { Platform } from "react-native";

const defaultApiBaseUrl = Platform.select({
  android: "http://10.0.2.2:3000",
  ios: "http://localhost:3000",
  web: "http://localhost:3000",
  default: "http://localhost:3000",
});

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  defaultApiBaseUrl ??
  "https://api.durly.app"
).replace(/\/$/, "");

// Mock database of durian varieties for demo
const DURIAN_VARIETIES = [
  "Musang King",
  "D24 Sultan",
  "Black Thorn",
  "Golden Phoenix",
  "Red Prawn",
];
const TEXTURES: Record<RipenessType, string[]> = {
  ripe: ["Buttery Smooth", "Creamy Rich", "Silky Dense"],
  unripe: [
    "Firm & Dry",
    "Slightly Bitter",
    "Dense & Compact",
    "Overly Sweet",
    "Soft & Mushy",
    "Strong Odor",
  ],
  undetected: ["Unknown", "Inconclusive"],
};
const DESCRIPTIONS: Record<RipenessType, string[]> = {
  ripe: [
    "Your durian has reached peak creaminess. Time to feast! 🎉",
    "Perfect ripeness detected — rich, complex flavor awaits!",
    "Optimal eating window. The flesh is at its creamiest!",
  ],
  unripe: [
    "This durian needs a few more days. Patience pays off! ⏳",
    "Not quite there yet — let it rest in a cool, dry place.",
    "Give it 2–3 more days for best flavor development.",
    "The window has passed slightly. Consume today if possible.",
    "It is still firm and needs more time before eating.",
  ],
  undetected: [
    "Could not determine ripeness. Try recording again closer to the stem. 🤔",
    "Unclear result — ensure you tap the widest part of the durian.",
  ],
};

/**
 * Mock AI analysis — simulates a real API call with realistic delay.
 * Replace `mockAnalyze` with `analyzeAudio` for production.
 */
export async function mockAnalyzeAudio(_audioUri: string): Promise<AIResult> {
  // Simulate network latency (500ms - 2s)
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

  const ripenessOptions: RipenessType[] = [
    "ripe",
    "ripe",
    "ripe",
    "unripe",
    "unripe",
  ];
  const ripeness =
    ripenessOptions[Math.floor(Math.random() * ripenessOptions.length)];
  const confidence =
    ripeness === "ripe"
      ? 0.85 + Math.random() * 0.15
      : 0.65 + Math.random() * 0.25;
  const variety =
    DURIAN_VARIETIES[Math.floor(Math.random() * DURIAN_VARIETIES.length)];
  const textureList = TEXTURES[ripeness];
  const texture = textureList[Math.floor(Math.random() * textureList.length)];
  const descList = DESCRIPTIONS[ripeness];
  const description = descList[Math.floor(Math.random() * descList.length)];

  return {
    ripeness,
    confidence: Math.round(confidence * 100) / 100,
    variety,
    texture,
    description,
    timestamp: new Date().toISOString(),
    audioUri: _audioUri,
  };
}

/**
 * Production: POST audio to cloud inference endpoint.
 */
export async function analyzeAudio(audioUri: string): Promise<AIResult> {
  const formData = new FormData();
  formData.append("audio", {
    uri: audioUri,
    type: "audio/m4a",
    name: "durian_tap.m4a",
  } as any);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    clearTimeout(timeout);
    // Avoid fabricating predictions in production. Use mock only during local development.
    if (__DEV__) {
      console.warn("[aiService] API unavailable, using mock fallback");
      return mockAnalyzeAudio(audioUri);
    }

    throw new Error("Analysis service unavailable. Please try again.");
  }
}
