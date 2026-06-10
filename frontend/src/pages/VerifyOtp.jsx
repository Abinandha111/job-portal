import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import API from "./data/api";
import "./VerifyOtp.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("otpEmail");
  const [canVerify, setCanVerify] = useState(false);

  useEffect(() => {
    setCanVerify(otp.join("").length === 6);
  }, [otp]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    try {
      await axios.post(`${API}/api/auth/verify-otp`, {
        email,
        otp: finalOtp,
      });

      alert("Email verified successfully ✅");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP ❌");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h1>OTP Verification</h1>
        <p className="otp-desc">We sent a 6-digit confirmation code to</p>
        <p className="otp-email-text">{email}</p>

        <form onSubmit={verifyOtp}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className="verify-btn"
            disabled={!canVerify}
          >
            Verify OTP Code
          </button>
        </form>
      </div>
    </div>
  );
}