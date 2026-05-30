import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "./data/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
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
    <div>
      <h2>Forgot Password</h2>

      <input
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={sendOtp}>Send OTP</button>
    </div>
  );
}