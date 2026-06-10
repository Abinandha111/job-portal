import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API from "./data/api";
import "./Login.css"; // Reuse login styles

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter email");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/forgot-password`, {
        email: email.trim(),
      });

      alert(res.data.message || "OTP sent 📩");
      navigate("/verify-reset-otp", { state: { email: email.trim() } });
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP ❌");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Reset Password</h1>
        <p className="login-subtitle">We will send you a 6-digit OTP code to reset your password.</p>
        
        <form onSubmit={sendOtp}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Send OTP Code</button>
        </form>

        <div className="login-footer">
          <p>Remembered password? <Link to="/login">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
}