// ─────────────────────────────────────────────────────────────────────────────
// src/middlewares/error.middleware.ts  – Global error handler
// ─────────────────────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    sendError(res, `A record with this ${field} already exists`, 409);
    return;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    sendError(res, "Invalid resource identifier", 400);
    return;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    sendError(res, "Invalid token", 401);
    return;
  }

  if (err.name === "TokenExpiredError") {
    sendError(res, "Token has expired", 401);
    return;
  }

  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500
      ? "An unexpected error occurred. Please try again later."
      : err.message;

  sendError(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
