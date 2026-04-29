const express = require("express");
const router = express.Router();
const { getNotes, createNote, deleteNote, updateNote } = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

// All note routes are protected
router.use(protect);

router.get("/", getNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);
router.put("/:id", updateNote);

module.exports = router;
