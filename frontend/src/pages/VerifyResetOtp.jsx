import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import API from "./data/api";

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verified, setVerified] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email =
    location.state?.email || localStorage.getItem("resetEmail");

  // ❌ if email not found
  if (!email) {
    return (
      <div>
        <h3>Email not found</h3>
        <p>Please restart forgot password process.</p>
      </div>
    );
  }

  // ✅ VERIFY OTP
  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/verify-reset-otp`, {
        email,
        otp,
      });

      alert(res.data.message || "OTP verified ✅");
      setVerified(true); // unlock password field

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP ❌");
    }
  };

  // ✅ RESET PASSWORD
  const resetPassword = async () => {
    if (!newPassword.trim()) {
      alert("Please enter new password");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/reset-password`, {
        email,
        newPassword,
      });

      alert(res.data.message || "Password reset successful 🎉");

      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Reset failed ❌");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>

      {/* OTP INPUT */}
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={verifyOtp}>Verify OTP</button>

      <br /><br />

      {/* PASSWORD INPUT (LOCKED until OTP verified) */}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        disabled={!verified}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={resetPassword}
        disabled={!verified}
        style={{
          opacity: !verified ? 0.5 : 1,
          cursor: !verified ? "not-allowed" : "pointer",
        }}
      >
        Reset Password
      </button>
    </div>
  );
}