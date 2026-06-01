const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },

  appliedAt: {
    type: Date,
    default: Date.now
  },

  status: {
  type: String,
  enum: ["pending", "shortlisted", "rejected"],
  default: "pending"
}

});

module.exports = mongoose.model(
  "Application",
  applicationSchema
);