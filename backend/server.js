const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const applicationRoutes = require("./routes/application");

const jobRoutes = require("./routes/job");







const app=express();


connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/api/user", userRoutes);

app.use("/api/application", applicationRoutes);

app.use("/api/job", jobRoutes);





app.get("/", (req, res) => {
  res.send("Job Portal Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});