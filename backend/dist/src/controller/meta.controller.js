"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaController = metaController;
function metaController(_req, res) {
    res.json({
        name: "Durly API",
        endpoints: [
            "/health",
            "/predict",
            "/api/v1/health",
            "/api/v1/predict",
            "/api/v1/meta",
        ],
        supportedRipeness: ["ripe", "under_ripe", "over_ripe", "undetected"],
    });
}
