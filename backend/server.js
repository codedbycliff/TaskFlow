
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.MONGO_URI;

// -------------------------
// Environment Check
// -------------------------

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

// -------------------------
// Middleware
// -------------------------

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskflow-frontend-u3q3.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

// -------------------------
// API ROUTES
// -------------------------

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// -------------------------
// Health Check
// -------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TaskFlow API is running 🚀",
  });
});

// -------------------------
// MongoDB Connection
// -------------------------

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};

// -------------------------
// MongoDB Events
// -------------------------

mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connection established");
});

mongoose.connection.on("disconnected", () => {
  console.log("🟡 MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("🔴 MongoDB error:", error.message);
});

// -------------------------
// START SERVER
// -------------------------

const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("================================");
    console.log("🚀 TaskFlow Backend");
    console.log("================================");
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📡 API: /api`);
    console.log("================================");
    console.log("");
  });
};

startServer();
