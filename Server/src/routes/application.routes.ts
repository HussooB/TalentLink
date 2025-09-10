import { Router } from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForMyJobs,
  updateApplicationStatus
} from "../controllers/application.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { employerOnly } from "../middlewares/roles.js";
import { validate } from "../middlewares/validate.js";
import { applyToJobSchema,updateApplicationStatusSchema } from "../utils/schemas/application.schema.js";
const router = Router();

// 📝 Job seeker applies + views own apps
router.post("/", authMiddleware, validate(applyToJobSchema),applyToJob);
router.get("/me", authMiddleware, getMyApplications);

// 👔 Employer views & manages apps
router.get("/employer", authMiddleware, employerOnly, getApplicationsForMyJobs);
router.put("/:id/status", authMiddleware, employerOnly, validate(updateApplicationStatusSchema),updateApplicationStatus);

export default router;
