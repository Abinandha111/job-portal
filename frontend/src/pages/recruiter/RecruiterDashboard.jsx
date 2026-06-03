import { useEffect, useState } from "react";
import "./RecruiterDashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import API from "../data/api";




export default function RecruiterDashboard() {

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    activeJobs: 0,
    closedJobs: 0
  });

  // ✅ FUNCTION (INSIDE SAME COMPONENT)
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
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Recruiter</h2>

        <Link to="/recruiter/dashboard">📊 Dashboard</Link>
        <Link to="/recruiter/my-jobs">💼 My Jobs</Link>
        <Link to="/recruiter/add-job">➕ Post Job</Link>
        <Link to="/recruiter/applicants">📥 Applications</Link>
        <Link to="/recruiter/profile">👤 Profile</Link>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <h3>Welcome Back 👋</h3>
          
        </div>

        {/* STATS */}
        <div className="cards">

          <div className="card">
            <h4>Total Jobs</h4>
            <p>{stats.totalJobs}</p>
          </div>

          <div className="card">
            <h4>Applications</h4>
            <p>{stats.totalApplicants}</p>
          </div>

          <div className="card">
  <h4>Active Jobs</h4>
  <p>{stats.activeJobs}</p>
</div>

<div className="card">
  <h4>Closed Jobs</h4>
  <p>{stats.closedJobs}</p>
</div>

          

          

        </div>

      </div>
    </div>
  );

}