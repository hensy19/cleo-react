const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Path: /api/auth/signup
router.post("/signup", authController.signup);

// Path: /api/auth/login
router.post("/login", authController.login);

// Path: /api/auth/google
router.post("/google", authController.googleLogin);

// Path: /api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// Path: /api/auth/reset-password
router.post("/reset-password", authController.resetPassword);

module.exports = router;
