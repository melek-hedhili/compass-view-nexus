
import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dossiers from "@/pages/main/dossier/Dossiers";
import Mail from "@/pages/main/mail/Mail";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/main/dashboard/Dashboard";
import Users from "@/pages/main/dashboard/tabs/Users";
import Contracts from "@/pages/main/dashboard/tabs/Contracts";
import Lists from "@/pages/main/dashboard/tabs/Lists";
import Documents from "@/pages/main/dashboard/tabs/Documents";
import Controls from "@/pages/main/dashboard/tabs/Controls";
import Quotes from "@/pages/main/dashboard/tabs/Quotes";

export const MainRoutes = () => (
  <Routes>
    {/* Default dashboard route */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    
    {/* Dashboard sub-routes */}
    <Route
      path="/dashboard/quotes"
      element={
        <ProtectedRoute>
          <Quotes />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/controls"
      element={
        <ProtectedRoute>
          <Controls />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/contracts"
      element={
        <ProtectedRoute>
          <Contracts />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/documents"
      element={
        <ProtectedRoute>
          <Documents />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/lists"
      element={
        <ProtectedRoute>
          <Lists />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/users"
      element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      }
    />
    
    {/* Main feature routes */}
    <Route
      path="/dashboard/dossiers"
      element={
        <ProtectedRoute>
          <Dossiers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/dashboard/mail"
      element={
        <ProtectedRoute>
          <Mail />
        </ProtectedRoute>
      }
    />
    
    {/* Catch-all route - redirect to dashboard */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
