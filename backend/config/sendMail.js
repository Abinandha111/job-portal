const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendOTP = async (email, otp) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Job Portal",
        email: "careerhub300@gmail.com",
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "OTP Verification",
      htmlContent: `<h2>Your OTP is: ${otp}</h2>`,
    });

    console.log("✅ OTP email sent:", result);
    return true;
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err);
    return false;
  }
};

module.exports = sendOTP;