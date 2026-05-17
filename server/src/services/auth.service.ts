// ─────────────────────────────────────────────────────────────────────────────
// src/services/auth.service.ts  – Auth business logic (separated from controller)
// ─────────────────────────────────────────────────────────────────────────────

import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

export const authService = {
  async register(data: RegisterInput) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw AppError.conflict("An account with this email already exists");
    }

    const user = await User.create(data);
    const token = signToken({ userId: user.id, role: user.role });

    return { user, token };
  },

  async login(data: LoginInput) {
    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user) {
      throw AppError.unauthorized("Invalid email or password");
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw AppError.unauthorized("Invalid email or password");
    }

    const token = signToken({ userId: user.id, role: user.role });

    // Remove password from response
    const userObj = user.toJSON();

    return { user: userObj, token };
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound("User not found");
    }
    return user;
  },
};
