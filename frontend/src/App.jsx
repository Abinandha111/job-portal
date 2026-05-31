import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

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




export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/recruiter/add-job" element={<AddJob />} />
        <Route path="/applied-jobs" element={<AppliedJob />} />
        <Route path="/saved-jobs" element={<SavedJob />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
        <Route path="/user/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/recruiter/dashboard" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/my-jobs" element={<ProtectedRoute><MyJobs /></ProtectedRoute>} />
        <Route path="/recruiter/applicants" element={<ProtectedRoute><Applicants/></ProtectedRoute>}/>

      </Routes>
    </BrowserRouter>
  );
}


