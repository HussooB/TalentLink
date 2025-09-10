// src/utils/schemas/job.schema.ts
import { z } from "zod";

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    salaryRange: z.string().optional(),
    companyId: z.string().uuid().optional(), // optional if inferred from employer
    industryId: z.number().int().optional(),
    typeId: z.number().int(),
    statusId: z.number().int(),
  }),
});

export const updateJobSchema = createJobSchema;
