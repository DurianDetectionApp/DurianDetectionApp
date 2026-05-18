"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    if (err instanceof Error) {
        res.status(500).json({
            message: err.message,
        });
        return;
    }
    res.status(500).json({
        message: "Unexpected server error",
    });
}
