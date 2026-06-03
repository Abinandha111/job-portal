const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    const result = await resend.emails.send({
      from: "Career Hub <onboarding@resend.dev>",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    });

    console.log("EMAIL RESPONSE:", result);
  } catch (error) {
    console.log("EMAIL FAILED:", error);
  }
};

module.exports = sendOTP;