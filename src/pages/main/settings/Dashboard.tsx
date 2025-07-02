import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useEffect, useRef } from "react";

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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = tabs.findIndex((tab) => tab.value === tabKey);
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
      {/* <NavTabs />
    {children} */}
      <Tabs
        value={tabKey}
        onValueChange={(v) => navigate(`/dashboard/settings/${v}`)}
        className="mb-4"
      >
        <TabsList
          ref={tabsListRef}
          className="flex gap-2 rounded-lg bg-gray-100 p-1 w-full md:w-auto overflow-x-auto overflow-y-hidden flex-nowrap h-12 scrollbar-thin scrollbar-thumb-formality-primary/60 scrollbar-thumb-rounded"
        >
          {tabs.map((tab, idx) => (
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

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DashboardSettingsLayout;
