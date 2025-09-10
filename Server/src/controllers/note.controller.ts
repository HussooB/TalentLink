import { type Request, type Response } from "express";
import { prisma } from "../config/db.js";

// ➕ Add a note to an application
export const addNote = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { applicationId, content } = req.body;

  try {
    if (!user.employerProfile) {
      return res.status(403).json({ error: "Only employers can add notes" });
    }

    // ensure application belongs to employer's company
    const app = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { jobPost: true }
    });

    if (!app || app.jobPost.companyId !== user.employerProfile.companyId) {
      return res.status(403).json({ error: "Not authorized to add note to this application" });
    }

    const note = await prisma.jobApplicationNote.create({
      data: {
        content,
        employerId: user.employerProfile.id,
        applicationId
      }
    });

    res.json(note);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// 👀 Get notes for an application (employer-only)
export const getNotesForApplication = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { applicationId } = req.params;

  try {
    if (!user.employerProfile) {
      return res.status(403).json({ error: "Only employers can view notes" });
    }

    const app = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { jobPost: true }
    });

    if (!app || app.jobPost.companyId !== user.employerProfile.companyId) {
      return res.status(403).json({ error: "Not authorized to view notes" });
    }

    const notes = await prisma.jobApplicationNote.findMany({
      where: { applicationId },
      include: { employer: true }
    });

    res.json(notes);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✏️ Update a note (only the employer who wrote it)
export const updateNote = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params; // noteId
  const { content } = req.body;

  try {
    const note = await prisma.jobApplicationNote.findUnique({
      where: { id },
    });

    if (!note) return res.status(404).json({ error: "Note not found" });

    if (note.employerId !== user.employerProfile.id) {
      return res.status(403).json({ error: "Not authorized to edit this note" });
    }

    const updated = await prisma.jobApplicationNote.update({
      where: { id },
      data: { content }
    });

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ❌ Delete a note (only the employer who wrote it)
export const deleteNote = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params; // noteId

  try {
    const note = await prisma.jobApplicationNote.findUnique({ where: { id } });

    if (!note) return res.status(404).json({ error: "Note not found" });

    if (note.employerId !== user.employerProfile.id) {
      return res.status(403).json({ error: "Not authorized to delete this note" });
    }

    await prisma.jobApplicationNote.delete({ where: { id } });

    res.json({ message: "Note deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
