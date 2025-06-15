
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

const AppBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

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
  };

  const getBreadcrumbName = (path: string) => {
    return breadcrumbMap[path] || path;
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="mb-0">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard" className="flex items-center text-white">
                <Home className="h-4 w-4" color="white" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const displayName = getBreadcrumbName(name);

            return (
              <React.Fragment key={name}>
                <BreadcrumbSeparator>
                  <span className="text-white/80">/</span>
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-white font-semibold">
                      {displayName}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link className="text-white/90 hover:underline" to={routeTo}>
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
