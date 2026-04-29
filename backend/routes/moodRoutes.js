const express = require("express");
const router = express.Router();
const { getMoods, logMood } = require("../controllers/moodController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getMoods);
router.post("/", logMood);

module.exports = router;
