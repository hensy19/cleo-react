const pool = require("./db");

async function updateTable() {
    try {
        await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS has_onboarded BOOLEAN DEFAULT FALSE");
        console.log("Database table updated successfully.");
    } catch (err) {
        console.error("Error updating table:", err.message);
    } finally {
        process.exit();
    }
}

updateTable();
