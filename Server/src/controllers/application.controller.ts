import { type Request, type Response } from "express";
import { prisma } from "../config/db.js";

// 📝 Job Seeker applies to a job
export const applyToJob = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { jobPostId, coverLetter } = req.body;

  try {
    // ensure user is a job seeker
    if (!user.jobSeekerProfile) {
      return res.status(403).json({ error: "Only job seekers can apply" });
    }

    // check if already applied
    const existing = await prisma.jobApplication.findFirst({
      where: { jobPostId, jobSeekerId: user.jobSeekerProfile.id }
    });
    if (existing) return res.status(400).json({ error: "Already applied to this job" });

    // default status = PENDING
    const status = await prisma.applicationStatus.findUnique({ where: { name: "PENDING" } });

    const application = await prisma.jobApplication.create({
      data: {
        jobPostId,
        jobSeekerId: user.jobSeekerProfile.id,
        coverLetter,
        statusId: status?.id ?? 1
      },
      include: { jobPost: true, status: true }
    });

    res.json(application);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// 👀 Job Seeker gets their own applications
export const getMyApplications = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const applications = await prisma.jobApplication.findMany({
      where: { jobSeekerId: user.jobSeekerProfile.id },
      include: { jobPost: true, status: true }
    });
    res.json(applications);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// 👔 Employer views applications to their jobs
export const getApplicationsForMyJobs = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const applications = await prisma.jobApplication.findMany({
      where: { jobPost: { companyId: user.employerProfile.companyId } },
      include: { jobSeeker: true, jobPost: true, status: true }
    });
    res.json(applications);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Employer updates application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  const { id } = req.params; // applicationId
  const { statusName } = req.body; // e.g. "INTERVIEW"

  try {
    const status = await prisma.applicationStatus.findUnique({ where: { name: statusName } });
    if (!status) return res.status(400).json({ error: "Invalid status" });

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { statusId: status.id },
      include: { status: true }
    });

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
