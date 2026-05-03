const { OAuth2Client } = require('google-auth-library');
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { sendPasswordResetEmail } = require('../services/emailService');


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
        
        // 2. Check if account is blocked
        if (user.status === 'blocked') {
            return res.status(403).json({ 
                message: "This account has been blocked by an administrator. Please contact support if you believe this is an error." 
            });
        }

        // 3. Verify password
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

/**
 * Handle Google Login
 */
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "Google ID Token is required" });
        }

        console.log("Verifying token with Client ID:", process.env.GOOGLE_CLIENT_ID);

        // 1. Verify Google ID Token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // 2. Check if user already exists
        let userResult = await pool.query("SELECT * FROM users WHERE google_id = $1 OR email = $2", [googleId, email]);
        let user;

        if (userResult.rows.length > 0) {
            user = userResult.rows[0];
            
            // Check if account is blocked
            if (user.status === 'blocked') {
                return res.status(403).json({ 
                    message: "This account has been blocked by an administrator." 
                });
            }

            // Update google_id if it was found by email but didn't have google_id linked
            if (!user.google_id) {
                await pool.query("UPDATE users SET google_id = $1 WHERE id = $2", [googleId, user.id]);
            }
        } else {
            // 3. Create new user if not exists
            const newUser = await pool.query(
                "INSERT INTO users (name, email, google_id) VALUES ($1, $2, $3) RETURNING id, name, email, has_onboarded",
                [name, email, googleId]
            );
            user = newUser.rows[0];
        }

        // 4. Create token
        const token = createToken(user.id);

        res.json({
            message: "Google login successful!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                has_onboarded: user.has_onboarded
            }
        });
    } catch (err) {
        console.error("Google Auth Detailed Error:", err);
        res.status(500).json({ 
            message: "Google Authentication failed", 
            error: err.message 
        });
    }
};

/**
 * Handle Forgot Password
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const userQuery = await pool.query("SELECT id, name, email, password_hash FROM users WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            // Return 200 anyway to prevent email enumeration
            return res.json({ message: "If an account exists, a reset link has been sent." });
        }

        const user = userQuery.rows[0];

        // Create a stateless reset token using the current password hash as part of the secret.
        // If the password changes, the token instantly becomes invalid.
        const secret = process.env.JWT_SECRET + user.password_hash;
        const resetToken = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '15m' });

        await sendPasswordResetEmail(user.email, user.name, resetToken);

        res.json({ message: "If an account exists, a reset link has been sent." });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Error processing request" });
    }
};

/**
 * Handle Reset Password
 */
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        // Decode token to get user ID without verifying yet
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // Fetch user
        const userQuery = await pool.query("SELECT id, password_hash FROM users WHERE id = $1", [decoded.id]);
        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = userQuery.rows[0];

        // Verify token securely using the old password hash
        const secret = process.env.JWT_SECRET + user.password_hash;
        try {
            jwt.verify(token, secret);
        } catch (verifyErr) {
            return res.status(400).json({ message: "Invalid or expired token. Please request a new reset link." });
        }

        // Validate new password rules (from settings)
        const settings = await getSystemSettings();
        if (settings.pwdRequireLength && newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }
        if (settings.pwdRequireUppercase && !/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ message: "Password must contain at least one uppercase letter." });
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashedPassword, user.id]);

        res.json({ message: "Password has been successfully reset." });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Error resetting password" });
    }
};

module.exports = {
    signup,
    login,
    googleLogin,
    forgotPassword,
    resetPassword
};
