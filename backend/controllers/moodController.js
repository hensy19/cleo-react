const pool = require("../db");
const { getMoodRecommendation } = require("../utils/recommendationService");

/**
 * Get mood history for the logged-in user
 */
const getMoods = async (req, res) => {
    try {
        const moods = await pool.query(
            "SELECT * FROM mood_logs WHERE user_id = $1 ORDER BY date DESC",
            [req.user.id]
        );
        res.json(moods.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching moods" });
    }
};

/**
 * Log a new mood entry (Every log creates a new entry)
 */
const logMood = async (req, res) => {
    try {
        const { date, mood_id } = req.body;
        
        // Create new record (Allows multiple moods per day)
        const newMood = await pool.query(
            "INSERT INTO mood_logs (user_id, date, mood_id) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, date, mood_id]
        );

        // Get recommendation from backend service
        const tip = getMoodRecommendation(mood_id);

        res.status(201).json({
            ...newMood.rows[0],
            recommendation: tip
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error logging mood" });
    }
};

module.exports = {
    getMoods,
    logMood
};
