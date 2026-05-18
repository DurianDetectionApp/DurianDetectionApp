"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
exports.isDatabaseReady = isDatabaseReady;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
async function connectDatabase() {
    if (!env_1.env.mongoUri) {
        console.warn("[db] MONGODB_URI is not set. Scan history APIs will return errors until DB is configured.");
        return;
    }
    await mongoose_1.default.connect(env_1.env.mongoUri);
    console.log("[db] MongoDB connected");
}
function isDatabaseReady() {
    return mongoose_1.default.connection.readyState === 1;
}
