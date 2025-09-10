import { type Request, type Response } from "express";
import { prisma } from "../config/db.js";

// ⭐ Bookmark a job
export const bookmarkJob = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { jobPostId } = req.body;

  try {
    if (!user.jobSeekerProfile) {
      return res.status(403).json({ error: "Only job seekers can bookmark jobs" });
    }

    const existing = await prisma.jobBookmark.findFirst({
      where: { jobPostId, jobSeekerId: user.jobSeekerProfile.id }
    });
    if (existing) return res.status(400).json({ error: "Already bookmarked" });

    const bookmark = await prisma.jobBookmark.create({
      data: { jobPostId, jobSeekerId: user.jobSeekerProfile.id },
      include: { jobPost: true }
    });

    res.json(bookmark);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 Get my bookmarks
export const getMyBookmarks = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const bookmarks = await prisma.jobBookmark.findMany({
      where: { jobSeekerId: user.jobSeekerProfile.id },
      include: { jobPost: true }
    });
    res.json(bookmarks);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Remove a bookmark
export const removeBookmark = async (req: Request, res: Response) => {
  const { id } = req.params; // bookmarkId
  const user = (req as any).user;

  try {
    const bookmark = await prisma.jobBookmark.findUnique({ where: { id } });
    if (!bookmark || bookmark.jobSeekerId !== user.jobSeekerProfile.id) {
      return res.status(403).json({ error: "Not your bookmark" });
    }

    await prisma.jobBookmark.delete({ where: { id } });
    res.json({ message: "Bookmark removed" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
