const pool = require("../db");

/**
 * Get all health goals for the logged-in user
 */
const getGoals = async (req, res) => {
    try {
        const goals = await pool.query(
            "SELECT * FROM health_goals WHERE user_id = $1",
            [req.user.id]
        );
        res.json(goals.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching goals" });
    }
};

/**
 * Create or update a health goal (upsert)
 */
const saveGoal = async (req, res) => {
    try {
        const { goal_name, target_value, unit } = req.body;
        
        // Upsert query: insert if new, update if it already exists for this user
        const result = await pool.query(
            `INSERT INTO health_goals (user_id, goal_name, target_value, unit) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, goal_name) 
             DO UPDATE SET target_value = EXCLUDED.target_value, unit = EXCLUDED.unit
             RETURNING *`,
            [req.user.id, goal_name, target_value, unit]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error saving goal" });
    }
};

/**
 * Update the progress (current_value) of a health goal
 */
const updateGoalProgress = async (req, res) => {
    try {
        const { goal_name } = req.params;
        const { current_value, notified } = req.body;

        // Note: we can also check if last_updated is old and reset progress if needed, 
        // but for now we just update it.
        const result = await pool.query(
            `UPDATE health_goals 
             SET current_value = $1, notified = COALESCE($2, notified), last_updated = CURRENT_DATE
             WHERE user_id = $3 AND goal_name = $4
             RETURNING *`,
            [current_value, notified, req.user.id, goal_name]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Goal not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error updating goal progress" });
    }
};

/**
 * Delete a goal
 */
const deleteGoal = async (req, res) => {
    try {
        const { goal_name } = req.params;
        const result = await pool.query(
            "DELETE FROM health_goals WHERE user_id = $1 AND goal_name = $2 RETURNING *",
            [req.user.id, goal_name]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Goal not found" });
        }

        res.json({ message: "Goal deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error deleting goal" });
    }
};

/**
 * Reset all goals progress to 0 (typically done at start of day)
 */
const resetGoals = async (req, res) => {
    try {
        await pool.query(
            "UPDATE health_goals SET current_value = 0, notified = FALSE WHERE user_id = $1",
            [req.user.id]
        );
        res.json({ message: "Goals reset successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error resetting goals" });
    }
}

module.exports = {
    getGoals,
    saveGoal,
    updateGoalProgress,
    deleteGoal,
    resetGoals
};
