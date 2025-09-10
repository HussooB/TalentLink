import { Router } from "express";
import {
  bookmarkJob,
  getMyBookmarks,
  removeBookmark
} from "../controllers/bookmark.controller.js";

import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { bookmarkJobSchema } from "../utils/schemas/bookmark.schema.js";
const router = Router();

// ⭐ Job seeker bookmarks
router.post("/", authMiddleware, validate(bookmarkJobSchema),bookmarkJob);
router.get("/me", authMiddleware, getMyBookmarks);
router.delete("/:id", authMiddleware, removeBookmark);

export default router;
