// ─────────────────────────────────────────────────────────────────────────────
// src/controllers/auth.controller.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { authService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

export const authController = {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = req.body as RegisterInput;
      const { user, token } = await authService.register(input);
      sendSuccess(res, { user, token }, "Account created successfully", 201);
    } catch (err) {
      next(err);
    }
  },

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = req.body as LoginInput;
      const { user, token } = await authService.login(input);
      sendSuccess(res, { user, token }, "Login successful");
    } catch (err) {
      next(err);
    }
  },

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.userId);
      sendSuccess(res, { user }, "Profile fetched successfully");
    } catch (err) {
      next(err);
    }
  },
};
