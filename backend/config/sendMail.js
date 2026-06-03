const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  console.log("❌ RESEND_API_KEY missing");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {

    const response = await resend.emails.send({
      from: "Job Portal <onboarding@resend.dev>",
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is: ${otp}</h2>`
    });

    console.log("✅ OTP email sent:", response);
    return true;

  } catch (err) {
    console.log("❌ EMAIL FAILED:", err);
    return false;
  }
};

module.exports = sendOTP;