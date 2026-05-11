import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">

      <h1>Find your dream job here!</h1>

      <p>Explore thousands of job opportunities with top companies.</p>

      <Link to="/jobs">
        <button className="explore-btn">Explore Jobs</button>
      </Link>
      <Link to="/login">
  <button className="login-btn">Login</button>
</Link>

      

      <div className="search">
        <input type="text" placeholder="Search for jobs..." />
        <button>Search</button>
      </div>

    </div>
  );
}