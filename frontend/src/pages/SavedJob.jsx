import { useEffect, useState } from "react";
import axios from "axios";
import API from "./data/api";
import "./AppliedJob.css";
import { Link } from "react-router-dom";

export default function SavedJob() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/api/user/saved-jobs`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSavedJobs(res.data.savedJobs || res.data || []);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/api/user/unsave-job/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Removed from saved positions ✅");
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.log(err);
      alert("Unsave failed ❌");
    }
  };

  return (
    <div className="applied-page">
      <div className="applied-header-section">
        <h1>Saved Positions</h1>
        <p>Your curated bookmark list of job openings to apply to later.</p>
      </div>

      {loading ? (
        <div className="loading">Loading saved vacancies...</div>
      ) : savedJobs.length > 0 ? (
        <div className="applied-container">
          {savedJobs.map((job) => (
            <div className="applied-card" key={job._id}>
              <div className="card-top-header">
                <div className="card-company-avatar">
                  {job.company ? job.company.substring(0, 1).toUpperCase() : "J"}
                </div>
                <div>
                  <h2>{job.title || "No Title"}</h2>
                  <span className="card-company">{job.company || "Unknown Company"}</span>
                </div>
              </div>

              <div className="card-info-details">
                <div className="info-detail-row">
                  <span>📍 Location:</span>
                  <strong>{job.location || "N/A"}</strong>
                </div>
                <div className="info-detail-row">
                  <span>💰 Salary:</span>
                  <strong>{job.salary || "N/A"}</strong>
                </div>
                <div className="info-detail-row status">
                  <span>Status:</span>
                  <span className={`status-badge-app ${job.status || "active"}`}>
                    {job.status || "active"}
                  </span>
                </div>
              </div>

              <div className="card-actions">
                <Link to="/jobs" className="card-action-apply-link">
                  Apply Now
                </Link>
                <button
                  className="unsave-application-btn"
                  onClick={() => handleUnsave(job._id)}
                >
                  Remove Bookmark
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-tracker-box">
          <span className="empty-tracker-icon">❤️</span>
          <h3>No Saved Positions</h3>
          <p>You haven't saved any positions yet. Explore jobs to find opportunities.</p>
          <Link to="/jobs">
            <button className="btn-primary">Explore Jobs</button>
          </Link>
        </div>
      )}
    </div>
  );
}