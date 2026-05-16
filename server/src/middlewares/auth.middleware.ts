// ─────────────────────────────────────────────────────────────────────────────
// src/middlewares/auth.middleware.ts  – JWT authentication + RBAC
// ─────────────────────────────────────────────────────────────────────────────

import { Response, NextFunction } from "express";
import { AuthRequest, UserRole } from "../types";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/response";

/**
 * Verifies the Bearer token and attaches the decoded payload to req.user
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "Authentication token is required", 401);
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    sendError(res, "Invalid or expired authentication token", 401);
  }
};

/**
 * Role-Based Access Control middleware factory.
 * Usage: authorise("admin")  or  authorise("admin", "sales")
 */
export const authorise = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "Not authenticated", 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required role(s): ${roles.join(", ")}`,
        403
      );
      return;
    }

    next();
  };
};
