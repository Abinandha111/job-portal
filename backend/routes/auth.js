const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const sendOTP = require("../config/sendMail");

const cleanEmail = (email) => email.trim().toLowerCase();

/* =========================
   REGISTER (OTP)
========================= */
router.post("/register", async (req, res) => {
  try {
    let { username, email, password, role } = req.body;

    email = cleanEmail(email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: ["recruiter", "admin"].includes(role) ? role : "user",
      otp,
      otpExpire: Date.now() + 5 * 60 * 1000,
    });

    await user.save();

    await sendOTP(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   VERIFY REGISTER OTP
========================= */
router.post("/verify-otp", async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = cleanEmail(email);

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp != otp ||
      Date.now() > user.otpExpire
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   FORGOT PASSWORD
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: cleanEmail(email) });

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, OTP has been sent",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    const sent = await sendOTP(user.email, otp);

if (!sent) {
  return res.status(500).json({ message: "Email sending failed" });
}


    res.json({ message: "OTP sent for password reset" });

  } catch (err) {
    console.log("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   VERIFY RESET OTP
========================= */
router.post("/verify-reset-otp", async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = cleanEmail(email);

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp != otp ||
      Date.now() > user.otpExpire
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified" });

  } catch (err) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password", async (req, res) => {
  try {
    let { email, newPassword } = req.body;

    email = cleanEmail(email);

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      {
        password: hashed,
        otp: null,
        otpExpire: null
      }
    );

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = cleanEmail(email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   GET USERS
========================= */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;