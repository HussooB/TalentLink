import { type Request, type Response } from "express";
import { prisma } from "../config/db.js";

// ✅ Create / Update JobSeeker profile (one per user)
export const upsertJobSeeker = async (req: Request, res: Response) => {
  const user = (req as any).user; // from authMiddleware
  const { fullName, phone, resumeUrl, skills, location } = req.body;

  try {
    const jobSeeker = await prisma.jobSeekerProfile.upsert({
      where: { userId: user.id },
      update: { fullName, phone, resumeUrl, skills, location },
      create: { userId: user.id, fullName, phone, resumeUrl, skills, location },
    });

    res.json(jobSeeker);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get my own JobSeeker profile
export const getMyProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId: user.id },
      include: { applications: true, bookmarks: true },
    });

    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all job seekers (Admin only, later we’ll restrict)
export const getAllJobSeekers = async (req: Request, res: Response) => {
  try {
    const seekers = await prisma.jobSeekerProfile.findMany({
      include: { user: true, applications: true },
    });
    res.json(seekers);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete my JobSeeker profile
export const deleteMyProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    await prisma.jobSeekerProfile.delete({ where: { userId: user.id } });
    res.json({ message: "Profile deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
