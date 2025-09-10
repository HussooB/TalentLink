import { Router } from "express";
import {
  upsertJobSeeker,
  getMyProfile,
  getAllJobSeekers,
  deleteMyProfile,
} from "../controllers/jobSeeker.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Job seeker manages their own profile
router.post("/me", authMiddleware, upsertJobSeeker);
router.get("/me", authMiddleware, getMyProfile);
router.delete("/me", authMiddleware, deleteMyProfile);

// Admin use case (later we’ll wrap in isAdmin middleware)
router.get("/", authMiddleware, getAllJobSeekers);

export default router;
