import { type Request, type Response, type NextFunction } from "express";

export const employerOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const employerRoles = ["EMPLOYER", "ADMIN", "SUPER_ADMIN"];
  if (!employerRoles.includes(user.userType.name)) {
    return res.status(403).json({ error: "Only employers allowed" });
  }
  next();
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!["ADMIN", "SUPER_ADMIN"].includes(user.userType.name)) {
    return res.status(403).json({ error: "Only admins allowed" });
  }
  next();
};

export const superAdminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (user.userType.name !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Only super admins allowed" });
  }
  next();
};