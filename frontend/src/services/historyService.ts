import { Platform } from "react-native";
import type { AIResult } from "../store/recordStore";

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

export interface ServerScanRecord extends AIResult {
  id: string;
  username: string;
  userId?: string;
  timestamp: string;
}

export async function createScanOnServer(payload: {
  username: string;
  userId?: string;
  result: AIResult;
}): Promise<ServerScanRecord> {
  const response = await fetch(`${API_BASE_URL}/api/v1/scans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: payload.username,
      userId: payload.userId,
      ...payload.result,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to save scan: HTTP ${response.status}`);
  }

  return response.json();
}

export async function fetchUserScansFromServer(
  username: string,
): Promise<ServerScanRecord[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/scans?username=${encodeURIComponent(username)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch scans: HTTP ${response.status}`);
  }

  return response.json();
}

export async function fetchGlobalScansFromServer(
  limit = 10,
): Promise<ServerScanRecord[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/scans/global?limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch global scans: HTTP ${response.status}`);
  }

  return response.json();
}

export async function deleteScanFromServer(
  id: string,
  username?: string,
): Promise<void> {
  const url = username
    ? `${API_BASE_URL}/api/v1/scans/${encodeURIComponent(id)}?username=${encodeURIComponent(username)}`
    : `${API_BASE_URL}/api/v1/scans/${encodeURIComponent(id)}`;

  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete scan: HTTP ${response.status}`);
  }
}
