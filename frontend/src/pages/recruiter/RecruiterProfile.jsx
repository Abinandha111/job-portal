import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./RecruiterProfile.css";

export default function RecruiterProfile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: ""
  });

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  setUser(storedUser);

  setForm({
    name: storedUser?.name || "",
    company: storedUser?.company || "",
    phone: storedUser?.phone || ""
  });
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
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

      // update localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      setEditMode(false);

    } catch (err) {
      console.log(err);
      alert("Update failed ❌");
    }
  };

  const deleteAccount = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete account?");

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`${API}/api/user/delete-account`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("Account deleted");

    // logout user
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

  } catch (err) {
    console.log(err);
    alert("Delete failed");
  }
};

 if (!user) {
  return <div style={{ padding: "20px" }}>No user found</div>;
}

  return (
  <div className="profile-container">

    <div className="profile-card">

      <h2>👤 Recruiter Profile</h2>

      {!editMode ? (
        <>
          <div className="profile-info">
            <p><span>Name:</span> {user.name}</p>
            <p><span>Company:</span> {user.company || "Not set"}</p>
            <p><span>Phone:</span> {user.phone || "Not set"}</p>
          </div>

          <button className="edit-btn" onClick={() => setEditMode(true)}>
            ✏️ Edit Profile
          </button>
        </>
      ) : (
        <>
          <div className="profile-form">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
            />

            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Company"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
            />

          </div>

          <div className="btn-group">
            <button className="save-btn" onClick={handleSave}>
              ✅ Save
            </button>

            <button className="cancel-btn" onClick={() => setEditMode(false)}>
              ❌ Cancel
            </button>
          </div>
        </>
      )}

      <button
  style={{ background: "red", color: "white" }}
  onClick={deleteAccount}
>
  Delete Account 🗑️
</button>

    </div>
  </div>
);
}