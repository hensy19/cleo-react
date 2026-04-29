const express = require("express");
const router = express.Router();
const { getReminders, updateReminders } = require("../controllers/reminderController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getReminders);
router.put("/", updateReminders);

module.exports = router;
