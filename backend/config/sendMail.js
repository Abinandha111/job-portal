const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "OTP Verification - Career Hub",
      text: `Your OTP is: ${otp}`,
    });

    console.log("OTP email sent successfully");
  } catch (error) {
    console.log("Email send failed:", error.message);
  }
};

module.exports = sendOTP;