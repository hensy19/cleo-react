const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../../controllers/admin/adminAuthController");
const { getDashboardStats, getRecentActivity, getMostActiveUsers } = require("../../controllers/admin/adminDashboardController");
const { getAllUsers, toggleUserStatus, deleteUser } = require("../../controllers/admin/userManagementController");
const { getAllTips, createTip, updateTip, deleteTip, updateTipStatus } = require("../../controllers/admin/contentManagementController");
const { getSettings, updateSettings, uploadLogo } = require("../../controllers/admin/settingsController");
const { protectAdmin } = require("../../middleware/admin/adminMiddleware");

// Admin Auth Route
router.post("/login", loginAdmin);

// Admin Dashboard Routes
router.get("/stats", protectAdmin, getDashboardStats);
router.get("/activity", protectAdmin, getRecentActivity);
router.get("/active-users", protectAdmin, getMostActiveUsers);

// Admin Data Routes (Protected!)
router.get("/users", protectAdmin, getAllUsers);
router.put("/users/:id/status", protectAdmin, toggleUserStatus);
router.delete("/users/:id", protectAdmin, deleteUser);

// Tips CMS Routes
router.get("/tips", protectAdmin, getAllTips);
router.post("/tips", protectAdmin, createTip);
router.put("/tips/:id", protectAdmin, updateTip);
router.delete("/tips/:id", protectAdmin, deleteTip);
router.patch("/tips/:id/status", protectAdmin, updateTipStatus);

// Settings Routes
router.get("/settings", protectAdmin, getSettings);
router.put("/settings", protectAdmin, updateSettings);
router.post("/settings/logo", protectAdmin, uploadLogo);

module.exports = router;
