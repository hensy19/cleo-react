const pool = require("../db");

/**
 * Get reminder settings for the logged-in user
 */
const getReminders = async (req, res) => {
    try {
        const reminders = await pool.query(
            "SELECT * FROM reminders WHERE user_id = $1",
            [req.user.id]
        );

        if (reminders.rows.length === 0) {
            // Return defaults if not set yet
            return res.json({
                period_approaching: true,
                days_before_period: 2,
                ovulation_approaching: true,
                daily_log: false,
                reminder_time: '09:00:00'
            });
        }

        res.json(reminders.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching reminders" });
    }
};

/**
 * Update reminder settings (upsert)
 */
const updateReminders = async (req, res) => {
    try {
        const {
            period_approaching,
            days_before_period,
            ovulation_approaching,
            daily_log,
            reminder_time
        } = req.body;

        const result = await pool.query(
            `INSERT INTO reminders (
                user_id, period_approaching, days_before_period, 
                ovulation_approaching, daily_log, reminder_time
             ) 
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (user_id) 
             DO UPDATE SET 
                period_approaching = EXCLUDED.period_approaching,
                days_before_period = EXCLUDED.days_before_period,
                ovulation_approaching = EXCLUDED.ovulation_approaching,
                daily_log = EXCLUDED.daily_log,
                reminder_time = EXCLUDED.reminder_time,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [
                req.user.id,
                period_approaching ?? true,
                days_before_period ?? 2,
                ovulation_approaching ?? true,
                daily_log ?? false,
                reminder_time ?? '09:00:00'
            ]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error updating reminders" });
    }
};

module.exports = {
    getReminders,
    updateReminders
};
