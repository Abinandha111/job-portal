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

module.exports = router;