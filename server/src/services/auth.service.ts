// ─────────────────────────────────────────────────────────────────────────────
// src/services/auth.service.ts  – Auth business logic (separated from controller)
// ─────────────────────────────────────────────────────────────────────────────

import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

export const authService = {
  async register(data: RegisterInput) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      const error = new Error("An account with this email already exists");
      (error as Error & { statusCode: number }).statusCode = 409;
      throw error;
    }

    const user = await User.create(data);
    const token = signToken({ userId: user.id, role: user.role });

    return { user, token };
  },

  async login(data: LoginInput) {
    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email: data.email }).select("+password");

    if (!user) {
      const error = new Error("Invalid email or password");
      (error as Error & { statusCode: number }).statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      (error as Error & { statusCode: number }).statusCode = 401;
      throw error;
    }

    const token = signToken({ userId: user.id, role: user.role });

    // Remove password from response
    const userObj = user.toJSON();

    return { user: userObj, token };
  },

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      (error as Error & { statusCode: number }).statusCode = 404;
      throw error;
    }
    return user;
  },
};
