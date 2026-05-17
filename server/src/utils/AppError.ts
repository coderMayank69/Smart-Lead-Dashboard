// ─────────────────────────────────────────────────────────────────────────────
// src/utils/AppError.ts  – Custom error class with HTTP status codes
// Eliminates repetitive inline error creation throughout services.
// ─────────────────────────────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Preserve proper stack traces in V8
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string)   { return new AppError(message, 400); }
  static unauthorized(message: string) { return new AppError(message, 401); }
  static forbidden(message: string)    { return new AppError(message, 403); }
  static notFound(message: string)     { return new AppError(message, 404); }
  static conflict(message: string)     { return new AppError(message, 409); }
}
