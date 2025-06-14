
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, canAccessSection, user } = useAuth();
  const location = useLocation();

  // Extract the section from the pathname
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const section = pathSegments[pathSegments.length - 1] || "dashboard";

  useEffect(() => {
    // Clear any existing error toasts when route changes
    if (isAuthenticated && !loading) {
      // This helps prevent toast spam during navigation
    }
  }, [location.pathname, isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-formality-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has access to this section
  if (!canAccessSection(section)) {
    toast.error("Vous n'avez pas accès à cette section");
    // Redirect based on user role
    const redirectPath = user?.role === "USER" ? "/dashboard/dossiers" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-formality-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
