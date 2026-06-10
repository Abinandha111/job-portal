import "./Jobs.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "./data/api";

export default function Jobs() {
  const location = useLocation();
  const [search, setSearch] = useState(location.state?.initialSearch || "");
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API}/api/job`);
        setJobs(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API}/api/user/saved-jobs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSavedJobs(res.data.map((job) => job._id));
      } catch (err) {
        console.log(err);
      }
    };
    fetchSavedJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/application/apply`,
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Applied successfully ✅");
    } catch (error) {
      console.log(error);
      alert("Already applied or error ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${API}/api/job/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Job deleted successfully ✅");
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.log(error);
      alert("Delete failed ❌");
    }
  };

  const handleEdit = async (job) => {
    const newTitle = prompt("Enter new title", job.title);
    if (!newTitle) return;
    try {
      await axios.put(`${API}/api/job/${job._id}`, {
        ...job,
        title: newTitle
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Job updated successfully ✅");
      setJobs(
        jobs.map((j) =>
          j._id === job._id ? { ...j, title: newTitle } : j
        )
      );
    } catch (error) {
      console.log(error);
      alert("Update failed ❌");
    }
  };

  const toggleSave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const isSaved = savedJobs.includes(jobId);

      if (isSaved) {
        await axios.put(
          `${API}/api/user/unsave-job/${jobId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSavedJobs((prev) => prev.filter((id) => id !== jobId));
      } else {
        await axios.put(
          `${API}/api/user/saved-jobs/${jobId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSavedJobs((prev) => [...prev, jobId]);
      }
    } catch (err) {
      console.log(err);
      alert("Error in saving job");
    }
  };

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div className="header-text">
          <h1 className="title">Available Positions</h1>
          <p className="subtitle">Discover jobs aligned with your expertise and aspirations</p>
        </div>
        <div className="header-actions-bar">
          {user?.role === "recruiter" && (
            <Link to="/recruiter/add-job">
              <button className="add-job-btn">+ Post a Job</button>
            </Link>
          )}
        </div>
      </div>

      <div className="search-box">
        <div className="search-bar-inner">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search positions by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="jobs-container">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-card-main">
                <div className="job-card-header">
                  <div className="job-company-avatar">
                    {job.company.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="job-title-info">
                    <h2>{job.title}</h2>
                    <span className="company-badge">{job.company}</span>
                  </div>
                </div>

                <div className="job-card-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{job.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span className="detail-text">{job.salary || "Not Specified"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💼</span>
                    <span className="detail-text status-text">
                      Status: <span className={`status-badge ${job.status}`}>{job.status}</span>
                    </span>
                  </div>
                  {job.description && (
                    <p className="job-description-preview">{job.description}</p>
                  )}
                </div>
              </div>

              <div className="job-card-actions">
                {user?.role === "user" && (
                  <>
                    {job.status === "active" ? (
                      <button
                        className="apply-btn"
                        onClick={() => handleApply(job._id)}
                      >
                        Apply Now
                      </button>
                    ) : (
                      <button
                        className="apply-btn closed"
                        disabled
                      >
                        Closed
                      </button>
                    )}
                    <button
                      className={`save-btn ${savedJobs.includes(job._id) ? "saved" : ""}`}
                      onClick={() => toggleSave(job._id)}
                    >
                      {savedJobs.includes(job._id) ? "❤️ Saved" : "🤍 Save"}
                    </button>
                  </>
                )}

                {user?.role === "recruiter" && (
                  <div className="admin-actions">
                    <button className="edit-btn-job" onClick={() => handleEdit(job)} title="Edit Title">✏️ Edit</button>
                    <button className="delete-btn-job" onClick={() => handleDelete(job._id)} title="Delete Job">🗑️ Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No jobs matching "{search}" found 😢</p>
          </div>
        )}
      </div>
    </div>
  );
}