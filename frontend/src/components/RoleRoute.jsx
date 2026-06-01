import { Navigate, useLocation } from "react-router-dom";

export default function RoleRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ if role mismatch → force correct dashboard
  if (user.role !== role) {
    if (user.role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    if (user.role === "user") {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
}