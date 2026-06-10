const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const applicationRoutes = require("./routes/application");
const jobRoutes = require("./routes/job");
const recruiterRoute = require("./routes/recruiterRoute");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/recruiter", recruiterRoute);
app.use("/api/admin", adminRoutes);
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Health route
app.get("/", (req, res) => {
  res.send("Job Portal Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;

// IMPORTANT: wait for DB before starting server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection failed ❌", err);
  });