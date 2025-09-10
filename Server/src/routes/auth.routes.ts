// routes/auth.routes.ts
import { Router } from "express";
import {
  signup,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.put("/change-password", authMiddleware, changePassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
