import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/jobs", { state: { initialSearch: searchQuery } });
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        {/* Left Column - Content */}
        <div className="hero-content">
          <div className="badge-new">✨ Discover Your Future</div>
          <h1>
            Find your <span>dream job</span> here!
          </h1>
          <p>
            Explore thousands of job opportunities with top companies. CareerHub is the most advanced job board connecting top talent with industry leaders.
          </p>

          <form className="hero-search-box" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Job title, company, or keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn">Search</button>
          </form>

          <div className="hero-actions">
            <Link to="/jobs">
              <button className="explore-btn">Explore Jobs</button>
            </Link>
            <Link to="/login">
              <button className="login-btn-home">Sign In</button>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <h3>12k+</h3>
              <p>Active Jobs</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>8k+</h3>
              <p>Companies</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h3>150k+</h3>
              <p>Candidates</p>
            </div>
          </div>
        </div>

        {/* Right Column - Visual Float Elements */}
        <div className="hero-visual">
          <div className="glowing-orb"></div>
          
          <div className="floating-card card-1">
            <div className="card-header">
              <span className="company-logo google">G</span>
              <div>
                <h4>Senior React Developer</h4>
                <p>Google Inc. • Remote</p>
              </div>
            </div>
            <div className="card-tags">
              <span>React</span>
              <span>$140k - $180k</span>
            </div>
          </div>

          <div className="floating-card card-2">
            <div className="card-header">
              <span className="company-logo figma">F</span>
              <div>
                <h4>UI/UX Designer</h4>
                <p>Figma • London, UK</p>
              </div>
            </div>
            <div className="card-tags">
              <span>Framer</span>
              <span>$110k - $130k</span>
            </div>
          </div>

          <div className="floating-card card-3">
            <div className="card-header">
              <span className="company-logo stripe">S</span>
              <div>
                <h4>Backend Engineer</h4>
                <p>Stripe • San Francisco</p>
              </div>
            </div>
            <div className="card-tags">
              <span>Node.js</span>
              <span>$150k - $190k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}