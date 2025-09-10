import { Router } from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob } from "../controllers/job.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
import { employerOnly } from "../middlewares/roles.js";
import { validate } from "../middlewares/validate.js";
import { createJobSchema,updateJobSchema } from "../utils/schemas/job.schema.js";

const router = Router();

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected routes (Employer only)
router.post("/", authMiddleware, employerOnly, validate(createJobSchema),createJob);
router.put("/:id", authMiddleware, employerOnly, validate(updateJobSchema),updateJob);
router.delete("/:id", authMiddleware, employerOnly, deleteJob);

export default router;
