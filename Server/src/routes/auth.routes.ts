// routes/auth.routes.ts
import { Router } from "express";
import { signup, login, verifyEmail, requestPasswordReset, resetPassword } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
