const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Application = require("../models/application");

// APPLY FOR JOB
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;

    const newApplication = new Application({
      userId: req.user.userId,
      jobId: jobId
    });

    await newApplication.save();

    res.json({ message: "Applied successfully ✅" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Application failed ❌" });
  }
});

// GET APPLIED JOBS
router.get("/my-applications", authMiddleware, async (req, res) => {

  try {

    const applications = await Application.find({
      userId: req.user.userId
    }).populate("jobId");

    res.json(applications);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

module.exports = router;