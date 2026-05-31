import { Link } from "react-router-dom";


export default function Dashboard() {
  return (
    <div>
        
      <h1>👤 User Dashboard</h1>
      <p>Welcome Job Seeker</p>
      <div>
        <Link to="/Jobs"> 
        <button>Explore Jobs</button>
        </Link>

        <Link to="/applied-jobs">
        <button>My Applications</button>
        </Link>

        <Link to="/profile">
        <button>My Profile</button>
        </Link>
       
         <Link to="/saved-jobs">
        <button>Saved Jobs</button>
        </Link>
        

      </div>
    </div>
  );
}