import type { Request, Response } from "express";
import { analyzeAudioFile } from "../service/analysis.service";

interface UploadedAudioFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export async function predictController(req: Request, res: Response) {
  const file = (req as Request & { file?: UploadedAudioFile }).file;

  if (!file) {
    res.status(400).json({
      message:
        'Missing audio file. Send multipart/form-data with field name "audio".',
    });
    return;
  }

  const result = await analyzeAudioFile({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
  });

  res.json({
    ...result,
    model: {
      provider: "python-random-forest",
      source: "DURIAN_RIPENESS_CLASSIFICATION/models/random_forest.pkl",
    },
  });
}
