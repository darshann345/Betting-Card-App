const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://betting-card-app.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile apps or curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/game", require("./routes/game"));
app.use("/api/admin", require("./routes/admin"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    createAdmin();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const createAdmin = async () => {
  try {
    const existing = await User.findOne({ username: "admin" });
    if (!existing) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        username: "admin",
        password: hashedPassword,
        balance: 100000,
        isAdmin: true,
      });
      await admin.save();
      console.log("Admin user created: admin / admin123");
    }
  } catch (error) {
    console.error("Error creating admin:", error.message);
  }
};

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));