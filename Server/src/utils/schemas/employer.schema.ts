// src/utils/schemas/employer.schema.ts
import { z } from "zod";

export const upsertEmployerSchema = z.object({
  body: z.object({
    role: z.string().min(1),
    companyId: z.string().uuid(),
  }),
});
