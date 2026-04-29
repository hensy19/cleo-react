const pool = require("../db");
const { getSymptomRecommendation } = require("../utils/recommendationService");

/**
 * Get symptom history for the logged-in user
 */
const getSymptoms = async (req, res) => {
    try {
        const symptoms = await pool.query(
            "SELECT * FROM symptom_logs WHERE user_id = $1 ORDER BY date DESC",
            [req.user.id]
        );
        res.json(symptoms.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching symptoms" });
    }
};

/**
 * Log a new symptom entry (Every log creates a new entry)
 */
const logSymptoms = async (req, res) => {
    try {
        const { date, symptoms } = req.body; // symptoms should be an array
        
        // Create new record (Allows multiple entries per day)
        const newEntry = await pool.query(
            "INSERT INTO symptom_logs (user_id, date, symptoms) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, date, JSON.stringify(symptoms)]
        );

        // Get recommendation from backend service
        const tip = getSymptomRecommendation(symptoms);

        res.status(201).json({
            ...newEntry.rows[0],
            recommendation: tip
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error logging symptoms" });
    }
};

module.exports = {
    getSymptoms,
    logSymptoms
};
