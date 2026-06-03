const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const sendOTP = require("../config/sendMail");

const cleanEmail = (email) => email.trim().toLowerCase();

let otpStore = {};

/* =========================
   AUTO CLEANUP HELPER
========================= */
const setOtpExpiry = (email, time = 5 * 60 * 1000) => {
  setTimeout(() => {
    delete otpStore[email];
  }, time);
};

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    let { username, email, password ,role } = req.body;

    email = cleanEmail(email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = {
      otp,
      type: "register",
      username,
      email,
      password,
      expiresAt: Date.now() + 5 * 60 * 1000,
      role: role === "recruiter" ? "recruiter" : "user"
    };

    setOtpExpiry(email);

    await sendOTP(email, otp);

    res.json({ message: "OTP sent to email" });

  } catch (error) {
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

    const data = otpStore[email];

    if (
      !data ||
      data.type !== "register" ||
      data.otp != otp ||
      Date.now() > data.expiresAt
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: data.role
    });

    await newUser.save();

    delete otpStore[email];

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

    const user = await User.findOne({ email });

    // always respond same (security best practice)
    if (!user) {
      return res.status(200).json({
        message: "If this email exists, OTP has been sent",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // store in DB (NO external functions needed)
    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    // OPTIONAL: only if sendOTP exists safely
    if (typeof sendOTP === "function") {
      //await sendOTP(email, otp);
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

    const data = otpStore[email];

    if (
      !data ||
      data.type !== "reset" ||
      data.otp != otp ||
      Date.now() > data.expiresAt
    ) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified" });

  } catch (err) {
    res.status(500).json({ message: "Error" });
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
      { password: hashed }
    );

    delete otpStore[email];

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Error" });
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
      { userId: user._id },
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
  const users = await User.find();
  res.json(users);
});

module.exports = router;