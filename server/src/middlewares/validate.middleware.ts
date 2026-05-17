// src/middlewares/validate.middleware.ts  – Zod v4 request validation
// NOTE: Express 5 makes req.query a read-only getter, so we attach parsed
//       data to req.validatedQuery / req.validatedBody / req.validatedParams
//       instead of overwriting req[section] directly.

import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { sendError } from "../utils/response";

type RequestSection = "body" | "query" | "params";

// Extend Request to carry validated data without overwriting read-only getters
declare global {
  namespace Express {
    interface Request {
      validatedBody?: Record<string, unknown>;
      validatedQuery?: Record<string, unknown>;
      validatedParams?: Record<string, unknown>;
    }
  }
}

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

    // Express 5: req.query is read-only — store on custom property
    if (section === "query") {
      req.validatedQuery = result.data as Record<string, unknown>;
    } else if (section === "params") {
      req.validatedParams = result.data as Record<string, unknown>;
    } else {
      req.validatedBody = result.data as Record<string, unknown>;
      // body is still writable in Express 5
      req.body = result.data;
    }

    next();
  };
