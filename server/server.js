const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Import routes file
const setupRoutes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/adminuser", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.error("MongoDB connection error:", err));

// Setup all routes
setupRoutes(app);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});