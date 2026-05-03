const pool = require("../db");
const { sendCycleSummaryEmail } = require("../services/emailService");

/**
 * Helper to keep users table last_period_date perfectly synced
 */
const syncLastPeriodDate = async (userId) => {
    const latest = await pool.query(
        "SELECT start_date FROM period_logs WHERE user_id = $1 ORDER BY start_date DESC LIMIT 1",
        [userId]
    );
    const newLastDate = latest.rows.length > 0 ? latest.rows[0].start_date : null;
    
    const userUpdate = await pool.query(
        "UPDATE users SET last_period_date = $1 WHERE id = $2 RETURNING name, email, cycle_length, period_length",
        [newLastDate, userId]
    );
    return userUpdate.rows[0];
};

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

        // 1. Update the user's last_period_date in the users table to stay perfectly in sync
        const user = await syncLastPeriodDate(req.user.id);

        // 2. Check if user wants a cycle summary email
        const reminderPrefs = await pool.query(
            "SELECT new_cycle_summary FROM reminders WHERE user_id = $1",
            [req.user.id]
        );

        if (reminderPrefs.rows.length > 0 && reminderPrefs.rows[0].new_cycle_summary) {
            // 3. Calculate Predictions
            const cycleLength = user.cycle_length || 28;
            const start = new Date(start_date);
            
            // Next Period
            const nextPeriod = new Date(start);
            nextPeriod.setDate(start.getDate() + cycleLength);
            
            // Ovulation Window (approx 14 days before next period)
            // Window is typically 5 days before ovulation + ovulation day
            const ovulationDay = new Date(nextPeriod);
            ovulationDay.setDate(nextPeriod.getDate() - 14);
            
            const ovulationStart = new Date(ovulationDay);
            ovulationStart.setDate(ovulationDay.getDate() - 3); // 3 days before
            
            const ovulationEnd = new Date(ovulationDay);
            ovulationEnd.setDate(ovulationDay.getDate() + 1); // 1 day after

            // 4. Send Email (Async, don't block the response)
            sendCycleSummaryEmail(user.email, user.name, {
                nextPeriod: nextPeriod.toISOString().split('T')[0],
                ovulationStart: ovulationStart.toISOString().split('T')[0],
                ovulationEnd: ovulationEnd.toISOString().split('T')[0]
            }).catch(e => console.error("Email sending failed:", e));
        }

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

        // Keep dashboard predictions in sync with edited date
        await syncLastPeriodDate(req.user.id);

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

        // Sync dashboard predictions to reflect the deletion
        await syncLastPeriodDate(req.user.id);

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
