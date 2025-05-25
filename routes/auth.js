// routes/auth.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get('/check-auth',checkAuth);

module.exports = router;
 