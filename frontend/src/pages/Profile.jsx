import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import API from "./data/api";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resume, setResume] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API}/api/user/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUser(res.data);
        setPhone(res.data.phone || "");
        setBio(res.data.bio || "");
        setSkills(res.data.skills || "");
        setResume(res.data.resume || "");
        setForm({ username: res.data.username, email: res.data.email, password: "" });

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const openEdit = () => {
    setForm({ username: user.username, email: user.email, password: "" });
    setEditMode(true);
  };

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", image);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/api/user/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser({
        ...user,
        image: res.data.image
      });

      setImage(null);
      setPreview(null);
      alert("Profile picture updated successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Failed to upload image ❌");
    } finally {
      setUploading(false);
    }
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("resume", file);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/api/user/upload-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setUser({
        ...user,
        resume: res.data.resume
      });
      alert("Resume uploaded successfully ✅");
    } catch (error) {
      console.log(error);
      alert("Failed to upload resume ❌");
    }
  };

  const deleteResume = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/user/delete-resume`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser({
        ...user,
        resume: ""
      });
      alert("Resume deleted successfully ✅");
    } catch (error) {
      console.log(error);
      alert("Failed to delete resume ❌");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API}/api/user/update`,
        { 
          ...form,
          phone,
          bio,
          skills
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(res.data);
      setEditMode(false);
      alert("Profile updated successfully ✅");
    } catch (error) {
      console.log(error);
      alert("Update failed ❌");
    }
  };

  const deleteAccount = async () => {
    const confirmDelete = window.confirm("WARNING: This will permanently delete your account. Are you sure?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/user/delete-account`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.clear();
      alert("Account deleted successfully");
      navigate("/register");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  if (loading) return <div className="loading">Loading profile details...</div>;
  if (!user) return <div className="loading error">No user session found. Please sign in again.</div>;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-layout-grid">
        
        {/* Left Column: Brief summary + Photo Card */}
        <div className="profile-side-column">
          <div className="profile-summary-card">
            <div className="profile-card-cover"></div>
            
            <div className="profile-avatar-container">
              <img
  src={
    user.image
      ? `${API}/upload/${user.image}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.username
        )}&background=random`
  }
  alt={user.username}
  className="profile-avatar-img"
/>
              
              <label className="change-avatar-label">
                📷
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>

            {preview && (
              <div className="avatar-preview-box">
                <img src={preview} alt="Preview" className="avatar-preview-thumbnail" />
                <button onClick={uploadImage} disabled={uploading} className="upload-avatar-btn">
                  {uploading ? "Saving..." : "Confirm Photo"}
                </button>
              </div>
            )}

            <h2>{user.username}</h2>
            <p className="user-email">{user.email}</p>
            <span className="profile-role-badge">Job Seeker</span>

            <div className="profile-stats-mini">
              <Link to="/applied-jobs" className="mini-stat-item">
                <span className="stat-count">{user.appliedCount || 0}</span>
                <span className="stat-label">Applications</span>
              </Link>
              <Link to="/saved-jobs" className="mini-stat-item">
                <span className="stat-count">{user.savedJobs?.length || 0}</span>
                <span className="stat-label">Saved</span>
              </Link>
            </div>
          </div>

          {/* Resume Upload Card */}
          <div className="resume-widget-card">
            <h3>Resume CV</h3>
            <p className="widget-desc">Upload a PDF copy of your CV to attach during job applications.</p>
            
            {user.resume ? (
              <div className="active-resume-status">
                <div className="resume-icon-details">
                  <span className="resume-icon">📄</span>
                  <a
                    href={user.resume.startsWith("http") ? user.resume : `${API}/upload/${user.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-download-link"
                  >
                    View Current CV
                  </a>
                </div>
                <button onClick={deleteResume} className="delete-resume-btn">Remove CV</button>
              </div>
            ) : (
              <div className="no-resume-status">
                <label className="resume-picker-btn">
                  Select PDF
                  <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={uploadResume}
                  />
                </label>
                <span className="file-hint">Max file size 5MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Settings Form / Profile Editing */}
        <div className="profile-details-column">
          <div className="profile-form-card">
            <div className="form-card-header">
              <h2>Account Settings</h2>
              <p>Update your profile particulars, phone, and professional skills.</p>
            </div>

            {!editMode ? (
              <div className="profile-details-view">
                <div className="detail-field-group">
                  <h4>Bio</h4>
                  <p className="bio-text-display">{bio || "No professional bio added yet. Write one to stand out to employers!"}</p>
                </div>

                <div className="detail-field-group">
                  <h4>Skills</h4>
                  <div className="skills-tags-display">
                    {skills ? (
                      skills.split(",").map((skill, i) => (
                        <span key={i} className="skill-badge">
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="no-skills-text">No skills listed yet. Add skills separated by commas.</span>
                    )}
                  </div>
                </div>

                <div className="detail-info-row">
                  <div>
                    <h4>Phone</h4>
                    <p>{phone || "Not specified"}</p>
                  </div>
                  <div>
                    <h4>Primary Email</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <button onClick={openEdit} className="edit-mode-btn">Edit Profile Info</button>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="profile-edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password (Optional)</label>
                    <input 
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Change Password"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Professional Bio</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your qualifications, background, and career goals..."
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Skills (comma separated)</label>
                  <input 
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Express, MongoDB, UI/UX"
                  />
                  <span className="input-hint-text">Separate skills with commas so they render as searchable tags.</span>
                </div>

                <div className="form-actions-buttons">
                  <button type="submit" className="save-changes-btn">Save Changes</button>
                  <button type="button" onClick={() => setEditMode(false)} className="cancel-edit-btn">Cancel</button>
                </div>
              </form>
            )}

            <div className="danger-zone-section">
              <h3>Danger Zone</h3>
              <p>Deleting your account will remove all application history, saved positions, and profile details permanently. This action cannot be undone.</p>
              <button onClick={deleteAccount} className="delete-account-btn-profile">Delete My Account</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}