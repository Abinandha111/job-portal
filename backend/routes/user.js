const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
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

router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const updateData = {
      username,
      email,
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

module.exports = router;