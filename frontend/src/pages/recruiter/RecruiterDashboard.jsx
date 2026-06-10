import { useEffect, useState } from "react";
import "./RecruiterDashboard.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../data/api";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0,
    closedJobs: 0
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/api/recruiter/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setStats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h3>Employer Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/recruiter/dashboard" className="nav-item active">
            <span className="icon">📊</span> Dashboard
          </Link>
          <Link to="/recruiter/my-jobs" className="nav-item">
            <span className="icon">💼</span> My Jobs
          </Link>
          <Link to="/recruiter/add-job" className="nav-item">
            <span className="icon">➕</span> Post Job
          </Link>
          <Link to="/recruiter/applicants" className="nav-item">
            <span className="icon">📥</span> Applications
          </Link>
          <Link to="/recruiter/profile" className="nav-item">
            <span className="icon">👤</span> Profile
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-topbar">
          <div className="greeting-message">
            <h1>Welcome Back, {user?.username || "Recruiter"} 👋</h1>
            <p>Here is what's happening with your job postings today.</p>
          </div>
        </header>

        {/* METRICS GRID */}
        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Total Postings</span>
              <span className="metric-icon blue">💼</span>
            </div>
            <p className="metric-value">{stats.totalJobs}</p>
            <span className="metric-trend text-muted">All-time postings</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Total Applicants</span>
              <span className="metric-icon purple">👥</span>
            </div>
            <p className="metric-value">{stats.totalApplicants}</p>
            <span className="metric-trend text-muted">Candidates applied</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Active Vacancies</span>
              <span className="metric-icon green">🟢</span>
            </div>
            <p className="metric-value">{stats.activeJobs}</p>
            <span className="metric-trend text-success">Open for applications</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-title">Closed Positions</span>
              <span className="metric-icon red">🔴</span>
            </div>
            <p className="metric-value">{stats.closedJobs}</p>
            <span className="metric-trend text-danger">Archived postings</span>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="dashboard-quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-button-group">
            <Link to="/recruiter/add-job" className="action-btn-link">
              <div className="action-card">
                <span className="action-card-icon">➕</span>
                <div>
                  <h3>Post a New Position</h3>
                  <p>Publish a job listing to search for candidates.</p>
                </div>
              </div>
            </Link>
            <Link to="/recruiter/applicants" className="action-btn-link">
              <div className="action-card">
                <span className="action-card-icon">📥</span>
                <div>
                  <h3>Review Applicants</h3>
                  <p>Screen candidates who applied to your jobs.</p>
                </div>
              </div>
            </Link>
            <Link to="/recruiter/my-jobs" className="action-btn-link">
              <div className="action-card">
                <span className="action-card-icon">💼</span>
                <div>
                  <h3>Manage Active Listings</h3>
                  <p>Modify titles, update descriptions, or close postings.</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}