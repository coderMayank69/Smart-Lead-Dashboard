// ─────────────────────────────────────────────────────────────────────────────
// src/types/index.ts  – Shared TypeScript interfaces for the entire server
// ─────────────────────────────────────────────────────────────────────────────

import { Request } from "express";
import { Types } from "mongoose";

// ── Auth ──────────────────────────────────────────────────────────────────────
export type UserRole = "admin" | "sales";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ── Leads ─────────────────────────────────────────────────────────────────────
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface ILead {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

// ── Query Filters ─────────────────────────────────────────────────────────────
export interface LeadQueryFilters {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sortBy?: "latest" | "oldest";
  page?: number;
  limit?: number;
}
