"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const database_1 = require("./src/config/database");
const PORT = Number(process.env.PORT || 8080);
async function bootstrap() {
    try {
        await (0, database_1.connectDatabase)();
    }
    catch (error) {
        console.error("[db] MongoDB connection failed", error);
    }
    app_1.app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
bootstrap();
