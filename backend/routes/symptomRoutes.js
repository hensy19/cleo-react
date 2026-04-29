const express = require("express");
const router = express.Router();
const { getSymptoms, logSymptoms } = require("../controllers/symptomController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getSymptoms);
router.post("/", logSymptoms);

module.exports = router;
