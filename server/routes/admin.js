const express = require("express");
const { auth, adminAuth } = require("../middleware/auth");
const User = require("../models/User");
const Game = require("../models/Game");

const router = express.Router();






router.get("/stats", auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false }); 
    
    const financeStats = await User.aggregate([
      {
        $match: { isAdmin: false } 
      },
      {
        $group: {
          _id: null,
          totalUserBalances: { $sum: "$balance" },
          totalDeposited: { $sum: "$totalDeposited" },
          totalWithdrawn: { $sum: "$totalWithdrawn"}
        }
      }
    ]);

    const stats = financeStats[0] || { totalUserBalances: 0, totalDeposited: 0 };

    res.json({
      totalUsers,
      totalBalance: stats.totalUserBalances, 
      totalDeposited: stats.totalDeposited
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});



router.put("/users/:id/balance", auth, adminAuth, async (req, res) => {
  try {
    const { balance } = req.body;

    if (balance < 0) {
      return res.status(400).json({ error: "Balance cannot be negative" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.balance = balance;
    await user.save();

    res.json({
      message: `Balance for ${user.username} updated to ₹${balance}`,
      user: {
        id: user._id,
        username: user.username,
        balance: user.balance
      }
    });

  } catch (error) {
    console.error("Admin Balance Update Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/recent-games", auth, adminAuth, async (req, res) => {
  try {
    const games = await Game.find()
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;