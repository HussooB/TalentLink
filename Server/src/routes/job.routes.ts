import { Router } from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob } from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { employerOnly } from "../middlewares/roles.js";

const router = Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected routes (Employer only)
router.post("/", authMiddleware, employerOnly, createJob);
router.put("/:id", authMiddleware, employerOnly, updateJob);
router.delete("/:id", authMiddleware, employerOnly, deleteJob);

export default router;
