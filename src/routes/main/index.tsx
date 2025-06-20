import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import Dossiers from "@/pages/main/dossier/Dossiers";
import Mail from "@/pages/main/mail/Mail";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/main/dashboard/Dashboard";

export const MainRoutes = () => (
  <AppLayout>
    <Routes>
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
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
      <Route path="/dashboard/mail">
        <Route index element={<Navigate to="inbox" replace />} />
        <Route
          path="inbox"
          element={
            <ProtectedRoute>
              <Mail />
            </ProtectedRoute>
          }
        />
        <Route
          path="archived"
          element={
            <ProtectedRoute>
              <Mail />
            </ProtectedRoute>
          }
        />
        <Route
          path="sent"
          element={
            <ProtectedRoute>
              <Mail />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppLayout>
);
