import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        setUser(storedUser);
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
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
            {user?.role === "user" && (
              <>
                <Link to="/jobs" className={location.pathname === "/jobs" ? "active" : ""}>Explore Jobs</Link>
                <Link to="/applied-jobs" className={location.pathname === "/applied-jobs" ? "active" : ""}>Applied Jobs</Link>
                <Link to="/saved-jobs" className={location.pathname === "/saved-jobs" ? "active" : ""}>Saved Jobs</Link>
                <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>Profile</Link>
              </>
            )}

            {user?.role === "recruiter" && (
              <>
                <Link to="/recruiter/dashboard" className={location.pathname === "/recruiter/dashboard" ? "active" : ""}>Dashboard</Link>
                <Link to="/recruiter/my-jobs" className={location.pathname === "/recruiter/my-jobs" ? "active" : ""}>My Jobs</Link>
                <Link to="/recruiter/applicants" className={location.pathname.startsWith("/recruiter/applicants") || location.pathname === "/recruiter/applicants" ? "active" : ""}>Applicants</Link>
                <Link to="/recruiter/profile" className={location.pathname === "/recruiter/profile" ? "active" : ""}>Profile</Link>
              </>
            )}

           

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
