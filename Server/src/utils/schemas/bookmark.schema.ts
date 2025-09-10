// src/utils/schemas/bookmark.schema.ts
import { z } from "zod";

export const bookmarkJobSchema = z.object({
  body: z.object({
    jobPostId: z.string().uuid(),
  }),
});
