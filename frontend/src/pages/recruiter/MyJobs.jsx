import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./MyJobs.css";

import { useNavigate } from "react-router-dom";

export default function MyJobs() {

  const [jobs, setJobs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {

   
    fetchMyJobs();
  }, [token]);

  const fetchMyJobs = async () => {
    try {
        if (!token) {
        console.log("No token found ❌");
        return;
      }

      const res = await axios.get(`${API}/api/job/my-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setJobs(res.data);

    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const updateJobStatus = async (jobId, status) => {
  try {
    await axios.put(
      `${API}/api/job/status/${jobId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchMyJobs();

  } catch (err) {
    console.log(err);
  }
};

  if (!user || user.role !== "recruiter") {
    return <h2>🚫 Only recruiters can access this page</h2>;
  }

  return (
    <div className="myjobs-container">

      <h2>My Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs posted yet</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="job-card">

            <h3>{job.title}</h3>
            <p><b>Company:</b> {job.company}</p>
            <p><b>Location:</b> {job.location}</p>
            <p><b>Salary:</b> {job.salary}</p>

            <p>
  <b>Applicants:</b> {job.applicantsCount}
</p>

<p>
  <b>Status:</b>{" "}
  {job.status === "active" ? "🟢 Active" : "🔴 Closed"}
</p>

            <div className="actions">

              <button className="edit-btn">
                ✏️ Edit
              </button>

              <button className="delete-btn">
                🗑️ Delete
              </button>

            </div>

            {job.status === "active" ? (
  <button
    onClick={() => updateJobStatus(job._id, "closed")}
  >
    🔒 Close Job
  </button>
) : (
  <button
    onClick={() => updateJobStatus(job._id, "active")}
  >
    🔓 Reopen Job
  </button>
)}

            <button  className="view-btn" onClick={() => navigate(`/recruiter/applicants/${job._id}`)}>
              👥 View Applicants
            </button>

          </div>
        ))
      )}

    </div>
  );
}