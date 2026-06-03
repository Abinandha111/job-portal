const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const Application = require("../models/application");
const roleCheck  = require("../middleware/roleCheck");

const resume = require("../middleware/resume");

const Job = require("../models/job");


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

     const appliedCount = await Application.countDocuments({
      userId: req.user.userId
    });

     res.json({
      ...user.toObject(),
      appliedCount
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        { image: req.file.filename },
        { new: true }
      );

      res.json({
        message: "Image uploaded successfully",
        image: req.file.filename,
      });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

router.post(
  "/upload-resume",
  authMiddleware,
  resume.single("resume"),
  async (req, res) => {
    try {

      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          resume: `http://localhost:5000/upload/${req.file.filename}`
        },
        { new: true }
      );

      res.json({
        message: "Resume uploaded successfully",
        resume: user.resume
      });

    } catch (error) {

      res.status(500).json({
        error: error.message
      });

    }
  }
);

router.delete("/delete-resume", authMiddleware, async (req, res) => {
  try {

    await User.findByIdAndUpdate(
      req.user.userId,
      {
        resume: ""
      }
    );

    res.json({
      message: "Resume deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed"
    });
  }
});

const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const resume = req.file ? req.file.filename : null;

    const application = new Application({
      jobId,
      userId: req.user.userId,
      resume,
    });

    await application.save();

    res.json({ message: "Applied successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Apply failed" });
  }
};

router.post(
  "/apply/:jobId",
  authMiddleware,
  roleCheck("user"),
  resume.single("resume"),
  applyJob
);

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { username, email, password , phone, skills, bio} = req.body;

    const updateData = {
      username,
      email,
      phone,
      skills,
      bio
    };

    // PASSWORD UPDATE
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      updateData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});



router.put("/saved-jobs/:jobId", authMiddleware, async (req, res) => {
  console.log("PARAMS:", req.params);
console.log("BODY:", req.body);
  try {

    // 1. find user
    const user = await User.findById(req.user.userId);

    // 2. get job id from URL
    const jobId = req.params.jobId;

    // 3. check already saved or not
    if (user.savedJobs.some(id => id.toString() === jobId)) {
      return res.json({ message: "Already saved" });
    }

    // 4. add job to saved list
    user.savedJobs.push(jobId);

    // 5. save user
    await user.save();

    res.json({ message: "Job saved successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

router.get("/saved-jobs", authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.userId)
      .populate("savedJobs"); // job details get cheyyum

    res.json(user.savedJobs);

  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

router.put("/unsave-job/:jobId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    user.savedJobs = user.savedJobs.filter(
      (id) => id.toString() !== req.params.jobId
    );

    await user.save();

    res.json({ message: "Job removed from saved list" });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);

    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;