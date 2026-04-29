const express = require("express");
const router = express.Router();
const { getPeriods, logPeriod, updatePeriod, deletePeriod } = require("../controllers/periodController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getPeriods);
router.post("/", logPeriod);
router.put("/:id", updatePeriod);
router.delete("/:id", deletePeriod);

module.exports = router;
