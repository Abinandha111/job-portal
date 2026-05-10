import { Link } from "react-router-dom";
import "./Navbar.css"


export default function Navbar() {




  
  return (
    <nav>
      <h1>Job-Portal</h1>

      <div>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/profile">Profile</Link>
        
        
        
      </div>
    </nav>
  );
}

