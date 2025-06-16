
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
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
  <ProtectedRoute>
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/quotes" element={<Quotes />} />
        <Route path="/dashboard/controls" element={<Controls />} />
        <Route path="/dashboard/contracts" element={<Contracts />} />
        <Route path="/dashboard/documents" element={<Documents />} />
        <Route path="/dashboard/lists" element={<Lists />} />
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/dashboard/dossiers" element={<Dossiers />} />
        <Route path="/dashboard/mail" element={<Mail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  </ProtectedRoute>
);
