// ─────────────────────────────────────────────────────────────────────────────
// src/index.ts  – Application entry point
// ─────────────────────────────────────────────────────────────────────────────

import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env";
import { connectDB } from "./config/db";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import aiRoutes from "./routes/ai.routes";

const app = express();

// ── Security middlewares ──────────────────────────────────────────────────────
app.use(helmet());

// ── Manual CORS (avoids cors@2.8.x wildcard bug with Express 5) ──────────────
const allowedOrigins = env.CLIENT_URL
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin ?? "";
  const allowed =
    !origin ||
    allowedOrigins.includes(origin) ||
    /\.onrender\.com$/.test(origin) ||
    /\.vercel\.app$/.test(origin);

  if (allowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  // Preflight
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.isProduction ? "combined" : "dev"));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "GigFlow – Smart Leads Dashboard API is running",
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/leads", leadRoutes);
app.use("/api/v1/ai", aiRoutes);

// ── Error handlers (must be last) ────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`[SERVER] 🚀 Running on http://localhost:${env.PORT}`);
    console.log(`[SERVER] 📍 Environment: ${env.NODE_ENV}`);
  });
};

start();

export default app;
