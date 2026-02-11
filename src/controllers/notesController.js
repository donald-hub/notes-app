import Note from "../models/Note.js";

/**
 * GET /notes
 * Get all notes for logged-in user
 */
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
};

/**
 * GET /notes/:id
 * Get single note (must belong to user)
 */
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Error in getNoteById:", error);
    res.status(500).json({ message: "Failed to fetch note" });
  }
};

/**
 * POST /notes
 * Create note for logged-in user
 */
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = new Note({
      title,
      content,
      user: req.user._id,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: "Failed to create note" });
  }
};

/**
 * PUT /notes/:id
 * Update note (only if owned by user)
 */
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote:", error);
    res.status(500).json({ message: "Failed to update note" });
  }
};

/**
 * DELETE /notes/:id
 * Delete note (only if owned by user)
 */
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNote:", error);
    res.status(500).json({ message: "Failed to delete note" });
  }
};

export {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
