import { useLocation, useNavigate } from "react-router-dom";
import {
  FileText,
  List,
  Database,
  User as UserIcon,
  Folder,
} from "lucide-react";
import Client from "@/pages/main/settings/tabs/client/Client";
import Quotes from "@/pages/main/settings/tabs/quotes/Quotes";
import Controls from "@/pages/main/settings/tabs/controls/Controls";
import Documents from "@/pages/main/settings/tabs/documents/Documents";
import Lists from "@/pages/main/settings/tabs/lists/Lists";
import Arboresence from "@/pages/main/settings/tabs/arboresence/Arboresence";
import Users from "@/pages/main/settings/tabs/users/Users";
import SegmentedTabs from "@/components/ui/segmented-tabs";

type TabKey =
  | "clients"
  | "quotes"
  | "controls"
  | "documents"
  | "lists"
  | "users"
  | "arboresence";
const tabs = [
  {
    name: "Clients",
    value: "clients",
    path: "dashboard/settings/clients",
    icon: UserIcon,
    component: <Client />,
  },
  {
    name: "Données",
    value: "quotes",
    path: "dashboard/settings/quotes",
    icon: Database,
    component: <Quotes />,
  },
  {
    name: "Controles",
    value: "controls",
    path: "dashboard/settings/controls",
    icon: List,
    component: <Controls />,
  },
  {
    name: "Documents",
    value: "documents",
    path: "dashboard/settings/documents",
    icon: FileText,
    component: <Documents />,
  },
  {
    name: "Listes",
    value: "lists",
    path: "dashboard/settings/lists",
    icon: List,
    component: <Lists />,
  },
  {
    name: "Utilisateurs",
    value: "users",
    path: "dashboard/settings/users",
    icon: UserIcon,
    component: <Users />,
  },
  {
    name: "Arborescences",
    value: "arboresence",
    path: "dashboard/settings/arboresence",
    icon: Folder,
    component: <Arboresence />,
  },
];
const DashboardSettingsLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabKey = (location.pathname.split("/").pop() ?? "clients") as TabKey;

  return (
    <div className="w-full animate-fade-in">
      {/* <NavTabs />
    {children} */}
      <SegmentedTabs
        tabs={tabs}
        value={tabKey}
        onValueChange={(v) => navigate(`/dashboard/settings/${v}`)}
        className="mb-4"
      />
    </div>
  );
};

export default DashboardSettingsLayout;
