import { Router } from "express";
import {
  addNote,
  getNotesForApplication,
  updateNote,
  deleteNote
} from "../controllers/note.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { employerOnly } from "../middlewares/roles.js";
import { validate } from "../middlewares/validate.js";
import { addNoteSchema, updateNoteSchema } from "../utils/schemas/note.schema.js";
const router = Router();

// Employer-only routes
router.post("/", authMiddleware, employerOnly, validate(addNoteSchema),addNote);
router.get("/:applicationId", authMiddleware, employerOnly, getNotesForApplication);
router.put("/:id", authMiddleware, employerOnly, validate(updateNoteSchema),updateNote);
router.delete("/:id", authMiddleware, employerOnly, deleteNote);

export default router;
