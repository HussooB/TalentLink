// routes/company.routes.ts
import { Router } from "express";
import { approveCompany } from "../controllers/company.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/roles.js";

const router = Router();

// 🏢 Approve company (Admin OR Super Admin only)
router.put("/:id/approve", authMiddleware, adminOnly, approveCompany);

export default router;
