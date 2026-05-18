"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = healthController;
function healthController(_req, res) {
    res.json({
        status: "ok",
        service: "durly-api",
        uptime: process.uptime(),
    });
}
