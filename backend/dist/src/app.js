"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const router_1 = require("./router");
const notFoundHandler_1 = require("./middleware/notFoundHandler");
const errorHandler_1 = require("./middleware/errorHandler");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({ origin: env_1.env.corsOrigin === "*" ? true : env_1.env.corsOrigin }));
exports.app.use(express_1.default.json({ limit: "2mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, morgan_1.default)("dev"));
exports.app.get("/", (_req, res) => {
    res.json({
        name: "Durly API",
        status: "ok",
        version: "1.0.0",
    });
});
exports.app.use(router_1.router);
exports.app.use(notFoundHandler_1.notFoundHandler);
exports.app.use(errorHandler_1.errorHandler);
