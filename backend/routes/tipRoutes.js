const express = require("express");
const router = express.Router();
const pool = require("../db");
const { protect } = require("../middleware/authMiddleware");
const { getMoodRecommendation, getSymptomRecommendation } = require("../utils/recommendationService");
const { getAllTips, createTip } = require("../controllers/tipController");

router.get("/", getAllTips);
router.post("/", protect, createTip); // Admin route ideally
router.get("/recommendation", protect, async (req, res) => {
    try {
        // Fetch latest data for this user
        const latestSymptom = await pool.query(
            "SELECT * FROM symptom_logs WHERE user_id = $1 ORDER BY date DESC, id DESC LIMIT 1",
            [req.user.id]
        );

        const latestMood = await pool.query(
            "SELECT * FROM mood_logs WHERE user_id = $1 ORDER BY date DESC, id DESC LIMIT 1",
            [req.user.id]
        );

        let recommendation = null;

        // Prioritize symptoms over moods for tips
        if (latestSymptom.rows.length > 0) {
            recommendation = getSymptomRecommendation(latestSymptom.rows[0].symptoms);
        } else if (latestMood.rows.length > 0) {
            recommendation = getMoodRecommendation(latestMood.rows[0].mood_id);
        }

        res.json(recommendation || {
            title: "Start Logging",
            content: "Log your first mood or symptom to get personalized health insights!",
            color: "green"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching recommendation" });
    }
});

module.exports = router;
