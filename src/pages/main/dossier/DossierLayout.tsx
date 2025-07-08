import { useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
import {
  FileText,
  Mail,
  Database,
  User as UserIcon,
  Folder,
  BarChart3,
  Edit,
  Shield,
} from "lucide-react";
import SegmentedTabs from "@/components/ui/segmented-tabs";

type DossierTabKey =
  | "informations"
  | "mails"
  | "documents"
  | "analyse"
  | "rapport"
  | "annonce"
  | "saisie"
  | "controle";

const DossierLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dossierId } = useParams<{ dossierId: string }>();
  const tabKey = (location.pathname.split("/").pop() ??
    "informations") as DossierTabKey;

  const dossierTabs = [
    {
      name: "Informations",
      value: "informations",
      icon: UserIcon,
    },
    {
      name: "Mails",
      value: "mails",
      icon: Mail,
    },
    {
      name: "Documents",
      value: "documents",
      icon: FileText,
    },
    {
      name: "Analyse",
      value: "analyse",
      icon: BarChart3,
    },
    {
      name: "Rapport",
      value: "rapport",
      icon: Database,
    },
    {
      name: "Annonce",
      value: "annonce",
      icon: Edit,
    },
    {
      name: "Saisie",
      value: "saisie",
      icon: Folder,
    },
    {
      name: "Contrôle",
      value: "controle",
      icon: Shield,
    },
  ];

  return (
    <div className="w-full animate-fade-in">
      <SegmentedTabs
        tabs={dossierTabs}
        value={tabKey}
        onValueChange={(v) => navigate(`/dashboard/dossiers/${dossierId}/${v}`)}
        className="mb-4"
      />
      <Outlet />
    </div>
  );
};

export default DossierLayout;
