const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Application = require("../models/application");
const Job = require("../models/job");

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

router.put("/status/:id", authMiddleware, async (req, res) => {
  try {

    const { status } = req.body;

    const allowedStatus = ["pending", "shortlisted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Not found" });
    }

    if (application.jobId.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: "Status updated successfully",
      application
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/recruiter/applicants", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId });

    const jobIds = jobs.map(job => job._id);

    const applicants = await Application.find({
      jobId: { $in: jobIds }
    })
    .populate("userId", "name email phone skills resume")
    .populate("jobId", "title company");

    res.json(applicants);

  } catch (err) {
    res.status(500).json({ message: "Error fetching applicants" });
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

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Not found" });
    }

    if (application.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;