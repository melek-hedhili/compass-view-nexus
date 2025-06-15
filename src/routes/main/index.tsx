
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dossiers from "@/pages/main/dossier/Dossiers";
import Mail from "@/pages/main/mail/Mail";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/main/dashboard/Dashboard";
import Users from "@/pages/main/dashboard/tabs/users/Users";
import Contracts from "@/pages/main/dashboard/tabs/contracts/Contracts";
import Lists from "@/pages/main/dashboard/tabs/lists/Lists";
import Documents from "@/pages/main/dashboard/tabs/documents/Documents";
import Controls from "@/pages/main/dashboard/tabs/controls/Controls";
import Quotes from "@/pages/main/dashboard/tabs/quotes/Quotes";

export const MainRoutes = () => (
  <Routes>
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
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
    <Route path="*" element={<NotFound />} />
  </Routes>
);
