// ─────────────────────────────────────────────────────────────────────────────
// src/controllers/lead.controller.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { leadService } from "../services/lead.service";
import { sendSuccess } from "../utils/response";
import {
  CreateLeadInput,
  UpdateLeadInput,
  LeadQueryInput,
} from "../validators/lead.validator";

export const leadController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = req.body as CreateLeadInput;
      const lead = await leadService.create(input, req.user!.userId);
      sendSuccess(res, { lead }, "Lead created successfully", 201);
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as LeadQueryInput;
      const { leads, meta } = await leadService.getAll(
        query,
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, { leads }, "Leads fetched successfully", 200, meta);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"] as string;
      const lead = await leadService.getById(
        id,
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, { lead }, "Lead fetched successfully");
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"] as string;
      const input = req.body as UpdateLeadInput;
      const lead = await leadService.update(
        id,
        input,
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, { lead }, "Lead updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params["id"] as string;
      await leadService.delete(
        id,
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, null, "Lead deleted successfully");
    } catch (err) {
      next(err);
    }
  },

  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await leadService.getStats(
        req.user!.userId,
        req.user!.role
      );
      sendSuccess(res, { stats }, "Stats fetched successfully");
    } catch (err) {
      next(err);
    }
  },
};
