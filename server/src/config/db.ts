// ─────────────────────────────────────────────────────────────────────────────
// src/config/db.ts  – MongoDB connection with persistent auto-reconnect
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from "mongoose";
import { env } from "./env";

const INITIAL_RETRY_DELAY_MS = 3_000;
const MAX_RETRY_DELAY_MS = 30_000;
const MAX_STARTUP_RETRIES = 5;

/** Shared connection options tuned for MongoDB Atlas. */
const MONGO_OPTIONS: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 10_000, // wait up to 10 s to find a server
  socketTimeoutMS: 45_000,          // kill idle sockets after 45 s
  maxPoolSize: 10,                  // keep up to 10 connections open
  minPoolSize: 2,                   // always maintain at least 2 connections
  heartbeatFrequencyMS: 10_000,     // ping the cluster every 10 s
  retryWrites: true,
};

// ── Startup connection (with bounded retry) ───────────────────────────────────

export const connectDB = async (retries = MAX_STARTUP_RETRIES): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, MONGO_OPTIONS);
    console.log(`[DB] ✅ MongoDB connected to: ${mongoose.connection.host}`);
  } catch (error) {
    if (retries > 0) {
      const delay = INITIAL_RETRY_DELAY_MS;
      console.warn(
        `[DB] ⚠️  Connection failed. Retrying in ${delay / 1000}s... (${retries} attempts left)`
      );
      await new Promise((res) => setTimeout(res, delay));
      return connectDB(retries - 1);
    }

    console.error("[DB] ❌ Failed to connect to MongoDB after max retries");
    process.exit(1);
  }
};

// ── Persistent auto-reconnect (handles mid-session drops) ────────────────────

let reconnectAttempt = 0;

async function attemptReconnect(): Promise<void> {
  reconnectAttempt += 1;
  const delay = Math.min(
    INITIAL_RETRY_DELAY_MS * 2 ** (reconnectAttempt - 1),
    MAX_RETRY_DELAY_MS
  );

  console.warn(
    `[DB] 🔄 Attempting reconnect #${reconnectAttempt} in ${delay / 1000}s...`
  );

  await new Promise((res) => setTimeout(res, delay));

  try {
    await mongoose.connect(env.MONGODB_URI, MONGO_OPTIONS);
    reconnectAttempt = 0; // reset counter on success
    console.log("[DB] ✅ MongoDB reconnected successfully");
  } catch (err) {
    console.error("[DB] ❌ Reconnect attempt failed:", (err as Error).message);
    // Keep retrying indefinitely for mid-session drops
    attemptReconnect();
  }
}

// ── Connection event listeners ────────────────────────────────────────────────

mongoose.connection.on("disconnected", () => {
  console.warn("[DB] ⚠️  MongoDB disconnected – initiating reconnect...");
  // Only start reconnecting if not already in a connecting state
  if (mongoose.connection.readyState === 0 /* disconnected */) {
    attemptReconnect();
  }
});

mongoose.connection.on("reconnected", () => {
  reconnectAttempt = 0;
  console.log("[DB] ✅ MongoDB reconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("[DB] ❌ MongoDB error:", err.message);
});
