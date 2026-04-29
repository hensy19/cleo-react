const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const moodRoutes = require("./routes/moodRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const periodRoutes = require("./routes/periodRoutes");

const path = require("path");

const app = express();

// Validate Environment Variables
if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn("WARNING: GOOGLE_CLIENT_ID is not defined in .env file.");
} else {
    console.log("GOOGLE_CLIENT_ID loaded successfully.");
}

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// Serve uploaded files (logos, etc.) publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.use("/api/notes", noteRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/periods", periodRoutes);
app.use("/api/tips", require("./routes/tipRoutes"));
app.use("/api/admin", require("./routes/admin/adminRoutes"));

// Public settings endpoint (no auth needed - for logo etc.)
app.get("/api/public/settings", async (req, res) => {
    try {
        const pool = require("./db");
        const result = await pool.query("SELECT setting_key, setting_value FROM admin_settings");
        const settings = {};
        result.rows.forEach(row => { settings[row.setting_key] = row.setting_value; });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Health check / Test routes
app.get("/", (req, res) => {
    res.send("CLEO API is running...");
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("DB connection error");
    }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});