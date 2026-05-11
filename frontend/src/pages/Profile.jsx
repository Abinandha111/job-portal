import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import API from "./data/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

  // FETCH USER
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

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // OPEN EDIT
  const openEdit = () => {
    setForm({ username: user.username, email: user.email ,password: ""});
    setEditMode(true);
  };

  // UPDATE PROFILE
  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API}/api/user/update`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.log(err);
    }
  };

  // UPLOAD IMAGE
  const uploadImage = async () => {
    if (!image) return;

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

      setUser({ ...user, image: res.data.image });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${API}/api/user/update`,
      {
        phone,
        bio,
        skills
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Profile updated successfully ✅");

  } catch (error) {

    console.log(error);
    alert("Update failed ❌");

  }
};

  if (loading) return <h2>Loading...</h2>;
  if (!user) return <h2>No user data found</h2>;

  return (
    <div className={darkMode ? "dark" : "light"}>

      <div className="profile-container">
        <div className="profile-card">

          {/* TOP ACTIONS */}
          <div className="top-actions">
            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "Light ☀️" : "Dark 🌙"}
            </button>

            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
           <div className="cover-banner"></div>

          {/* PROFILE TOP */}
          <div className="profile-top">
            <img
              src={
                user.image
                  ? `${API}/upload/${user.image}`
                  : "https://via.placeholder.com/100"
              }
              className="profile-img"
            />

            <h2>{user.username}</h2>
            <p className="email">{user.email}</p>
          

             <div className="bio-section">
            <p>{bio || "No bio added yet..."}</p>
          </div>
          <div className="skills-section">
            {skills &&
              skills.split(",").map((skill, i) => (
                <span key={i} className="skill-tag">
                  {skill.trim()}
                </span>
              ))}
          </div>
          </div>
          

          {/* INFO CARDS */}
          <div className="info-cards">
            <div className="card">
              <h4>User ID</h4>
              <p>{user._id.slice(0, 8)}...</p>
            </div>
          </div>

           <div className="stats">

  <div className="stat-box">
    <h4>Applied Jobs</h4>
    <p>{user.appliedJobs?.length || 0}</p>
  </div>

  <div className="stat-box">
    <h4>Saved Jobs</h4>
    <p>{user.savedJobs?.length || 0}</p>
  </div>

  <div className="stat-box">
    <h4>Status</h4>
    <p>Active</p>
  </div>

</div>
          {/* EDIT */}
          <button className="edit-btn" onClick={openEdit}>
            Edit Profile
          </button>

          {editMode && (
            <div className="edit-box">
              <input
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                placeholder="Username"
              />

              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Email"
              />
              <input type="password" value={form.password} onChange={(e) => setForm({ 
            ...form, password: e.target.value 
          })}
          placeholder="New Password" />

          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone"/>

          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />

          <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills" />

              <button onClick={updateProfile}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          )}

          {/* UPLOAD */}
          <div className="upload-box">
            <label className="upload-area">
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />

              {preview ? (
                <img src={preview} className="preview-img" />
              ) : (
                <p>Click to change image</p>
              )}
            </label>

            <button onClick={uploadImage} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}