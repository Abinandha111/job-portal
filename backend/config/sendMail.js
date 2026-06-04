const brevo = require("@getbrevo/brevo");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendOTP = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: "careerhub300@gmail.com",
        name: "Career Hub"
      },
      to: [{ email }],
      subject: "OTP Verification",
      htmlContent: `<h2>Your OTP is: ${otp}</h2>`
    });

    console.log("✅ OTP email sent");
    return true;
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err);
    return false;
  }
};

module.exports = sendOTP;