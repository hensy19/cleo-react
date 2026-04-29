const pool = require("../db");

/**
 * Get all notes for the logged-in user
 */
const getNotes = async (req, res) => {
    try {
        const notes = await pool.query(
            "SELECT * FROM notes WHERE user_id = $1 ORDER BY date DESC",
            [req.user.id]
        );
        res.json(notes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching notes" });
    }
};

/**
 * Create a new note
 */
const createNote = async (req, res) => {
    try {
        const { date, title, content } = req.body;
        const newNote = await pool.query(
            "INSERT INTO notes (user_id, date, title, content) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, date, title, content]
        );
        res.status(201).json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error creating note" });
    }
};

/**
 * Delete a note
 */
const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error deleting note" });
    }
};

/**
 * Update a note
 */
const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const updatedNote = await pool.query(
            "UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
            [title, content, id, req.user.id]
        );

        if (updatedNote.rows.length === 0) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        res.json(updatedNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error updating note" });
    }
};

module.exports = {
    getNotes,
    createNote,
    deleteNote,
    updateNote
};
