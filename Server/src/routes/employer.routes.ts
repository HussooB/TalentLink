import { Router } from "express";
import {
  getMyEmployerProfile,
  upsertEmployerProfile,
  getAllEmployers,
  deleteMyEmployerProfile
} from "../controllers/employer.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/roles.js"; // admin or super admin

const router = Router();

// 🏢 Employer CRUD routes
router.get("/me", authMiddleware, getMyEmployerProfile);
router.put("/me", authMiddleware, upsertEmployerProfile);
router.delete("/me", authMiddleware, deleteMyEmployerProfile);

// 👑 Admin: get all employers
router.get("/", authMiddleware, adminOnly, getAllEmployers);

export default router;
