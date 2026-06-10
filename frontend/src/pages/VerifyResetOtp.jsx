import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "./data/api";
import "./Login.css"; // Reuse login styles

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verified, setVerified] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("resetEmail");

  if (!email) {
    return (
      <div className="login-container">
        <div className="login-box text-center">
          <h1>Session Expired</h1>
          <p className="login-subtitle">Email not found. Please restart the password reset process.</p>
          <Link to="/forgot-password" className="login-btn">Back to Reset</Link>
        </div>
      </div>
    );
  }

  const verifyOtp = async (e) => {
    e.preventDefault();
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
      setVerified(true);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP ❌");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
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
    <div className="login-container">
      <div className="login-box">
        <h1>Verify & Reset</h1>
        <p className="login-subtitle">We sent a verification code to {email}</p>

        {!verified ? (
          <form onSubmit={verifyOtp}>
            <div className="form-group">
              <label htmlFor="otp">Enter 6-Digit OTP</label>
              <input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <button type="submit" className="login-btn">Verify Code</button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Update Password</button>
          </form>
        )}

        <div className="login-footer">
          <p>Remembered password? <Link to="/login">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
}