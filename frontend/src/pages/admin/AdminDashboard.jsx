import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./AdminDashboard.css";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplications: 0
  });

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // "users" or "jobs"
  const [userSearch, setUserSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, usersRes, jobsRes] = await Promise.all([
        axios.get(`${API}/api/admin/stats`, { headers }),
        axios.get(`${API}/api/admin/users`, { headers }),
        axios.get(`${API}/api/admin/jobs`, { headers })
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API}/api/admin/users/${userId}/role`,
        { role: newRole },
        { headers }
      );
      alert("User role updated successfully ✅");
      // Update state local
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      // Refresh stats
      const statsRes = await axios.get(`${API}/api/admin/stats`, { headers });
      setStats(statsRes.data);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    const selfUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (userId === selfUser.id) {
      alert("You cannot delete your own admin account ❌");
      return;
    }

    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API}/api/admin/users/${userId}`, { headers });
      alert("User deleted successfully ✅");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      
      const statsRes = await axios.get(`${API}/api/admin/stats`, { headers });
      setStats(statsRes.data);
    } catch (err) {
      console.log(err);
      alert("Delete failed ❌");
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "closed" : "active";
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(
        `${API}/api/admin/jobs/${jobId}/status`,
        { status: newStatus },
        { headers }
      );
      alert(`Job marked as ${newStatus} ✅`);
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
      );

      const statsRes = await axios.get(`${API}/api/admin/stats`, { headers });
      setStats(statsRes.data);
    } catch (err) {
      console.log(err);
      alert("Failed to toggle status");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job and all its applications?")) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API}/api/admin/jobs/${jobId}`, { headers });
      alert("Job deleted successfully ✅");
      setJobs((prev) => prev.filter((j) => j._id !== jobId));

      const statsRes = await axios.get(`${API}/api/admin/stats`, { headers });
      setStats(statsRes.data);
    } catch (err) {
      console.log(err);
      alert("Delete failed ❌");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredJobs = jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company?.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  if (loading) return <div className="loading">Loading admin cockpit...</div>;

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h1>Administrator Dashboard</h1>
        <p>Overall portal moderation cockpit, user metrics, and job vetting tools.</p>
      </header>

      {/* METRICS ROW */}
      <section className="admin-metrics-row">
        <div className="admin-metric-card">
          <div className="card-info">
            <span className="title">Candidates</span>
            <h3>{stats.totalUsers}</h3>
          </div>
          <span className="icon">👥</span>
        </div>

        <div className="admin-metric-card">
          <div className="card-info">
            <span className="title">Recruiters</span>
            <h3>{stats.totalRecruiters}</h3>
          </div>
          <span className="icon">💼</span>
        </div>

        <div className="admin-metric-card">
          <div className="card-info">
            <span className="title">Total Openings</span>
            <h3>{stats.totalJobs}</h3>
          </div>
          <span className="icon">📝</span>
        </div>

        <div className="admin-metric-card">
          <div className="card-info">
            <span className="title">Applications</span>
            <h3>{stats.totalApplications}</h3>
          </div>
          <span className="icon">📥</span>
        </div>
      </section>

      {/* COCKPIT TABS */}
      <section className="cockpit-tabs-section">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 User Management
          </button>
          <button
            className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            💼 Job Moderation
          </button>
        </div>

        <div className="tab-content-panel">
          {activeTab === "users" ? (
            <div className="management-panel">
              <div className="panel-actions-row">
                <h3>System Accounts ({filteredUsers.length})</h3>
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="search-input-admin"
                />
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Account Name</th>
                      <th>Email Address</th>
                      <th>Account Role</th>
                      <th>Security Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((userItem) => (
                      <tr key={userItem._id}>
                        <td>
                          <div className="user-profile-cell">
                            <img
                              src={userItem.image ? `${API}/upload/${userItem.image}` : "https://ui-avatars.com/api/?name=User&background=random"}
                              alt="Avatar"
                              className="admin-avatar"
                            />
                            <strong>{userItem.username}</strong>
                          </div>
                        </td>
                        <td>{userItem.email}</td>
                        <td>
                          <select
                            value={userItem.role}
                            onChange={(e) => handleRoleChange(userItem._id, e.target.value)}
                            className="role-select-admin"
                          >
                            <option value="user">Job Seeker</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteUser(userItem._id)}
                            className="delete-user-action-btn"
                          >
                            🗑️ Delete User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="management-panel">
              <div className="panel-actions-row">
                <h3>Vetted Openings ({filteredJobs.length})</h3>
                <input
                  type="text"
                  placeholder="Search by job title, company, or location..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="search-input-admin"
                />
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Job Post Title</th>
                      <th>Company</th>
                      <th>Location & Salary</th>
                      <th>Poster</th>
                      <th>Status Moderation</th>
                      <th>Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((jobItem) => (
                      <tr key={jobItem._id}>
                        <td>
                          <strong>{jobItem.title}</strong>
                        </td>
                        <td>{jobItem.company}</td>
                        <td>
                          <div className="table-meta-details">
                            <span>📍 {jobItem.location}</span>
                            <span>💰 {jobItem.salary}</span>
                          </div>
                        </td>
                        <td>{jobItem.createdBy?.email || "Deleted Recruiter"}</td>
                        <td>
                          <button
                            onClick={() => handleToggleJobStatus(jobItem._id, jobItem.status)}
                            className={`toggle-status-btn-admin ${jobItem.status}`}
                          >
                            {jobItem.status === "active" ? "🟢 Active (Approve)" : "🔴 Closed (Suspend)"}
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteJob(jobItem._id)}
                            className="delete-user-action-btn"
                          >
                            🗑️ Delete Job
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
