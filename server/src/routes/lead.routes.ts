// ─────────────────────────────────────────────────────────────────────────────
// src/routes/lead.routes.ts
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import { leadController } from "../controllers/lead.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticate, authorise } from "../middlewares/auth.middleware";
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
} from "../validators/lead.validator";

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// Stats — admin sees all, sales sees own
router.get("/stats", leadController.getStats);

// CRUD
router.get("/", validate(leadQuerySchema, "query"), leadController.getAll);
router.post("/", validate(createLeadSchema), leadController.create);
router.get("/:id", leadController.getById);
router.put("/:id", validate(updateLeadSchema), leadController.update);

// Delete — admin only
router.delete("/:id", authorise("admin", "sales"), leadController.delete);

export default router;
