import "./RecruiterDashboard.css";
import { Link } from "react-router-dom";

export default function RecruiterDashboard() {
  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Recruiter</h2>

        <Link to="/recruiter/dashboard">📊 Dashboard</Link>
        <Link to="/recruiter/my-jobs">💼 My Jobs</Link>
        <Link to="/recruiter/add-job">➕ Post Job</Link>
        <Link to="/recruiter/applicants">📥 Applications</Link>
        
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOP BAR */}
        <div className="topbar">
          <h3>Welcome Back 👋</h3>
          <button className="logout">Logout</button>
        </div>

        {/* STATS */}
        <div className="cards">
          <div className="card">
            <h4>Total Jobs</h4>
            <p>12</p>
          </div>

          <div className="card">
            <h4>Applications</h4>
            <p>48</p>
          </div>

          <div className="card">
            <h4>Active Jobs</h4>
            <p>5</p>
          </div>
        </div>

        {/* JOB LIST */}
        <div className="job-section">
          <h3>Your Jobs</h3>

          <div className="job-card">
            <h4>Frontend Developer</h4>
            <p>React | Remote</p>

            <div className="actions">
              <button>Edit</button>
              <button className="delete">Delete</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}