const express = require("express");
const router = express.Router();

const Job = require("../models/job");


// ADD JOB
router.post("/add", async (req, res) => {
  try {

    const { title, company, location, salary, description } = req.body;

    const newJob = new Job({
      title,
      company,
      location,
      salary,
      description
    });

    await newJob.save();

    res.json({
      message: "Job added successfully",
      job: newJob
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


// GET ALL JOBS
router.get("/", async (req, res) => {
  try {

    const jobs = await Job.find();

    res.json(jobs);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// DELETE JOB
router.delete("/:id", async (req, res) => {
  try {

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      message: "Job deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

// UPDATE JOB
router.put("/:id", async (req, res) => {
  try {

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Job updated successfully",
      job: updatedJob
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

module.exports = router;