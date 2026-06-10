import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./RecruiterProfile.css";
import { Link } from "react-router-dom";

export default function RecruiterProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    username: "",
    company: "",
    phone: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    setForm({
      username: storedUser?.username || "",
      company: storedUser?.company || "",
      phone: storedUser?.phone || ""
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/api/user/update`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile updated successfully ✅");
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm("WARNING: This will permanently delete your employer account. Are you sure?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/user/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Account deleted successfully");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  if (!user) {
    return <div className="loading">No active recruiter session found.</div>;
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
          <Link to="/recruiter/add-job" className="nav-item">
            <span className="icon">➕</span> Post Job
          </Link>
          <Link to="/recruiter/applicants" className="nav-item">
            <span className="icon">📥</span> Applications
          </Link>
          <Link to="/recruiter/profile" className="nav-item active">
            <span className="icon">👤</span> Profile
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="dashboard-main">
        <div className="main-header">
          <div>
            <h1>Recruiter Profile</h1>
            <p>Update your personal information and company branding particulars.</p>
          </div>
        </div>

        <div className="recruiter-profile-card">
          {!editMode ? (
            <div className="profile-details-view">
              <div className="detail-field-group">
                <h4>Full Name</h4>
                <p className="detail-value-text">{user.username || "Not set"}</p>
              </div>

              <div className="detail-field-group">
                <h4>Company Name</h4>
                <p className="detail-value-text">{user.company || "Not set"}</p>
              </div>

              <div className="detail-field-group">
                <h4>Phone Number</h4>
                <p className="detail-value-text">{user.phone || "Not set"}</p>
              </div>

              <div className="detail-field-group">
                <h4>Email Address</h4>
                <p className="detail-value-text">{user.email}</p>
              </div>

              <button className="edit-mode-btn" onClick={() => setEditMode(true)}>
                ✏️ Edit Profile Info
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="profile-edit-form">
              <div className="form-group">
                <label htmlFor="username">Full Name</label>
                <input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company Name</label>
                <input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company Ltd."
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-actions-buttons">
                <button type="submit" className="save-changes-btn">Save Changes</button>
                <button type="button" className="cancel-edit-btn" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="danger-zone-section">
            <h3>Danger Zone</h3>
            <p>Permanently remove your employer profile, all active job openings, and applicant histories from CareerHub.</p>
            <button onClick={deleteAccount} className="delete-account-btn-profile">
              🗑️ Delete My Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}