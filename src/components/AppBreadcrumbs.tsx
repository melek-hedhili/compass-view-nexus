import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
const breadcrumbMap: Record<string, string> = {
  dashboard: "Tableau de bord",
  mail: "Boîte mail",
  dossiers: "Dossiers",
  clients: "Clients",
  quotes: "Données",
  controls: "Contrôles",
  mails: "Mails",
  analyse: "Analyse",
  rapport: "Rapport",
  annonce: "Annonce",
  saisie: "Saisie",
  controle: "Contrôle",
  documents: "Documents",
  informations: "Informations",
  lists: "Listes",
  users: "Utilisateurs",
  arboresence: "Arborescences",
  inbox: "Boîte de réception",
  sent: "Envoyés",
  archived: "Archivés",
  settings: "Paramètres",
};
const nonClickablePaths = [
  {
    ...(!location.pathname.includes("dossier/") && {
      dossier: "Dossier",
    }),
  },
  "mail",
  "clients",
  "quotes",
  "controls",
  "documents",
  "lists",
  "users",
  "arboresence",
  "settings",
];
const getBreadcrumbName = (path: string) => breadcrumbMap[path] || path;
const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 overflow-x-hidden">
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap flex items-center whitespace-nowrap">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/settings" className="flex items-center">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const isNonClickablePath = nonClickablePaths.includes(name);
            const shouldBeNonClickable = isLast || isNonClickablePath;
            const displayName = getBreadcrumbName(name);

            return (
              <React.Fragment key={name}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {shouldBeNonClickable ? (
                    <BreadcrumbPage className="truncate max-w-[80px] md:max-w-none md:truncate-none inline-block align-bottom">
                      {displayName}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        className="truncate max-w-[80px] md:max-w-none md:truncate-none inline-block align-bottom"
                        to={routeTo}
                      >
                        {displayName}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AppBreadcrumbs;
