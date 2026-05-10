import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "./data/api";

export default function Register() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        const res = await axios.post(`${API}/api/auth/register`, {
            username,
            email,
            password
        });

        console.log(res.data);
        
        navigate("/login");

    } catch (error) {
  console.log(error?.response?.data || error.message);
  alert("Register failed ❌");
}
    };
     
    return (
        <div className="register-container">
            <div className="register-box">
                <h1>Register</h1>
                
                <form onSubmit={handleSubmit} autoComplete="off">
                    <input type="text" placeholder="Username" autoComplete="off" value={username} onChange={(e) => setUsername(e.target.value)} />

                    <input type="email" placeholder="Email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input type="password" placeholder="Password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button type="submit">Register</button>
                </form>

                 <p>Already have an account? {" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}
