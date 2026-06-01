import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./Applicants.css";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

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

      alert("Status updated");

      setApplicants((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status } : a
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/user/applicants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplicants(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
  <div className="applicants-container">
    <h2 className="applicants-title">👥 Applicants</h2>

    {applicants.length === 0 ? (
      <p>No applicants yet</p>
    ) : (
      applicants.map((app) => (
        <div key={app._id} className="applicant-card">
          <div className="applicant-name">
            {app.userId?.name || "Unknown user"}
          </div>

          <div className="applicant-email">
            {app.userId?.email || "No email"}
          </div>

          <div className="job-title">
            Job: {app.jobId?.title || "Job deleted"}
          </div>

          <img src={app.userId?.image || "/default-avatar.png"} alt="profile" className="applicant-image"/>

          <p>Phone: {app.userId?.phone}</p>

          <p>Skills: {app.userId?.skills}</p>

          <a  href={app.userId?.resume}
              target="_blank"
              rel="noopener noreferrer">
            View Resume
          </a>

          <span className="badge">New Application</span>

          <p>
            Status:{" "}
            <b>
              {app.status === "pending" && "🟡 Pending"}
              {app.status === "shortlisted" && "🟢 Shortlisted"}
              {app.status === "rejected" && "🔴 Rejected"}
            </b>
          </p>

          {/* ACTION BUTTONS */}
          <button onClick={() => updateStatus(app._id, "shortlisted")}>
            Shortlist
          </button>

          <button onClick={() => updateStatus(app._id, "rejected")}>
            Reject
          </button>

        </div>
      ))
    )}
  </div>
    );
}