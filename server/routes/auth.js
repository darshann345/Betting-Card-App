const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const router = express.Router();


router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      password: hashedPassword,
      balance: 1000,
      totalDeposited: 0,
      gamesPlayed: 0,
      gamesWon: 0,
      totalWinnings: 0,
      isAdmin: false
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        balance: user.balance,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ error: "Server error during registration" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        balance: user.balance,
        totalDeposited: user.totalDeposited,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        totalWinnings: user.totalWinnings,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      username: req.user.username,
      balance: req.user.balance,
      totalDeposited: req.user.totalDeposited,
      gamesPlayed: req.user.gamesPlayed,
      gamesWon: req.user.gamesWon,
      totalWinnings: req.user.totalWinnings,
      isAdmin: req.user.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

module.exports = router;