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
    </div>
  ))
) : (
  <p>No saved jobs ❤️</p>
)}

            </div>
        </div>
    );
}