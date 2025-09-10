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
import { validate } from "../middlewares/validate.js";
import { signupSchema, loginSchema } from "../utils/schemas/auth.schema.js";

const router = Router();

// Auth routes
router.post("/signup", validate(signupSchema),signup);
router.post("/login", validate(loginSchema),login);
router.get("/verify-email", verifyEmail);
router.put("/change-password", authMiddleware, changePassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
