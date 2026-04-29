const pool = require("../db");
const { getSystemSettings } = require("../utils/settingsHelper");

/**
 * Get all tips from the database
 */
const getAllTips = async (req, res) => {
    try {
        const settings = await getSystemSettings();
        
        // Respect admin setting to hide tips
        if (settings.showTips === false) {
            return res.json([]);
        }

        const result = await pool.query("SELECT * FROM tips WHERE status = 'published' ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching tips" });
    }
};

/**
 * Create a new tip (Admin only - for now anyone can for testing)
 */
const createTip = async (req, res) => {
    try {
        const { title, category, content, detailed_content, icon_name, color } = req.body;
        const newTip = await pool.query(
            "INSERT INTO tips (title, category, content, detailed_content, icon_name, color) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [title, category, content, detailed_content, icon_name, color]
        );
        res.status(201).json(newTip.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error creating tip" });
    }
};

module.exports = {
    getAllTips,
    createTip
};
