const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user still exists and is not blocked
            const pool = require("../db");
            const user = await pool.query("SELECT id, status FROM users WHERE id = $1", [decoded.id]);

            if (user.rows.length === 0) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            if (user.rows[0].status === 'blocked') {
                return res.status(403).json({ message: "Your account has been blocked by an admin." });
            }

            // Add user ID to request object
            req.user = { id: decoded.id };

            next();
        } catch (error) {
            console.error(error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token expired" });
            }
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };
