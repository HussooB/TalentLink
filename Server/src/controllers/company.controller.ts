// controllers/company.controller.ts
import { type Request, type Response } from "express";
import { prisma } from "../config/db.js";

// ✅ Admin approves a company (and cascades jobs visibility)
export const approveCompany = async (req: Request, res: Response) => {
  const { id } = req.params; // companyId

  try {
    const company = await prisma.company.update({
      where: { id },
      data: {
        approved: true,
        jobs: { updateMany: { where: {}, data: { isVisible: true } } },
      },
    });

    res.json({ message: "Company approved and jobs made visible", company });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
