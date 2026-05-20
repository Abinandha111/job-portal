import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">
          <span>Career</span>Hub
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/jobs" className={location.pathname === "/jobs" ? "active" : ""}>Explore Jobs</Link>
            <Link to="/applied-jobs" className={location.pathname === "/applied-jobs" ? "active" : ""}>My Applications</Link>
            <Link to="/profile" className="profile-btn-nav">
              Profile
            </Link>
            <button onClick={handleLogout} className="logout-btn-nav">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
            <Link to="/register" className="register-btn-nav">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

