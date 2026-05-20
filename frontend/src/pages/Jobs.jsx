import "./Jobs.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "./data/api";

export default function Jobs() {
    const location = useLocation();
    const [search, setSearch] = useState(location.state?.initialSearch || "");
    const [jobs, setJobs] = useState([]);

    useEffect(() => {

  const fetchJobs = async () => {

    try {

      const res = await axios.get(
        `${API}/api/job`
      );

      setJobs(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  fetchJobs();

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

  try {

    await axios.delete(`${API}/api/job/${id}`);

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
    });

    alert("Job updated successfully ✅");

    setJobs(
      jobs.map((j) =>
        j._id === job._id
          ? { ...j, title: newTitle }
          : j
      )
    );

  } catch (error) {

    console.log(error);
    alert("Update failed ❌");

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
          <Link to="/add-job">
            <button className="add-job-btn"><span>+</span> Post a Job</button>
          </Link>
          <Link to="/applied-jobs">
            <button className="applied-jobs-btn">My Applications</button>
          </Link>
        </div>
      </div>

      <div className="search-box">
        <div className="search-bar-inner">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search positions by title, company name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="jobs-container">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="card-accent-line"></div>
              <div className="job-card-header">
                <h2>{job.title}</h2>
                <span className="company-badge">{job.company}</span>
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
                {job.description && (
                  <p className="job-description-preview">{job.description}</p>
                )}
              </div>
              
              <div className="job-card-actions">
                <button className="apply-btn" onClick={() => handleApply(job._id)}>Apply Now</button>
                <div className="admin-actions">
                  <button className="edit-btn-job" onClick={() => handleEdit(job)} title="Edit Title">✏️</button>
                  <button className="delete-btn-job" onClick={() => handleDelete(job._id)} title="Delete Job">🗑️</button>
                </div>
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