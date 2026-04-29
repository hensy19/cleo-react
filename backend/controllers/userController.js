const pool = require("../db");
const { getSystemSettings } = require("../utils/settingsHelper");

/**
 * Save onboarding data and mark as completed
 */
const completeOnboarding = async (req, res) => {
    try {
        const { age, cycleLength, periodLength, lastPeriodDate } = req.body;
        
        const updatedUser = await pool.query(
            `UPDATE users 
             SET age = $1, cycle_length = $2, period_length = $3, last_period_date = $4, has_onboarded = TRUE
             WHERE id = $5 
             RETURNING id, name, email, has_onboarded`,
            [age, cycleLength, periodLength, lastPeriodDate, req.user.id]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Onboarding completed successfully",
            user: updatedUser.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error saving onboarding data" });
    }
};

/**
 * Get profile for the logged-in user
 */
const getProfile = async (req, res) => {
    try {
        const userQuery = await pool.query(
            "SELECT id, name, email, dob, age, cycle_length, period_length, last_period_date, created_at FROM users WHERE id = $1",
            [req.user.id]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userQuery.rows[0];
        const settings = await getSystemSettings();

        // Apply default cycle length if user hasn't specified one
        if (!user.cycle_length && settings.defaultCycleLength) {
            user.cycle_length = parseInt(settings.defaultCycleLength);
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error fetching profile" });
    }
};

/**
 * Update profile for the logged-in user
 */
const updateProfile = async (req, res) => {
    try {
        const { name, dob, age, cycle_length, period_length } = req.body;
        
        const updatedUser = await pool.query(
            `UPDATE users 
             SET name = $1, dob = $2, age = $3, cycle_length = $4, period_length = $5
             WHERE id = $6 
             RETURNING id, name, email, dob, age, cycle_length, period_length, last_period_date`,
            [name, dob, age, cycle_length, period_length, req.user.id]
        );

        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: "User not found or update failed" });
        }

        res.json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error updating profile" });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    completeOnboarding
};
