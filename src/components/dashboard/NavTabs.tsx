
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, Database, List, FileText, Folder, User } from "lucide-react";

const tabs = [
  { name: "Client", path: "/dashboard", icon: Users },
  { name: "Données", path: "/dashboard/quotes", icon: Database },
  { name: "Controles", path: "/dashboard/controls", icon: List },
  { name: "Documents", path: "/dashboard/documents", icon: FileText },
  { name: "Listes", path: "/dashboard/lists", icon: List },
  { name: "Utilisateurs", path: "/dashboard/users", icon: User },
  { name: "Arborescences", path: "/dashboard/contracts", icon: Folder }
];

export function NavTabs() {
  const location = useLocation();

  return (
    <div className="bg-white shadow-sm mb-6 rounded-md">
      <nav className="max-w-full overflow-x-auto scrollbar-none" aria-label="Tabs">
        <div className="flex">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              to={tab.path}
              className={cn(
                location.pathname === tab.path
                  ? "border-formality-primary text-formality-primary "
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                "flex items-center whitespace-nowrap border-b-2 py-3 px-4 text-sm font-medium transition-all"
              )}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              <span>{tab.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default NavTabs;
