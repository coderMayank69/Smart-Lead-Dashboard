// ─────────────────────────────────────────────────────────────────────────────
// src/validators/auth.validator.ts  – Zod v4 schemas for auth routes
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must not exceed 72 characters"),
  role: z.enum(["admin", "sales"]).optional().default("sales"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
