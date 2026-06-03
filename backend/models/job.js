const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  company: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  salary: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {   // ✅ ADD THIS (VERY IMPORTANT)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
  type: String,
  enum: ["active", "closed"],
  default: "active"
}
});

module.exports = mongoose.model("Job", jobSchema);