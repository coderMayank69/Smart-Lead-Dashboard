// ─────────────────────────────────────────────────────────────────────────────
// src/middlewares/validate.middleware.ts  – Zod v4 request validation
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { sendError } from "../utils/response";

type RequestSection = "body" | "query" | "params";

export const validate =
  (schema: ZodObject<ZodRawShape>, section: RequestSection = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[section]);

    if (!result.success) {
      const formatted = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      sendError(res, "Validation failed", 422, formatted);
      return;
    }

    req[section] = result.data;
    next();
  };
