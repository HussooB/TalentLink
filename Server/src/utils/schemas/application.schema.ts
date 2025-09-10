// src/utils/schemas/application.schema.ts
import { z } from "zod";

export const applyToJobSchema = z.object({
  body: z.object({
    jobPostId: z.string().uuid(),
    coverLetter: z.string().optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  body: z.object({
    statusId: z.number().int(),
  }),
});
