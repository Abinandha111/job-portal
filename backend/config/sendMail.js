const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {

    if (!process.env.RESEND_API_KEY) {
      console.log("❌ RESEND_API_KEY NOT FOUND");
      return false;
    }

    const data = await resend.emails.send({
      from: "Job Portal <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: ${otp}</h3>`
    });

    console.log("✅ OTP email sent:", data);
    return true;

  } catch (err) {
    console.log("❌ EMAIL FAILED FULL ERROR:", err);
    return false;
  }
};

module.exports = sendOTP;