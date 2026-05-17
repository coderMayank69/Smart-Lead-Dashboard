// ─────────────────────────────────────────────────────────────────────────────
// src/config/db.ts  – MongoDB connection with retry logic
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";
import { env } from "./env";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export const connectDB = async (retries = MAX_RETRIES): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`[DB] ✅ MongoDB connected to: ${mongoose.connection.host}`);
  } catch (error) {
    if (retries > 0) {
      console.warn(
        `[DB] ⚠️  Connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries} attempts left)`
      );
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }

    console.error("[DB] ❌ Failed to connect to MongoDB after max retries");
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("[DB] ⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("[DB] ❌ MongoDB error:", err);
});
