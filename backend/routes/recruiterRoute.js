const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Job = require("../models/job");
const Application = require("../models/application");

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const recruiterId = req.user.userId;

    // 1. jobs created by recruiter
    const totalJobs = await Job.countDocuments({
      createdBy: recruiterId
    });

    // 2. get recruiter jobs
    const jobs = await Job.find({ createdBy: recruiterId }).select("_id");

    const jobIds = jobs.map(job => job._id);

    // 3. total applicants for recruiter jobs
    const totalApplicants = await Application.countDocuments({
      jobId: { $in: jobIds }
    });

    const activeJobs = await Job.countDocuments({
  createdBy: recruiterId,
  status: "active"
});

const closedJobs = await Job.countDocuments({
  createdBy: recruiterId,
  status: "closed"
});

    res.json({
      totalJobs,
      totalApplicants,
      activeJobs,
      closedJobs

    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

router.get("/applicants", authMiddleware, async (req, res) => {
  try {
    const recruiterId = req.user.userId;

    // 1. find recruiter jobs
    const jobs = await Job.find({ createdBy: recruiterId }).select("_id");
    const jobIds = jobs.map(job => job._id);

    // 2. get applications only for those jobs
    const applicants = await Application.find({
      jobId: { $in: jobIds }
    })
      .populate("userId", "username email image bio phone skills resume")
      .populate("jobId", "title");

    res.json(applicants);

  } catch (err) {
    res.status(500).json({ message: "Error fetching applicants" });
  }
});

module.exports = router;