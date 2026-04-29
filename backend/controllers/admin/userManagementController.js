const pool = require("../../db");

// Get all users for admin dashboard
const getAllUsers = async (req, res) => {
    try {
        const users = await pool.query(
            `SELECT id, name, email, cycle_length, period_length, status, created_at 
             FROM users 
             ORDER BY created_at DESC`
        );
        res.json(users.rows);
    } catch (err) {
        console.error("Error fetching users:", err.message);
        res.status(500).json({ message: "Server error fetching users" });
    }
};

// Toggle user status (Block/Unblock)
const toggleUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await pool.query(
            "UPDATE users SET status = $1 WHERE id = $2 RETURNING id, status",
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: `User status updated to ${status}`, user: result.rows[0] });
    } catch (err) {
        console.error("Error updating user status:", err.message);
        res.status(500).json({ message: "Server error updating user status" });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err.message);
        res.status(500).json({ message: "Server error deleting user" });
    }
};

module.exports = {
    getAllUsers,
    toggleUserStatus,
    deleteUser
};