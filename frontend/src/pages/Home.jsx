import "./Home.css";

export default function Home() {
  return (
    <div className="home">

      <h1>Find your dream job here!</h1>

      <p>Explore thousands of job opportunities with top companies.</p>

      <a href="/jobs">
        <button>Explore Jobs</button>
      </a>

      <a href="/login">
        <button className="login-btn">Login</button>
      </a>

      <div className="search">
        <input type="text" placeholder="Search for jobs..." />
        <button>Search</button>
      </div>

    </div>
  );
}