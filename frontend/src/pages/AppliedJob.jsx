import { useEffect, useState } from "react";
import axios from "axios";
import API from "./data/api";
import "./AppliedJob.css";
import { Link } from "react-router-dom";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/api/application/my-applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setApplications(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleCancel = async (applicationId) => {
    if (!window.confirm("Are you sure you want to cancel this application?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API}/api/application/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Application cancelled successfully ✅");
      setApplications((prev) =>
        prev.filter((app) => app._id !== applicationId)
      );
    } catch (err) {
      console.log(err);
      alert("Cancel failed ❌");
    }
  };

  return (
    <div className="applied-page">
      <div className="applied-header-section">
        <h1>My Applications</h1>
        <p>Track the progress of positions you have applied to.</p>
      </div>

      {loading ? (
        <div className="loading">Loading applications tracker...</div>
      ) : applications.length > 0 ? (
        <div className="applied-container">
          {applications.map((app) => (
            <div className="applied-card" key={app._id}>
              <div className="card-top-header">
                <div className="card-company-avatar">
                  {app.jobId?.company ? app.jobId.company.substring(0, 1).toUpperCase() : "J"}
                </div>
                <div>
                  <h2>{app.jobId?.title || "Job Deleted"}</h2>
                  <span className="card-company">{app.jobId?.company || "Unknown"}</span>
                </div>
              </div>

              <div className="card-info-details">
                <div className="info-detail-row">
                  <span>📍 Location:</span>
                  <strong>{app.jobId?.location || "N/A"}</strong>
                </div>
                <div className="info-detail-row">
                  <span>💰 Salary:</span>
                  <strong>{app.jobId?.salary || "N/A"}</strong>
                </div>
                <div className="info-detail-row status">
                  <span>Progress:</span>
                  <span className={`status-badge-app ${app.status}`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="cancel-application-btn"
                  onClick={() => handleCancel(app._id)}
                >
                  Cancel Application
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-tracker-box">
          <span className="empty-tracker-icon">📄</span>
          <h3>No Applications Yet</h3>
          <p>You haven't applied to any positions yet. Explore jobs to find opportunities.</p>
          <Link to="/jobs">
            <button className="btn-primary">Explore Jobs</button>
          </Link>
        </div>
      )}
    </div>
  );
}
