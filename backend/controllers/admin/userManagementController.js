const pool = require("../../db");

// Get all users for admin dashboard
const getAllUsers = async (req, res) => {
    try {
        const users = await pool.query(
            `SELECT id, name, email, cycle_length, period_length, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );
        res.json(users.rows);
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).json({ message: "Server error fetching users" });
    }
};

module.exports = {
    getAllUsers
};