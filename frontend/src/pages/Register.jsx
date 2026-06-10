import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "./data/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address ❌");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        username,
        email,
        password,
        role
      });

      console.log(res.data);
      
      alert("OTP sent to email 📩");
      localStorage.setItem("otpEmail", email);
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      console.log(error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Register failed ❌");
    }
  };
   
  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Create Account</h1>
        <p className="register-subtitle">Join CareerHub and start your journey</p>
        
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="username">Full Name / Username</label>
            <input 
              id="username"
              type="text" 
              placeholder="John Doe" 
              autoComplete="off" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="john@example.com" 
              autoComplete="off" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              autoComplete="new-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password" 
              placeholder="••••••••" 
              autoComplete="new-password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Register As</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
              
            </select>
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
