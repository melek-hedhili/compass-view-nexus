import { Navigate, Route, Routes } from "react-router-dom";
import Login from "@/pages/auth/Login";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export const AuthRoutes = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner />;
  } else {
    if (isAuthenticated) {
      return <Navigate to="/dashboard/settings" replace />;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
