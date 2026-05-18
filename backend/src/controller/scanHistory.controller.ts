import type { Request, Response } from "express";
import { isDatabaseReady } from "../config/database";
import {
  createScanHistorySchema,
  listScanHistoryQuerySchema,
} from "../validator/scanHistory.validator";
import {
  createScanHistory,
  deleteScanHistoryById,
  listGlobalScanHistory,
  listUserScanHistory,
} from "../service/scanHistory.service";

function requireDatabase(res: Response) {
  if (!isDatabaseReady()) {
    res.status(503).json({
      message:
        "Database is not ready. Configure MONGODB_URI and restart backend.",
    });
    return false;
  }
  return true;
}

export async function createScanHistoryController(req: Request, res: Response) {
  if (!requireDatabase(res)) return;

  const parsed = createScanHistorySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid scan history payload",
      errors: parsed.error.flatten(),
    });
    return;
  }

  const created = await createScanHistory(parsed.data);
  res.status(201).json(created);
}

export async function listUserScanHistoryController(
  req: Request,
  res: Response,
) {
  if (!requireDatabase(res)) return;

  const parsed = listScanHistoryQuerySchema.safeParse(req.query);
  if (!parsed.success || !parsed.data.username) {
    res.status(400).json({
      message: "Query param username is required",
    });
    return;
  }

  const scans = await listUserScanHistory(
    parsed.data.username,
    parsed.data.limit ?? 50,
  );
  res.json(scans);
}

export async function listGlobalScanHistoryController(
  req: Request,
  res: Response,
) {
  if (!requireDatabase(res)) return;

  const parsed = listScanHistoryQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid query params",
    });
    return;
  }

  const scans = await listGlobalScanHistory(parsed.data.limit ?? 10);
  res.json(scans);
}

export async function deleteScanHistoryController(req: Request, res: Response) {
  if (!requireDatabase(res)) return;

  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const username =
    typeof req.query.username === "string" ? req.query.username : undefined;

  const deleted = await deleteScanHistoryById(id, username);
  if (!deleted) {
    res.status(404).json({ message: "Scan not found" });
    return;
  }

  res.status(204).send();
}
