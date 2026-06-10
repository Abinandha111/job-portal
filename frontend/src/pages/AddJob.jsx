import { useState } from "react";
import axios from "axios";
import "./AddJob.css";
import { useNavigate, Link } from "react-router-dom";
import API from "./data/api";

export default function AddJob() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API}/api/job/add`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      alert("Job posted successfully ✅");
      navigate("/recruiter/my-jobs");
      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: ""
      });
    } catch (error) {
      console.log(error);
      alert("Failed to post job ❌");
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
          <Link to="/recruiter/my-jobs" className="nav-item">
            <span className="icon">💼</span> My Jobs
          </Link>
          <Link to="/recruiter/add-job" className="nav-item active">
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

      {/* MAIN WORKSPACE */}
      <main className="dashboard-main">
        <div className="main-header">
          <div>
            <h1>Post a Job</h1>
            <p>Fill out the particulars below to publish a new position on the job board.</p>
          </div>
        </div>

        <div className="add-job-form-card">
          <form onSubmit={handleSubmit} className="job-creation-form">
            <div className="form-group">
              <label htmlFor="title">Job Title</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Lead React Engineer"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="e.g. Google"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Job Location</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="e.g. Remote / New York, NY"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary Range</label>
              <input
                id="salary"
                type="text"
                name="salary"
                placeholder="e.g. $130,000 - $160,000"
                value={form.salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe roles, qualifications, benefits, and tech stack details..."
                value={form.description}
                onChange={handleChange}
                rows={8}
                required
              />
            </div>

            <button type="submit" className="submit-job-btn">Publish Position</button>
          </form>
        </div>
      </main>
    </div>
  );
}