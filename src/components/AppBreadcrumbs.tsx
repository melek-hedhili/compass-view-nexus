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
  quotes: "Données",
  controls: "Contrôles",
  documents: "Documents",
  lists: "Listes",
  users: "Utilisateurs",
  contracts: "Arborescences",
  inbox: "Boîte de réception",
  sent: "Envoyés",
  archived: "Archivés",
};
const nonClickablePaths = [
  "mail",
  "dossiers",
  "quotes",
  "controls",
  "documents",
  "lists",
  "users",
  "contracts",
];
const getBreadcrumbName = (path: string) => breadcrumbMap[path] || path;
const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard" className="flex items-center">
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
                    <BreadcrumbPage>{displayName}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={routeTo}>{displayName}</Link>
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
