// ─────────────────────────────────────────────────────────────────────────────
// src/config/db.ts  – MongoDB connection with retry logic
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export const connectDB = async (retries = MAX_RETRIES): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("[DB] MONGODB_URI environment variable is not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
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
