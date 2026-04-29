const pool = require("../db");

/**
 * Get period history for the logged-in user
 */
const getPeriods = async (req, res) => {
    try {
        const periods = await pool.query(
            "SELECT * FROM period_logs WHERE user_id = $1 ORDER BY start_date DESC",
            [req.user.id]
        );
        res.json(periods.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching period logs" });
    }
};

/**
 * Log a new period entry
 */
const logPeriod = async (req, res) => {
    try {
        const { start_date, end_date, flow } = req.body;
        
        const newEntry = await pool.query(
            "INSERT INTO period_logs (user_id, start_date, end_date, flow) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, start_date, end_date, flow || 'medium']
        );

        // Also update the user's last_period_date in the users table for easier predictions
        await pool.query(
            "UPDATE users SET last_period_date = $1 WHERE id = $2",
            [start_date, req.user.id]
        );

        res.status(201).json(newEntry.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error logging period" });
    }
};

/**
 * Update a period log
 */
const updatePeriod = async (req, res) => {
    try {
        const { id } = req.params;
        const { start_date, end_date, flow } = req.body;
        
        const updated = await pool.query(
            "UPDATE period_logs SET start_date = $1, end_date = $2, flow = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
            [start_date, end_date, flow, id, req.user.id]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({ message: "Period log not found" });
        }

        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error updating period" });
    }
};

/**
 * Delete a period log
 */
const deletePeriod = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM period_logs WHERE id = $1 AND user_id = $2",
            [id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Period log not found" });
        }

        res.json({ message: "Period log deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error deleting period" });
    }
};

module.exports = {
    getPeriods,
    logPeriod,
    updatePeriod,
    deletePeriod
};
