const pool = require("../db");

/**
 * Get all pill schedules for a user
 */
const getSchedules = async (req, res) => {
    try {
        const schedules = await pool.query(
            "SELECT * FROM pill_schedules WHERE user_id = $1 ORDER BY reminder_time ASC",
            [req.user.id]
        );
        res.json(schedules.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching schedules" });
    }
};

/**
 * Add a new pill schedule slot
 */
const addSchedule = async (req, res) => {
    try {
        const { pill_name, reminder_time } = req.body;
        const result = await pool.query(
            "INSERT INTO pill_schedules (user_id, pill_name, reminder_time) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, pill_name || 'Pill', reminder_time]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error adding schedule" });
    }
};

/**
 * Delete a schedule slot
 */
const deleteSchedule = async (req, res) => {
    try {
        await pool.query(
            "DELETE FROM pill_schedules WHERE id = $1 AND user_id = $2",
            [req.params.id, req.user.id]
        );
        res.json({ message: "Schedule deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error deleting schedule" });
    }
};

/**
 * Log a pill as taken/skipped
 */
const logPill = async (req, res) => {
    try {
        const { schedule_id, status } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // 1. Insert or Update log
        const result = await pool.query(
            `INSERT INTO pill_logs (user_id, schedule_id, status, log_date)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, schedule_id, log_date)
             DO UPDATE SET status = EXCLUDED.status, logged_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [req.user.id, schedule_id, status, today]
        );

        // 2. Handle Streak Logic
        if (status === 'taken') {
            const userResult = await pool.query("SELECT pill_streak, last_pill_date FROM users WHERE id = $1", [req.user.id]);
            const { pill_streak, last_pill_date } = userResult.rows[0];
            
            const lastDate = last_pill_date ? new Date(last_pill_date).toISOString().split('T')[0] : null;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            let newStreak = pill_streak;
            if (lastDate === yesterdayStr) {
                newStreak += 1;
            } else if (lastDate !== today) {
                newStreak = 1;
            }

            await pool.query(
                "UPDATE users SET pill_streak = $1, last_pill_date = $2 WHERE id = $3",
                [newStreak, today, req.user.id]
            );
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error logging pill" });
    }
};

/**
 * Get adherence stats
 */
const getStats = async (req, res) => {
    try {
        const stats = await pool.query(
            `SELECT 
                COUNT(*) FILTER (WHERE status = 'taken') as taken_count,
                COUNT(*) as total_count,
                (COUNT(*) FILTER (WHERE status = 'taken')::float / NULLIF(COUNT(*), 0) * 100) as adherence_rate
             FROM pill_logs 
             WHERE user_id = $1 AND log_date > CURRENT_DATE - INTERVAL '7 days'`,
            [req.user.id]
        );
        
        const streakResult = await pool.query("SELECT pill_streak FROM users WHERE id = $1", [req.user.id]);
        
        res.json({
            ...stats.rows[0],
            streak: streakResult.rows[0].pill_streak
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};

module.exports = {
    getSchedules,
    addSchedule,
    deleteSchedule,
    logPill,
    getStats
};
