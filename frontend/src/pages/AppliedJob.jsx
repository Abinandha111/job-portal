import { useEffect, useState } from "react";
import axios from "axios";
import API from "./data/api";

export default function AppliedJobs() {

  const [applications, setApplications] = useState([]);

  useEffect(() => {

    const fetchApplications = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API}/api/application/my-applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setApplications(res.data);

      } catch (error) {

        console.log(error);

      }
    };

    fetchApplications();

  }, []);

  

    return (

    <div className="applied-page">

      <h1 className="applied-title">
        My Applied Jobs
      </h1>

      <div className="applied-container">

        {applications.length > 0 ? (

          applications.map((app) => (

            <div className="applied-card" key={app._id}>

              <h2>{app.jobId?.title}</h2>

              <p>
                <b>Company:</b> {app.jobId?.company}
              </p>

              <p>
                <b>Location:</b> {app.jobId?.location}
              </p>

              <p>
                <b>Salary:</b> {app.jobId?.salary}
              </p>

            </div>

          ))

        ) : (

          <p>No applied jobs found 😢</p>

        )}

      </div>

    </div>
  );
}
