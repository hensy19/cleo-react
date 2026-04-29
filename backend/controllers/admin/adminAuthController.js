const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../db");

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if admin exists
        const admin = await pool.query(
            "SELECT * FROM admin_accounts WHERE email = $1",
            [email]
        );

        if (admin.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Admin Credentials" });
        }

        // 2. Check password
        const validPassword = await bcrypt.compare(password, admin.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Admin Credentials" });
        }

        // 3. Update last login time
        await pool.query(
            "UPDATE admin_accounts SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
            [admin.rows[0].id]
        );

        // 4. Generate JWT Token
        const token = jwt.sign(
            { id: admin.rows[0].id, role: "admin", is_super_admin: admin.rows[0].is_super_admin },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        res.json({
            token,
            admin: {
                id: admin.rows[0].id,
                name: admin.rows[0].name,
                username: admin.rows[0].username,
                email: admin.rows[0].email,
                is_super_admin: admin.rows[0].is_super_admin
            }
        });
    } catch (err) {
        console.error("Admin login error:", err.message);
        res.status(500).json({ message: "Server error during admin login" });
    }
};

// TEMPORARY: Create first admin (Remove after using once!)
const createFirstAdmin = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = await pool.query(
            "INSERT INTO admin_accounts (name, username, email, password_hash, is_super_admin) VALUES ($1, $2, $3, $4, true) RETURNING id, username, email",
            [name, username, email, passwordHash]
        );

        res.status(201).json({ message: "First Admin Created!", admin: newAdmin.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error creating admin" });
    }
};

module.exports = {
    loginAdmin,
    createFirstAdmin
};
