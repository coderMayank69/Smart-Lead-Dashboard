// ─────────────────────────────────────────────────────────────────────────────
// src/index.ts  – Application entry point
// ─────────────────────────────────────────────────────────────────────────────

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security middlewares ──────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many login attempts. Please try again later." },
});

app.use(limiter);

// ── Request parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Smart Lead Dashboard API is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/leads", leadRoutes);

// ── Error handlers (must be last) ────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[SERVER] 🚀 Running on http://localhost:${PORT}`);
    console.log(`[SERVER] 📍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

start();

export default app;
