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

  const email =
    location.state?.email || localStorage.getItem("otpEmail");

  const [canVerify, setCanVerify] = useState(false);

  // enable verify button
  useEffect(() => {
    setCanVerify(otp.join("").length === 6);
  }, [otp]);

  // OTP input
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

  // VERIFY OTP
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    try {
      await axios.post(`${API}/api/auth/verify-otp`, {
        email,
        otp: finalOtp,
      });

      alert("Verified Successfully ✅");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP ❌");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">

        <h2>OTP Verification</h2>
        <p>Enter the 6-digit code sent to</p>
        <p className="email">{email}</p>

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
            />
          ))}
        </div>

        <button
          onClick={verifyOtp}
          disabled={!canVerify}
          style={{
            opacity: !canVerify ? 0.5 : 1,
            cursor: !canVerify ? "not-allowed" : "pointer",
          }}
        >
          Verify OTP
        </button>

      </div>
    </div>
  );
}