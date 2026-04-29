const pool = require("../db");

/**
 * Fetches all admin settings from the database and returns them as a key-value object.
 * Values like 'true'/'false' are converted to booleans.
 */
const getSystemSettings = async () => {
    try {
        const result = await pool.query("SELECT setting_key, setting_value FROM admin_settings");
        const settings = {};
        
        result.rows.forEach(row => {
            let value = row.setting_value;
            
            // Convert boolean strings
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            
            settings[row.setting_key] = value;
        });
        
        return settings;
    } catch (err) {
        console.error("Error fetching system settings:", err.message);
        return {}; // Return empty object on error to prevent crashes
    }
};

module.exports = { getSystemSettings };
