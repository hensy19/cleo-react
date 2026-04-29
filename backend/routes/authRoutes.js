const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Path: /api/auth/signup
router.post("/signup", authController.signup);

// Path: /api/auth/login
router.post("/login", authController.login);

// Path: /api/auth/google
router.post("/google", authController.googleLogin);

module.exports = router;
