// ─────────────────────────────────────────────────────────────────────────────
// src/utils/response.ts  – Standardised API response helpers
// ─────────────────────────────────────────────────────────────────────────────

import { Response } from "express";
import { ApiResponse, PaginationMeta } from "../types";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: PaginationMeta
): Response => {
  const response: ApiResponse<T> = { success: true, message, data, meta };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown
): Response => {
  const response: ApiResponse = { success: false, message, data: errors };
  return res.status(statusCode).json(response);
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
