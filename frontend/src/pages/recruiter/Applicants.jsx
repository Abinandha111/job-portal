import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./Applicants.css";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

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
            {app.userId?.username || "Unknown user"}
          </div>

          <div className="applicant-email">
            {app.userId?.email || "No email"}
          </div>

          <div className="job-title">
            Job: {app.jobId?.title || "Job deleted"}
          </div>

          <span className="badge">New Application</span>
        </div>
      ))
    )}
  </div>
    );
}