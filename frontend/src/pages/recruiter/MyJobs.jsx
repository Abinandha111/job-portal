import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./MyJobs.css";
import { Link, useNavigate } from "react-router-dom";

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, [token]);

  const fetchMyJobs = async () => {
    try {
      if (!token) return;
      const res = await axios.get(`${API}/api/job/my-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setJobs(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const updateJobStatus = async (jobId, status) => {
    try {
      await axios.put(
        `${API}/api/job/status/${jobId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchMyJobs();
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${API}/api/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Job deleted successfully");
      fetchMyJobs();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const handleEditTitle = async (job) => {
    const newTitle = prompt("Enter new job title", job.title);
    if (!newTitle) return;
    try {
      await axios.put(
        `${API}/api/job/${job._id}`,
        { ...job, title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Title updated successfully");
      fetchMyJobs();
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  if (!user || user.role !== "recruiter") {
    return (
      <div className="unauthorized-container">
        <h2>🚫 Only recruiters can access this page</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h3>Employer Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/recruiter/dashboard" className="nav-item">
            <span className="icon">📊</span> Dashboard
          </Link>
          <Link to="/recruiter/my-jobs" className="nav-item active">
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

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        <div className="main-header">
          <div>
            <h1>Manage Jobs</h1>
            <p>Modify, archive, or check applicants for positions you posted.</p>
          </div>
          <Link to="/recruiter/add-job">
            <button className="post-new-job-btn">+ Post a Job</button>
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-listings-box">
            <span className="empty-icon">💼</span>
            <h3>No Jobs Posted Yet</h3>
            <p>You haven't posted any positions yet. Publish one now to find talent.</p>
            <Link to="/recruiter/add-job">
              <button className="btn-primary">Post Your First Job</button>
            </Link>
          </div>
        ) : (
          <div className="jobs-table-container">
            <table className="jobs-dashboard-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Details</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className="table-job-title-info">
                        <h4>{job.title}</h4>
                        <span className="table-company">{job.company}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-job-meta">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.salary}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-applicants-count">
                        <span className="count-num">{job.applicantsCount || 0}</span>
                        <button 
                          onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                          className="view-applicants-btn-link"
                          disabled={!job.applicantsCount}
                        >
                          View Applicants
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge-table ${job.status}`}>
                        {job.status === "active" ? "Active" : "Closed"}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button onClick={() => handleEditTitle(job)} className="action-icon-btn edit" title="Edit Title">✏️</button>
                        <button onClick={() => handleDelete(job._id)} className="action-icon-btn delete" title="Delete Listing">🗑️</button>
                        
                        {job.status === "active" ? (
                          <button
                            onClick={() => updateJobStatus(job._id, "closed")}
                            className="status-toggle-btn close"
                            title="Close applications"
                          >
                            🔒 Close
                          </button>
                        ) : (
                          <button
                            onClick={() => updateJobStatus(job._id, "active")}
                            className="status-toggle-btn reopen"
                            title="Reopen applications"
                          >
                            🔓 Reopen
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}