import { useState } from "react";
import axios from "axios";
import "./AddJob.css";
import { useNavigate } from "react-router-dom";
import API from "./data/api";

export default function AddJob() {


  const token = localStorage.getItem("token");

    const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/api/job/add`,
        form,
        {
         headers: {
      Authorization: `Bearer ${token}`
    }
  }
      );

     
      navigate("/jobs");
      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: ""
      });

    } catch (error) {
      console.log(error);
      alert("Failed ❌");
    }
  };

  return (
    <div className="addjob-container">
        <div className="addjob-box">

      <h1>Add Job</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={form.company}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">
          Add Job
        </button>

      </form>
      </div>

    </div>
  );
}