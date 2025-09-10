import { type Request, type Response } from "express";
import { prisma } from "../config/db.js";

// ✅ Create a job (Employer only)
export const createJob = async (req: Request, res: Response) => {
  const { title, description, industryId, typeId, salaryRange, statusId } = req.body;
  const user = (req as any).user; // From authMiddleware

  try {
    // Get employer’s company
    const employer = await prisma.employerProfile.findUnique({
      where: { userId: user.id },
      include: { company: true }
    });

    if (!employer) {
      return res.status(403).json({ error: "Employer profile not found" });
    }

    // 👇 If company is not approved, job should not be visible
    const isVisible = employer.company.approved;

    const job = await prisma.jobPost.create({
      data: {
        title,
        description,
        industryId,
        typeId,
        salaryRange,
        statusId,
        companyId: employer.companyId,
        isVisible
      }
    });

    res.status(201).json(job);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all jobs (public) → Only visible ones
export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.jobPost.findMany({
      where: { isVisible: true },
      include: { company: true, industry: true, type: true, status: true }
    });
    res.json(jobs);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get single job by ID → Only if visible
export const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const job = await prisma.jobPost.findUnique({
      where: { id },
      include: { company: true, industry: true, type: true, status: true }
    });
    if (!job || !job.isVisible) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Update job (Employer only, their own job)
export const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, industryId, typeId, salaryRange, statusId } = req.body;
  const user = (req as any).user;

  try {
    const employer = await prisma.employerProfile.findUnique({
      where: { userId: user.id },
      include: { company: true }
    });

    if (!employer) return res.status(403).json({ error: "Employer profile not found" });

    const job = await prisma.jobPost.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.companyId !== employer.companyId)
      return res.status(403).json({ error: "Not allowed" });

    const updated = await prisma.jobPost.update({
      where: { id },
      data: {
        title,
        description,
        industryId,
        typeId,
        salaryRange,
        statusId,
        // 👇 Ensure visibility reflects company approval
        isVisible: employer.company.approved
      }
    });

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete job (Employer only, their own job)
export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const employer = await prisma.employerProfile.findUnique({
      where: { userId: user.id }
    });

    if (!employer) return res.status(403).json({ error: "Employer profile not found" });

    const job = await prisma.jobPost.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ error: "Job not found" });
    if (job.companyId !== employer.companyId)
      return res.status(403).json({ error: "Not allowed" });

    await prisma.jobPost.delete({ where: { id } });
    res.json({ message: "Job deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
