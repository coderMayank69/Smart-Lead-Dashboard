// ─────────────────────────────────────────────────────────────────────────────
// src/validators/lead.validator.ts  – Zod v4 schemas for lead routes
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost"] as const;
const LEAD_SOURCES = ["Website", "Instagram", "Referral"] as const;

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase(),
  status: z.enum(LEAD_STATUSES).optional().default("New"),
  source: z.enum(LEAD_SOURCES, { error: "Source is required" }),
  notes: z
    .string()
    .max(500, "Notes must not exceed 500 characters")
    .optional(),
  assignedTo: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["latest", "oldest"]).optional().default("latest"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;

// ObjectId param validation — used in GET/PUT/DELETE /:id routes
export const objectIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid resource ID format"),
});

