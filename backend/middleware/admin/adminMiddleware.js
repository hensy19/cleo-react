const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header (Looks like: "Bearer 12345...")
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if the role is 'admin'
            if (decoded.role !== "admin") {
                return res.status(403).json({ message: "Not authorized as an admin" });
            }

            // Attach admin info to the request
            req.admin = decoded;
            next();
        } catch (error) {
            console.error("Admin Auth Error:", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protectAdmin };
