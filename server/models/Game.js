const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  betAmount: { type: Number, required: true },
  winnings: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["playing", "won", "lost"],
    default: "playing",
  },
  matchedPairs: { type: Number, default: 0 },
  // CHANGE THIS FROM guessesUsed TO attempts
  attempts: { type: Number, default: 0 }, 
  maxGuesses: { type: Number, default: 5 },
  cards: [
    {
      id: String,
      row: { type: String, enum: ["top", "bottom"] },
      value: Number,
      isOpen: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now, expires: 3600 }, 
}, { timestamps: true }); 

module.exports = mongoose.model("Game", gameSchema);