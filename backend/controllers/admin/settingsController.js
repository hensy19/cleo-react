const pool = require("../../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config - save to /uploads, keep original extension
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `logo${ext}`); // Always save as "logo.png" etc.
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) cb(null, true);
        else cb(new Error("Only image files are allowed"), false);
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Get all settings
const getSettings = async (req, res) => {
    try {
        const result = await pool.query("SELECT setting_key, setting_value FROM admin_settings");
        const settings = {};
        result.rows.forEach(row => {
            settings[row.setting_key] = row.setting_value;
        });
        res.json(settings);
    } catch (err) {
        console.error("Error fetching settings:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update general settings (siteName, supportEmail, contactNo)
const updateSettings = async (req, res) => {
    try {
        const updates = req.body;
        for (const [key, value] of Object.entries(updates)) {
            await pool.query(
                `INSERT INTO admin_settings (setting_key, setting_value)
                 VALUES ($1, $2)
                 ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP`,
                [key, value]
            );
        }
        res.json({ message: "Settings updated successfully" });
    } catch (err) {
        console.error("Error updating settings:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Upload logo - saves file and stores its URL in admin_settings
const uploadLogo = [
    upload.single("logo"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            // Build the public URL for the uploaded logo
            const logoUrl = `http://localhost:5000/uploads/${req.file.filename}`;

            // Save the logo URL in admin_settings
            await pool.query(
                `INSERT INTO admin_settings (setting_key, setting_value, description)
                 VALUES ('logoUrl', $1, 'URL of the site logo')
                 ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = CURRENT_TIMESTAMP`,
                [logoUrl]
            );

            res.json({ logoUrl, message: "Logo uploaded successfully" });
        } catch (err) {
            console.error("Error uploading logo:", err.message);
            res.status(500).json({ message: "Server error uploading logo" });
        }
    }
];

module.exports = { getSettings, updateSettings, uploadLogo };
