const sendOTP = async (email, otp) => {
  try {
    console.log("➡️ Sending OTP to:", email);
    console.log("➡️ RESEND KEY EXISTS:", !!process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "Career Hub <onboarding@resend.dev>",
      to: email,
      subject: "OTP Verification - Career Hub",
      text: `Your OTP is: ${otp}`,
    });

    console.log("📩 FULL RESEND RESPONSE:", result);

  } catch (error) {
    console.log("❌ EMAIL FAILED FULL ERROR:", error);
  }
};

module.exports = sendOTP;