/// <reference types="node" />

const dotenv = require("dotenv");
const path = require("path") as typeof import("path");

dotenv.config();

const backendRoot = path.resolve(__dirname, "..", "..");
const workspaceRoot = path.resolve(backendRoot, "..");

export const env = {
  port: Number(process.env.PORT ?? 8080),
  host: process.env.HOST ?? "0.0.0.0",
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  // Support either MONGODB_URI (preferred) or MONGODB_URL (common alternative)
  mongoUri: process.env.MONGODB_URI ?? process.env.MONGODB_URL ?? "",
  pythonBin: process.env.PYTHON_BIN?.trim() || undefined,
  aiModelDir: process.env.AI_MODEL_DIR
    ? path.resolve(process.env.AI_MODEL_DIR)
    : path.join(workspaceRoot, "DURIAN_RIPENESS_CLASSIFICATION"),
  // Optional HTTP URL for an external inference service (e.g. FastAPI). If set,
  // backend will POST audio bytes to this URL instead of spawning Python.
  aiModelHttpUrl: process.env.AI_MODEL_HTTP_URL ?? undefined,
  dataDir: path.join(backendRoot, "data"),
  predictionThreshold: Number(process.env.PREDICTION_THRESHOLD ?? 0.55),
};
