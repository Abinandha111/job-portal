const nodemailer = require("nodemailer");

console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log("❌ EMAIL_USER or EMAIL_PASS missing");
}



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

const sendOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    console.log("✅ OTP email sent:", info.messageId);
    return true;
  } catch (err) {
    console.log("❌ EMAIL FAILED:", err);
    return false;
  }
};

module.exports = sendOTP;