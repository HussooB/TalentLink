// src/utils/schemas/note.schema.ts
import { z } from "zod";

export const addNoteSchema = z.object({
  body: z.object({
    applicationId: z.string().uuid(),
    content: z.string().min(1),
  }),
});

export const updateNoteSchema = z.object({
  body: z.object({
    content: z.string().min(1),
  }),
});
