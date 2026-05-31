import { useEffect, useState } from "react";
import axios from "axios";
import API from "../data/api";
import "./MyJobs.css";

export default function MyJobs() {

  const [jobs, setJobs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

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

            <div className="actions">

              <button className="edit-btn">
                ✏️ Edit
              </button>

              <button className="delete-btn">
                🗑️ Delete
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  );
}