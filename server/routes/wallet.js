const express = require("express");
const { auth } = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();


router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid amount provided" });
    }

    if (amount < 10 || amount > 50000) {
      return res
        .status(400)
        .json({ error: "Deposit must be between ₹10 and ₹50,000" });
    }

    
    req.user.balance += Number(amount);
    req.user.totalDeposited += Number(amount);

    await req.user.save();

    res.json({
      message: `₹${amount.toLocaleString()} added to your wallet successfully!`,
      balance: req.user.balance,
      totalDeposited: req.user.totalDeposited,
    });

  } catch (error) {
    console.error("Deposit Error:", error.message);
    res.status(500).json({ error: "Internal server error during deposit" });
  }
});


router.get("/", auth, async (req, res) => {
  try {
    res.json({
      balance: req.user.balance,
      totalDeposited: req.user.totalDeposited,
      gamesPlayed: req.user.gamesPlayed,
      totalWinnings: req.user.totalWinnings,
      totalWithdrawn: req.user.totalWithdrawn
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wallet information" });
  }
});



router.post("/withdraw", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const withdrawAmount = Number(amount);

    if (!withdrawAmount || isNaN(withdrawAmount)) {
      return res.status(400).json({ error: "Please enter a valid amount" });
    }

    if (withdrawAmount < 100) {
      return res.status(400).json({ error: "Minimum withdrawal amount is ₹100" });
    }

    if (withdrawAmount > 25000) {
      return res.status(400).json({ error: "Maximum withdrawal per transaction is ₹25,000" });
    }

    if (req.user.balance < withdrawAmount) {
      return res.status(400).json({ 
        error: "Insufficient balance", 
        currentBalance: req.user.balance 
      });
    }

    
    console.log("Before Balance:", req.user.balance);
console.log("Before Withdrawn:", req.user.totalWithdrawn);

req.user.balance -= withdrawAmount;
req.user.totalWithdrawn = (req.user.totalWithdrawn || 0) + withdrawAmount;

await req.user.save();

console.log("After Balance:", req.user.balance);
console.log("After Withdrawn:", req.user.totalWithdrawn);

    res.json({
      message: `Withdrawal of ₹${withdrawAmount.toLocaleString()} successful!`,
      newBalance: req.user.balance,
      totalWithdrawn: req.user.totalWithdrawn,
      transactionDate: new Date()
    });

  } catch (error) {
    console.error("Withdrawal Error:", error.message);
    res.status(500).json({ error: "Internal server error during withdrawal" });
  }
});

module.exports = router;