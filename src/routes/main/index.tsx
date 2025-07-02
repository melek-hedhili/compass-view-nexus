import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dossiers from "@/pages/main/dossier/Dossiers";
import DossierLayout from "@/pages/main/dossier/DossierLayout";
import InformationsSection from "@/pages/main/dossier/DossierDetail/Tabs/Informations/InformationsSection";
import MailsSection from "@/pages/main/dossier/DossierDetail/Tabs/Mails/MailsSection";
import DocumentsSection from "@/pages/main/dossier/DossierDetail/Tabs/Documents/DocumentsSection";
import AnalyseSection from "@/pages/main/dossier/DossierDetail/Tabs/Analyse/AnalyseSection";
import RapportSection from "@/pages/main/dossier/DossierDetail/Tabs/Rapport/RapportSection";
import AnnonceSection from "@/pages/main/dossier/DossierDetail/Tabs/Annonce/AnnonceSection";
import SaisieSection from "@/pages/main/dossier/DossierDetail/Tabs/Saisie/SaisieSection";
import ControleSection from "@/pages/main/dossier/DossierDetail/Tabs/Controle/ControleSection";
import Mail from "@/pages/main/mail/Mail";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/main/settings/Dashboard";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const dashboardSettingsRoutes = [
  "clients",
  "quotes",
  "controls",
  "arboresence",
  "documents",
  "lists",
  "users",
];

const mailRoutes = ["inbox", "archived", "sent"];

export const MainRoutes = () => {
  const { isAuthenticated, loading, canAccessSection } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  } else {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }
    if (!canAccessSection(location.pathname.split("/").pop() || "dashboard")) {
      toast.error("Vous n'avez pas accès à cette section");
      return <Navigate to="/dashboard/settings" replace />;
    }
  }

  return (
    <Routes>
      <Route path="/dashboard/*" element={<AppLayout />}>
        <Route index element={<Navigate to="settings/clients" replace />} />
        <Route path="dossiers">
          <Route index element={<Dossiers />} />
          <Route path=":dossierId" element={<DossierLayout />}>
            <Route index element={<Navigate to="informations" replace />} />
            <Route path="informations" element={<InformationsSection />} />
            <Route path="mails" element={<MailsSection />} />
            <Route path="documents" element={<DocumentsSection />} />
            <Route path="analyse" element={<AnalyseSection />} />
            <Route path="rapport" element={<RapportSection />} />
            <Route path="annonce" element={<AnnonceSection />} />
            <Route path="saisie" element={<SaisieSection />} />
            <Route path="controle" element={<ControleSection />} />
          </Route>
        </Route>
        <Route path="mail">
          <Route index element={<Navigate to="inbox" replace />} />
          {mailRoutes.map((path) => (
            <Route key={path} path={path} element={<Mail />} />
          ))}
        </Route>
        <Route path="settings">
          <Route index element={<Navigate to="clients" replace />} />
          {dashboardSettingsRoutes.map((path) => (
            <Route key={path} path={path} element={<Dashboard />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
