import { type Request, type Response } from "express";
import { prisma } from "../config/db.js";

// ✅ Get own employer profile
export const getMyEmployerProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const profile = await prisma.employerProfile.findUnique({
      where: { userId: user.id },
      include: { company: true, user: true }
    });

    if (!profile) return res.status(404).json({ error: "Employer profile not found" });

    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Upsert employer profile
export const upsertEmployerProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { role, companyName, website, location } = req.body;

  try {
    // Check if company exists, otherwise create
    let company = await prisma.company.findUnique({ where: { name: companyName } });
    if (!company) {
      company = await prisma.company.create({
        data: { name: companyName, website, location, approved: false }
      });
    }

    // Upsert employer profile
    const profile = await prisma.employerProfile.upsert({
      where: { userId: user.id },
      update: { role, companyId: company.id },
      create: { userId: user.id, role, companyId: company.id },
      include: { company: true }
    });

    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Admin: get all employers
export const getAllEmployers = async (req: Request, res: Response) => {
  try {
    const employers = await prisma.employerProfile.findMany({
      include: { user: true, company: true }
    });
    res.json(employers);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Delete own employer profile
export const deleteMyEmployerProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const profile = await prisma.employerProfile.findUnique({ where: { userId: user.id } });
    if (!profile) return res.status(404).json({ error: "Employer profile not found" });

    await prisma.employerProfile.delete({ where: { userId: user.id } });
    res.json({ message: "Employer profile deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
