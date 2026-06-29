import { AIResult } from "../store/recordStore";
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

/**
 * Production: POST audio to cloud inference endpoint.
 * No mock data/fallback used. Performs real API requests only.
 */
export async function analyzeAudio(audioUri: string): Promise<AIResult> {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // On web, we must fetch the blob URL and append the blob directly
    const response = await fetch(audioUri);
    const blob = await response.blob();
    formData.append("audio", blob, "durian_tap.m4a");
  } else {
    // On mobile, React Native fetch handles the file object uri shape
    formData.append("audio", {
      uri: audioUri,
      type: "audio/m4a",
      name: "durian_tap.m4a",
    } as any);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout for cold starts

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err: any) {
    clearTimeout(timeout);
    // eslint-disable-next-line no-console
    console.error("[aiService] Inference request failed:", err);
    throw new Error(
      err.message || "Analysis service unavailable. Please try again.",
    );
  }
}
