import { Router } from "express";
import { healthController } from "../controller/health.controller";
import { metaController } from "../controller/meta.controller";
import { predictController } from "../controller/predict.controller";
import {
  createScanHistoryController,
  deleteScanHistoryController,
  listGlobalScanHistoryController,
  listUserScanHistoryController,
} from "../controller/scanHistory.controller";
import { uploadAudio } from "../middleware/upload";

export const router = Router();

router.get("/health", healthController);
router.get("/api/v1/health", healthController);
router.get("/api/v1/meta", metaController);

router.post("/predict", uploadAudio.single("audio"), predictController);
router.post("/api/v1/predict", uploadAudio.single("audio"), predictController);

router.post("/api/v1/scans", createScanHistoryController);
router.get("/api/v1/scans", listUserScanHistoryController);
router.get("/api/v1/scans/global", listGlobalScanHistoryController);
router.delete("/api/v1/scans/:id", deleteScanHistoryController);
