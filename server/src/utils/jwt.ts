// ─────────────────────────────────────────────────────────────────────────────
// src/utils/jwt.ts  – JWT signing and verification helpers
// ─────────────────────────────────────────────────────────────────────────────

import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";
import { env } from "../config/env";

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
