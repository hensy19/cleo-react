const express = require("express");
const router = express.Router();
const { getGoals, saveGoal, updateGoalProgress, deleteGoal, resetGoals } = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getGoals);
router.post("/", saveGoal);
router.post("/reset", resetGoals); // Need POST for action
router.put("/:goal_name", updateGoalProgress);
router.delete("/:goal_name", deleteGoal);

module.exports = router;
