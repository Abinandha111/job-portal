import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./Applicants.css";
import { useParams } from "react-router-dom";

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

        const res = await axios.get(`${API}/api/recruiter/applicants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (jobId) {
          const filtered = res.data.filter(
            (app) => app.jobId?._id === jobId );

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
  }, []);


  const filteredApplicants = applicants.filter(
  (app) =>
    app.userId?.username
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    app.userId?.email
      ?.toLowerCase()
      .includes(search.toLowerCase())
);

  if (loading) return <h2>Loading...</h2>;

  return (
  <div className="applicants-container">
    <h2 className="applicants-title">👥 Applicants</h2>

    <input
  type="text"
  placeholder="Search by name or email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

    {filteredApplicants.length === 0 ? (
      <p>{search
      ? "No matching applicants found"
      : "No applicants yet"}</p>
    ) : (
      filteredApplicants.map((app) => (
        <div key={app._id} className="applicant-card">
          <div className="applicant-name">
            {app.userId?.username || "Unknown user"}
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