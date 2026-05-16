// ─────────────────────────────────────────────────────────────────────────────
// src/routes/auth.routes.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", authenticate, authController.getProfile);

export default router;
