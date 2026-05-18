import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn(
      "[db] MONGODB_URI is not set. Scan history APIs will return errors until DB is configured.",
    );
    return;
  }

  await mongoose.connect(env.mongoUri);
  console.log("[db] MongoDB connected");
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
