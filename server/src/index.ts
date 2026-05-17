// ─────────────────────────────────────────────────────────────────────────────
// src/index.ts  – Application entry point
// ─────────────────────────────────────────────────────────────────────────────

import "dotenv/config";
import express from "express";
import cors from "cors";
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

// Support comma-separated CLIENT_URL list, e.g. "https://app.vercel.app,http://localhost:5173"
const allowedOrigins = env.CLIENT_URL
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server (no origin), whitelisted origins, and Render/Vercel previews
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.onrender\.com$/.test(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Handle OPTIONS preflight explicitly so it always gets 204 before other middleware
// Preflight is handled by the cors() middleware above for all routes

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
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.isProduction ? "combined" : "dev"));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Smart Lead Dashboard API is running",
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
