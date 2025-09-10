// controllers/auth.controller.ts
import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { sendEmail } from "../utils/email.js";
// ✅ Signup with email verification
// ✅ Signup with email verification (Job Seeker + Employer)
export const signup = async (req: Request, res: Response) => {
  const { email, password, userTypeId, fullName, role, companyName, website, location } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userTypeId,
        isVerified: false,
      },
    });

    // Create profile depending on userType
    const userType = await prisma.userType.findUnique({ where: { id: userTypeId } });
    if (!userType) return res.status(400).json({ error: "Invalid user type" });

    if (userType.name === "JOB_SEEKER") {
      await prisma.jobSeekerProfile.create({
        data: {
          userId: user.id,
          fullName: fullName || "", // from req.body
        },
      });
    }

    if (userType.name === "EMPLOYER") {
      // 1️⃣ Check if company exists
      let company = await prisma.company.findUnique({ where: { name: companyName } });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: companyName,
            website,
            location,
            approved: false, // needs admin approval
          },
        });
      }

      // 2️⃣ Create employer profile
      await prisma.employerProfile.create({
        data: {
          userId: user.id,
          role,
          companyId: company.id,
        },
      });
    }

    // Send verification email
    const verificationToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    const html = `
      <h2>Welcome to TalentLink 🎉</h2>
      <p>Hi ${user.email},</p>
      <p>Click below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

    await sendEmail(user.email, "Verify Your Email", html);

    res.status(201).json({ message: "User created. Please verify your email." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};


// ✅ Email verification
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    if (!token) return res.status(400).json({ error: "Token is required" });

    const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as any;

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isVerified: true },
    });

    res.json({ message: "Email verified successfully" });
  } catch (err: any) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};

// ✅ Login
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

// ✅ Request password reset (Forgot password flow)
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

// ✅ Reset password
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

// ✅ Change password (while logged in)
export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const user = (req as any).user; // this is the whole user object from middleware
  const userId = user.id;

  try {
    const isMatch = await bcrypt.compare(oldPassword, user.password!);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
