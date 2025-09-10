// src/utils/schemas/jobSeeker.schema.ts
import { z } from "zod";

export const upsertJobSeekerSchema = z.object({
  body: z.object({
    fullName: z.string().min(1),
    phone: z.string().optional(),
    resumeUrl: z.string().url().optional(),
    skills: z.array(z.string()).optional(),
    location: z.string().optional(),
  }),
});
