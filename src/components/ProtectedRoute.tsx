
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, canAccessSection } = useAuth();
  const location = useLocation();

  // If loading, show spinner
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

  // Calculate the section more robustly:
  // - If path is /dashboard, section = "dashboard"
  // - If path is /dashboard/foo, section = "foo"
  // - If path is /dashboard/foo/bar, section = "foo"
  // This matches the structure of your `roleAccessMap`.
  let section = "dashboard";
  const match = location.pathname.match(/^\/dashboard(?:\/([^\/]+))?/);
  if (match && match[1]) {
    section = match[1];
  }

  // Don't redirect if the user has access
  if (!canAccessSection(section)) {
    toast.error("Vous n'avez pas accès à cette section");
    return <Navigate to="/dashboard" replace />;
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
