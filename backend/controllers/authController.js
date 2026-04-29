const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Helper to create JWT token
 */
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "60d",
    });
};

const { getSystemSettings } = require("../utils/settingsHelper");

/**
 * Handle user registration (Signup)
 */
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Fetch dynamic system settings
        const settings = await getSystemSettings();

        // 1. Check if registration is allowed
        if (settings.allowRegistration === false) {
            return res.status(403).json({
                message: "Registration is currently disabled by the administrator."
            });
        }

        // 2. Validate password based on dynamic rules
        if (settings.pwdRequireLength && password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long."
            });
        }

        if (settings.pwdRequireUppercase && !/[A-Z]/.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least one uppercase letter."
            });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Save user to database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );

        const user = newUser.rows[0];
        const token = createToken(user.id);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error(err.message);
        // Check for duplicate email error
        if (err.code === '23505') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Error creating user" });
    }
};

/**
 * Handle user login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (userQuery.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const user = userQuery.rows[0];

        // 2. Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // 3. Success - Create token
        const token = createToken(user.id);

        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                has_onboarded: user.has_onboarded
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    signup,
    login
};
