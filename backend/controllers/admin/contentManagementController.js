const pool = require("../../db");

// Get all tips for content management
const getAllTips = async (req, res) => {
    try {
        const tips = await pool.query(
            "SELECT * FROM tips ORDER BY created_at DESC"
        );
        res.json(tips.rows);
    } catch (err) {
        console.error("Error fetching tips:", err.message);
        res.status(500).json({ message: "Server error fetching tips" });
    }
};

// Create a new tip
const createTip = async (req, res) => {
    try {
        const { title, category, content, detailed_content, status } = req.body;
        const newTip = await pool.query(
            `INSERT INTO tips (title, category, content, detailed_content, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, category, content, detailed_content, status || 'draft']
        );
        res.status(201).json(newTip.rows[0]);
    } catch (err) {
        console.error("Error creating tip:", err.message);
        res.status(500).json({ message: "Server error creating tip" });
    }
};

// Update an existing tip
const updateTip = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, content, detailed_content, status } = req.body;
        const updatedTip = await pool.query(
            `UPDATE tips 
             SET title = $1, category = $2, content = $3, detailed_content = $4, status = $5
             WHERE id = $6 RETURNING *`,
            [title, category, content, detailed_content, status, id]
        );
        if (updatedTip.rows.length === 0) {
            return res.status(404).json({ message: "Tip not found" });
        }
        res.json(updatedTip.rows[0]);
    } catch (err) {
        console.error("Error updating tip:", err.message);
        res.status(500).json({ message: "Server error updating tip" });
    }
};

// Delete a tip
const deleteTip = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTip = await pool.query(
            "DELETE FROM tips WHERE id = $1 RETURNING *",
            [id]
        );
        if (deletedTip.rows.length === 0) {
            return res.status(404).json({ message: "Tip not found" });
        }
        res.json({ message: "Tip deleted successfully" });
    } catch (err) {
        console.error("Error deleting tip:", err.message);
        res.status(500).json({ message: "Server error deleting tip" });
    }
};

// Update tip status (Publish/Draft)
const updateTipStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedTip = await pool.query(
            "UPDATE tips SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        if (updatedTip.rows.length === 0) {
            return res.status(404).json({ message: "Tip not found" });
        }
        res.json(updatedTip.rows[0]);
    } catch (err) {
        console.error("Error updating status:", err.message);
        res.status(500).json({ message: "Server error updating status" });
    }
};

module.exports = {
    getAllTips,
    createTip,
    updateTip,
    deleteTip,
    updateTipStatus
};