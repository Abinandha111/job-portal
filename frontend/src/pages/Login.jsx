import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "./data/api";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

     const handleSubmit = async (e) => {
        e.preventDefault();

         try {
        const res = await axios.post(`${API}/api/auth/login`, {
            email,
            password
        });

        console.log(res.data);
        localStorage.setItem("token", res.data.token);


        

        navigate("/jobs");
        } catch (error) {
            console.log(error?.response?.data || error.message);
            alert("Login failed ❌");
        }
    };
    return (

        
        <div className="login-container">
            <div className="login-box">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} autoComplete="off">
                
                    <input type="email" placeholder="Email"  autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input type="password" placeholder="Password"  autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    
                    <button type="submit">Login</button>

                    
            </form>

            <p> Don't have an account?{" "}
                <Link to="/register">Register</Link>
            </p>

            </div>
        </div>
    );
}