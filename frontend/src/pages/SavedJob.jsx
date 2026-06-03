import { useEffect, useState } from "react";
import axios from "axios";
import API from "./data/api";
import "./AppliedJob.css";

export default function SavedJob() {
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${API}/api/user/saved-jobs`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setSavedJobs(res.data.savedJobs || res.data || []);
                console.log("SAVED JOBS API RESPONSE:", res.data);

            } catch (error) {
                console.log(error);
            }
        };

        fetchSavedJobs();
    }, []);

    const handleUnsave = async (jobId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `${API}/api/user/unsave-job/${jobId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert("Removed from saved jobs");

    // UI update (remove instantly)
    setSavedJobs((prev) =>
      prev.filter((job) => job._id !== jobId)
    );

  } catch (err) {
    console.log(err);
    alert("Unsave failed");
  }
};

    return (
        <div className="applied-page">
            <h1 className="applied-title">My Saved Jobs ❤️</h1>

            <div className="applied-container">

               {savedJobs?.length > 0 ? (
  savedJobs.map((job) => (
    <div key={job._id}>
      <h2>{job.title || "No title"}</h2>
      <p>{job.company || "No company"}</p>
      <p>{job.location || "No location"}</p>
      <p>{job.salary || "Not specified"}</p>

      <button
  className="unsave-btn"
  onClick={() => handleUnsave(job._id)}
>
Delete
</button>
    </div>

    
  ))

  
) : (
  <p>No saved jobs ❤️</p>
)}

            </div>
        </div>
    );
}