import "./Jobs.css";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import API from "./data/api";


export default function Jobs() {

    const [search, setSearch] = useState("");
    const [jobs, setJobs] = useState([]);

    useEffect(() => {

  const fetchJobs = async () => {

    try {

      const res = await axios.get(
        `${API}/api/job`
      );

      setJobs(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  fetchJobs();

}, []);

     const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = async (jobId) => {
  try {

    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API}/api/application/apply`,
      { jobId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Applied successfully ✅");

  } catch (error) {
    console.log(error);
    alert("Already applied or error ❌");
  }
};

const handleDelete = async (id) => {

  try {

    await axios.delete(`${API}/api/job/${id}`);

    alert("Job deleted successfully ✅");

    setJobs(jobs.filter((job) => job._id !== id));

  } catch (error) {

    console.log(error);
    alert("Delete failed ❌");

  }
};

const handleEdit = async (job) => {

  const newTitle = prompt("Enter new title", job.title);

  if (!newTitle) return;

  try {

    await axios.put(`${API}/api/job/${job._id}`, {
      ...job,
      title: newTitle
    });

    alert("Job updated successfully ✅");

    setJobs(
      jobs.map((j) =>
        j._id === job._id
          ? { ...j, title: newTitle }
          : j
      )
    );

  } catch (error) {

    console.log(error);
    alert("Update failed ❌");

  }
};

  return (
    <div className="jobs-page">

      <h1 className="title">Available Jobs</h1>
      <Link to="/add-job">
        <button className="add-job-btn"> + Add Job</button>
      </Link>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search jobs by title, company, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="jobs-container">

        {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
        <div className="job-card" key={job._id}>
            <h2>{job.title}</h2>
            <p><b>Company:</b> {job.company}</p>
            <p><b>Location:</b> {job.location}</p>
            <p><b>Salary:</b> {job.salary}</p>
            <button onClick={() => handleApply(job._id)}>Apply Now</button>
            <button onClick={() => handleDelete(job._id)}>Delete Job</button>
            <button onClick={() => handleEdit(job)}>Edit Job</button>
        </div>
        ))
    ) : (
        <p>No jobs found 😢</p>
  )}

  

</div>

    </div>
  );
}