import { app } from "./src/app";
import { connectDatabase } from "./src/config/database";
const PORT = Number(process.env.PORT || 8080);

async function bootstrap() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("[db] MongoDB connection failed", error);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap();
