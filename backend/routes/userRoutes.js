const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, completeOnboarding } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// All routes here are protected
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/onboarding", completeOnboarding);

module.exports = router;
