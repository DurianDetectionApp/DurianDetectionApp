import type { Request, Response } from "express";

export function metaController(_req: Request, res: Response) {
  res.json({
    name: "Durly API",
    endpoints: [
      "/health",
      "/predict",
      "/api/v1/health",
      "/api/v1/predict",
      "/api/v1/meta",
    ],
    supportedRipeness: ["ripe", "unripe", "undetected"],
  });
}
