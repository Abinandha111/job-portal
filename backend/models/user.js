const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
   image: {
    type: String,
    default: ""
  },
  phone: {
  type: String,
  default: ""
},

resume: {
  type: String,
  default: ""
},

bio: {
  type: String,
  default: ""
},

skills: {
  type: String,
  default: ""
},
savedJobs: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }
],

appliedJobs: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }
],



role: {
    type: String,
    enum: ["user", "recruiter", "admin"],
    default: "user"
  },
});

module.exports = mongoose.model("User", userSchema);