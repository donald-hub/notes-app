import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", authMiddleware, getNotes);
router.get("/:id", authMiddleware, getNoteById);
router.post("/", authMiddleware, createNote);
router.put("/:id", authMiddleware, updateNote);
router.delete("/:id", authMiddleware, deleteNote);

export default router;
