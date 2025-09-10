import { z } from "zod";

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    location: z.string().optional(),
  }),
});
