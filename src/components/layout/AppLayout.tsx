import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Folder, Settings, Menu } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import AppBreadcrumbs from "../AppBreadcrumbs";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEmailNotifications } from "@/hooks/use-email-notifications";

interface AppLayoutProps {
  children: React.ReactNode;
}

const SidebarNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }

    if (
      path === "/dashboard" &&
      (location.pathname.includes("/dashboard/quotes") ||
        location.pathname.includes("/dashboard/controls") ||
        location.pathname.includes("/dashboard/documents") ||
        location.pathname.includes("/dashboard/lists") ||
        location.pathname.includes("/dashboard/users") ||
        location.pathname.includes("/dashboard/contracts"))
    ) {
      return true;
    }

    return (
      location.pathname === path ||
      (location.pathname.startsWith(path) && path !== "/dashboard")
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu className="space-y-2">
      {/* Show Mail feature to Admin and Juriste only */}
      {(user?.role === "ADMIN" || user?.role === "JURIST") && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => handleNavigation("/dashboard/mail")}
            isActive={isActive("/dashboard/mail")}
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 ease-out ${
              isActive("/dashboard/mail")
                ? "bg-gradient-to-r from-formality-primary/15 to-formality-primary/5 text-formality-primary shadow-lg shadow-formality-primary/10 transform scale-[1.02]"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/50 hover:text-formality-primary hover:shadow-md hover:transform hover:scale-[1.01]"
            }`}
          >
            <div className="flex items-center gap-3 px-3 py-3 w-full relative z-10">
              <Mail className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ease-out ${
                isActive("/dashboard/mail") 
                  ? "scale-110 drop-shadow-sm" 
                  : "group-hover:scale-105 group-hover:rotate-3"
              }`} />
              <span className="font-medium group-data-[collapsible=icon]:hidden transition-all duration-300">
                Boîte mail
              </span>
            </div>
            {isActive("/dashboard/mail") && (
              <div className="absolute inset-0 bg-gradient-to-r from-formality-primary/10 to-transparent opacity-60 animate-pulse" />
            )}
            <div className={`absolute left-0 top-0 h-full w-1 bg-formality-primary transition-all duration-500 ease-out ${
              isActive("/dashboard/mail") ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            }`} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      {/* Show Dossiers feature to all users */}
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => handleNavigation("/dashboard/dossiers")}
          isActive={isActive("/dashboard/dossiers")}
          className={`group relative overflow-hidden rounded-lg transition-all duration-300 ease-out ${
            isActive("/dashboard/dossiers")
              ? "bg-gradient-to-r from-formality-primary/15 to-formality-primary/5 text-formality-primary shadow-lg shadow-formality-primary/10 transform scale-[1.02]"
              : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/50 hover:text-formality-primary hover:shadow-md hover:transform hover:scale-[1.01]"
          }`}
        >
          <div className="flex items-center gap-3 px-3 py-3 w-full relative z-10">
            <Folder className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ease-out ${
              isActive("/dashboard/dossiers") 
                ? "scale-110 drop-shadow-sm" 
                : "group-hover:scale-105 group-hover:rotate-3"
            }`} />
            <span className="font-medium group-data-[collapsible=icon]:hidden transition-all duration-300">
              Dossiers
            </span>
          </div>
          {isActive("/dashboard/dossiers") && (
            <div className="absolute inset-0 bg-gradient-to-r from-formality-primary/10 to-transparent opacity-60 animate-pulse" />
          )}
          <div className={`absolute left-0 top-0 h-full w-1 bg-formality-primary transition-all duration-500 ease-out ${
            isActive("/dashboard/dossiers") ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          }`} />
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Show Settings feature to Admin and Jurist only */}
      {(user?.role === "ADMIN" || user?.role === "JURIST") && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => handleNavigation("/dashboard")}
            isActive={isActive("/dashboard")}
            className={`group relative overflow-hidden rounded-lg transition-all duration-300 ease-out ${
              isActive("/dashboard")
                ? "bg-gradient-to-r from-formality-primary/15 to-formality-primary/5 text-formality-primary shadow-lg shadow-formality-primary/10 transform scale-[1.02]"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-50/50 hover:text-formality-primary hover:shadow-md hover:transform hover:scale-[1.01]"
            }`}
          >
            <div className="flex items-center gap-3 px-3 py-3 w-full relative z-10">
              <Settings className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ease-out ${
                isActive("/dashboard") 
                  ? "scale-110 drop-shadow-sm" 
                  : "group-hover:scale-105 group-hover:rotate-12"
              }`} />
              <span className="font-medium group-data-[collapsible=icon]:hidden transition-all duration-300">
                Paramètres
              </span>
            </div>
            {isActive("/dashboard") && (
              <div className="absolute inset-0 bg-gradient-to-r from-formality-primary/10 to-transparent opacity-60 animate-pulse" />
            )}
            <div className={`absolute left-0 top-0 h-full w-1 bg-formality-primary transition-all duration-500 ease-out ${
              isActive("/dashboard") ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
            }`} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const { logout, user, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  useEmailNotifications({ isAuthenticated });

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          variant="sidebar"
          collapsible={isMobile ? "offcanvas" : "icon"}
          className="border-r border-gray-200 bg-white"
        >
          <SidebarHeader className="border-b border-gray-100 bg-gradient-to-r from-formality-primary to-amber-500">
            <div className="flex items-center justify-between px-4 py-4">
              <Link to="/dashboard" className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center shadow-sm">
                  <span className="text-formality-primary font-bold text-lg">
                    X
                  </span>
                </div>
                <span className="ml-3 text-lg font-semibold text-white group-data-[collapsible=icon]:hidden">
                  Formality
                </span>
              </Link>
              {user && (
                <div className="text-xs font-medium text-white/90 bg-white/20 px-2 py-1 rounded-full group-data-[collapsible=icon]:hidden">
                  {user.role}
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4 bg-white">
            <SidebarNavigation />
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 bg-white px-3 py-3">
            <Button
              variant="ghost"
              onClick={logout}
              className="flex w-full items-center justify-start gap-3 px-3 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group-data-[collapsible=icon]:justify-center hover:shadow-md"
            >
              <LogOut size={18} className="flex-shrink-0 transition-transform duration-300 hover:scale-110" />
              <span className="group-data-[collapsible=icon]:hidden font-medium">
                Déconnexion
              </span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Mobile header - always visible on mobile */}
          <div className="sticky top-0 z-50 flex items-center gap-4 border-b bg-white px-4 py-3 shadow-sm md:hidden">
            <SidebarTrigger className="rounded-md border border-gray-200 bg-white p-2 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-formality-primary transition-all duration-200">
              <Menu className="h-5 w-5 text-gray-700" />
            </SidebarTrigger>
            <Link to="/dashboard" className="flex items-center">
              <Logo />
            </Link>
            {user && (
              <div className="ml-auto text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {user.role}
              </div>
            )}
          </div>

          <div className="p-6 w-full">
            <AppBreadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
