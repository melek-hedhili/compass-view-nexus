import { Route, Routes } from "react-router-dom";
import { PublicRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";

export const AuthRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoute>
          <Index />
        </PublicRoute>
      }
    />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
  </Routes>
);
