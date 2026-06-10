const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleCheck");
const User = require("../models/user");
const Job = require("../models/job");
const Application = require("../models/application");

// Protect all routes under /api/admin
router.use(authMiddleware, roleCheck("admin"));

// GET ADMIN DASHBOARD STATS
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });
    const closedJobs = await Job.countDocuments({ status: "closed" });
    const totalApplications = await Application.countDocuments();

    res.json({
      totalUsers,
      totalRecruiters,
      totalAdmins,
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL USERS FOR MANAGEMENT
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CHANGE USER ROLE
router.put("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "recruiter", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE USER
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Prevent self deletion
    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL JOBS
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "username email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TOGGLE JOB STATUS
router.put("/jobs/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Job status updated successfully", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE JOB
router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id }); // clean up applications
    res.json({ message: "Job and its applications deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
