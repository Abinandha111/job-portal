import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import AddJob from "./pages/AddJob";
import AppliedJob from "./pages/AppliedJob";
import SavedJob from "./pages/SavedJob";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import Dashboard from "./pages/user/Dashboard";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import MyJobs from "./pages/recruiter/MyJobs";
import Applicants from "./pages/recruiter/Applicants";
import RoleRoute from "./components/RoleRoute";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
function AppContent() {
const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch (err) {
      return null;
    }
  })();
  const location = useLocation();

  // 🔥 GLOBAL ROUTE LOCK
  if (user) {
    const path = location.pathname;

    if (user.role === "recruiter" && path.startsWith("/user")) {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    if (user.role === "user" && path.startsWith("/recruiter")) {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/jobs"
          element={<RoleRoute role="user"><Jobs /></RoleRoute>}
        />

        <Route
          path="/profile"
          element={<RoleRoute role="user"><Profile /></RoleRoute>}
        />

        <Route
          path="/recruiter/add-job"
          element={<RoleRoute role="recruiter"><AddJob /></RoleRoute>}
        />

        <Route
          path="/applied-jobs"
          element={<RoleRoute role="user"><AppliedJob /></RoleRoute>}
        />

        <Route
          path="/saved-jobs"
          element={<RoleRoute role="user"><SavedJob /></RoleRoute>}
        />

        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />

        <Route
          path="/user/dashboard"
          element={<RoleRoute role="user"><Dashboard /></RoleRoute>}
        />

        <Route
          path="/recruiter/dashboard"
          element={<RoleRoute role="recruiter"><RecruiterDashboard /></RoleRoute>}
        />

        <Route
          path="/recruiter/my-jobs"
          element={<RoleRoute role="recruiter"><MyJobs /></RoleRoute>}
        />

        <Route
          path="/recruiter/applicants"
          element={<RoleRoute role="recruiter"><Applicants /></RoleRoute>}
        />

        <Route path="/recruiter/profile" element={<RoleRoute role="recruiter"><RecruiterProfile /></RoleRoute>} />
      </Routes>

      
    </>
  );
}