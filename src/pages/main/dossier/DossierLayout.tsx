import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useEffect, useRef } from "react";

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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsListRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const idx = dossierTabs.findIndex((tab) => tab.value === tabKey);
    if (idx !== -1 && tabRefs.current[idx]) {
      tabRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [tabKey]);

  return (
    <div className="w-full animate-fade-in">
      <Tabs
        value={tabKey}
        onValueChange={(v) => navigate(`/dashboard/dossiers/${dossierId}/${v}`)}
        className="mb-4"
      >
        <TabsList
          ref={tabsListRef}
          className="flex gap-2 rounded-lg bg-gray-100 p-1 w-full md:w-auto overflow-x-auto overflow-y-hidden flex-nowrap h-12 scrollbar-thin scrollbar-thumb-formality-primary/60 scrollbar-thumb-rounded"
        >
          {dossierTabs.map((tab, idx) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              ref={(el) => (tabRefs.current[idx] = el)}
              className="flex items-center gap-2 px-4 py-2 data-[state=active]:text-formality-primary rounded-lg font-semibold transition-colors min-w-max h-10"
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Outlet />
    </div>
  );
};

export default DossierLayout;
