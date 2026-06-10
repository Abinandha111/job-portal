import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./Applicants.css";
import { useParams, Link } from "react-router-dom";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { jobId } = useParams();

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/api/application/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(`Application marked as ${status} ✅`);

      setApplicants((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status } : a
        )
      );
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/recruiter/applicants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (jobId) {
          const filtered = res.data.filter((app) => app.jobId?._id === jobId);
          setApplicants(filtered);
        } else {
          setApplicants(res.data);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const filteredApplicants = applicants.filter(
    (app) =>
      app.userId?.username?.toLowerCase().includes(search.toLowerCase()) ||
      app.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.jobId?.title?.toLowerCase().includes(search.toLowerCase())
  );

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
          <Link to="/recruiter/add-job" className="nav-item">
            <span className="icon">➕</span> Post Job
          </Link>
          <Link to="/recruiter/applicants" className="nav-item active">
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
            <h1>Candidate Applications</h1>
            <p>Review candidate profiles, download CV resumes, and update application status.</p>
          </div>
        </div>

        <div className="search-box">
          <div className="search-bar-inner">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by candidate name, email, or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading applicant profiles...</div>
        ) : filteredApplicants.length === 0 ? (
          <div className="empty-applicants-box">
            <span className="empty-icon">👥</span>
            <h3>No Applicants Found</h3>
            <p>There are no applications matching your filter criteria right now.</p>
          </div>
        ) : (
          <div className="applicants-grid">
            {filteredApplicants.map((app) => (
              <div key={app._id} className="applicant-profile-card">
                <div className="applicant-header">
                  <img 
                    src={app.userId?.image ? `${API}/upload/${app.userId.image}` : "https://ui-avatars.com/api/?name=User&background=random"} 
                    alt={app.userId?.username || "Candidate"} 
                    className="applicant-photo"
                  />
                  <div>
                    <h3>{app.userId?.username || "Anonymous Candidate"}</h3>
                    <p className="app-sub-text">{app.userId?.email || "No email provided"}</p>
                  </div>
                  <span className={`status-badge-app ${app.status}`}>
                    {app.status}
                  </span>
                </div>

                <div className="applicant-body">
                  <div className="body-info-item">
                    <span className="info-label">Applied For:</span>
                    <span className="info-val job-name">{app.jobId?.title || "Job deleted"}</span>
                  </div>

                  {app.userId?.phone && (
                    <div className="body-info-item">
                      <span className="info-label">Phone:</span>
                      <span className="info-val">{app.userId.phone}</span>
                    </div>
                  )}

                  {app.userId?.skills && (
                    <div className="body-info-item skills">
                      <span className="info-label">Skills:</span>
                      <div className="skills-tags-mini">
                        {app.userId.skills.split(",").map((s, idx) => (
                          <span key={idx} className="skill-tag-micro">{s.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {app.userId?.bio && (
                    <div className="body-info-item bio">
                      <span className="info-label">Bio:</span>
                      <p className="bio-summary">{app.userId.bio}</p>
                    </div>
                  )}
                </div>

                <div className="applicant-footer">
                  {app.userId?.resume ? (
                    <a 
                      href={app.userId.resume.startsWith("http") ? app.userId.resume : `${API}/upload/${app.userId.resume}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-resume-action-btn"
                    >
                      📄 View Resume
                    </a>
                  ) : (
                    <span className="no-resume-indicator">No Resume Uploaded</span>
                  )}

                  <div className="decision-actions">
                    <button 
                      onClick={() => updateStatus(app._id, "shortlisted")} 
                      className="decision-btn approve"
                      disabled={app.status === "shortlisted"}
                    >
                      Shortlist
                    </button>
                    <button 
                      onClick={() => updateStatus(app._id, "rejected")} 
                      className="decision-btn reject"
                      disabled={app.status === "rejected"}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}