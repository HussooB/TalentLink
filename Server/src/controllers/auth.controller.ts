// controllers/auth.controller.ts
import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { sendEmail } from "../utils/email.js";

// Signup with email verification
export const signup = async (req: Request, res: Response) => {
  const { email, password, userTypeId } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user WITHOUT saving verification token
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userTypeId,
        isVerified: false,
      },
    });

    // Generate email verification token (JWT) with 1 day expiry
    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Construct verification link
    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    // Construct email HTML
    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.5; color:#333; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
        <h2 style="color:#4CAF50;">Welcome to TalentLink 🎉</h2>
        <p>Hi ${user.email},</p>
        <p>Thank you for signing up! Click the button below to verify your email:</p>
        <p style="margin:20px 0;">
          <a href="${verificationLink}" style="background:#4CAF50; color:white; padding:12px 18px; text-decoration:none; border-radius:6px;">
            Verify Email
          </a>
        </p>
        <p>Best regards,<br/>The TalentLink Team</p>
        <hr/>
        <small style="color:#777;">This is an automated email. Do not reply.</small>
      </div>
    `;

    // Send verification email
    await sendEmail(user.email, "Verify Your Email", html);

    res.status(201).json({ message: "User created. Please verify your email." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


// Email verification
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    if (!token) return res.status(400).json({ error: "Token is required" });

    // Verify JWT (checks signature & expiry)
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as any;

    // Update user as verified
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isVerified: true },
    });

    res.json({ message: "Email verified successfully" });
  } catch (err: any) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isVerified) return res.status(401).json({ error: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry: new Date(Date.now() + 3600000) },
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendEmail(email, "Reset Your Password", `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`);

    res.json({ message: "Password reset link sent" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.resetToken || user.resetToken !== token || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    res.json({ message: "Password reset successful" });
  } catch (err: any) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
