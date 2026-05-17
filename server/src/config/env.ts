// ─────────────────────────────────────────────────────────────────────────────
// src/config/env.ts  – Single source of truth for all environment variables
// Validates at startup so missing vars cause an immediate, clear failure.
// ─────────────────────────────────────────────────────────────────────────────

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`[CONFIG] ❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

export const env = {
  PORT:         parseInt(process.env.PORT || '5000', 10),
  NODE_ENV:     process.env.NODE_ENV || 'development',
  MONGODB_URI:  required('MONGODB_URI'),
  JWT_SECRET:   required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL:   process.env.CLIENT_URL || 'http://localhost:5173',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',

  get isProduction() { return this.NODE_ENV === 'production'; },
  get isDevelopment() { return this.NODE_ENV === 'development'; },
} as const;
