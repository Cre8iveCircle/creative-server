const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
const dnsPromises = require("node:dns/promises");
require("dotenv").config();

// DNS configuration (helps with some MongoDB Atlas DNS issues)
dnsPromises.setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/payment", require("./routes/payment"));

// Health check
app.get("/", (req, res) => {
  res.send("Creative Server is running 🚀");
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI_LOCAL) {
      throw new Error("MONGO_URI_LOCAL is not defined in your .env file.");
    }

    await mongoose.connect(process.env.MONGO_URI_LOCAL);

    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();