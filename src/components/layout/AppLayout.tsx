
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Folder, Settings, Menu } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import Logo from "../Logo";
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
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { logout, user } = useAuth();
  const location = useLocation();
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

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible={isMobile ? "offcanvas" : "icon"}>
          <SidebarHeader>
            <div className="flex items-center justify-between px-4 py-3">
              <Link to="/dashboard" className="flex items-center">
                <Logo />
              </Link>
              {user && (
                <div className="text-sm font-medium ml-2 text-gray-600 group-data-[collapsible=icon]:hidden">
                  {user.role}
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-2">
            <SidebarMenu className="space-y-2">
              {/* Show Mail feature to Admin and Juriste only */}
              {(user?.role === "ADMIN" || user?.role === "JURIST") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/mail")}
                    tooltip="Boîte mail"
                    className={`transition-all rounded-[10px] ${
                      isActive("/dashboard/mail")
                        ? "bg-blue-100 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Link
                      to="/dashboard/mail"
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <Mail className="h-5 w-5 text-formality-primary" />
                      <span>Boîte mail</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              {/* Show Dossiers feature to all users */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/dossiers")}
                  tooltip="Dossiers"
                  className={`transition-all rounded-[10px] ${
                    isActive("/dashboard/dossiers")
                      ? "bg-blue-100 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Link
                    to="/dashboard/dossiers"
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <Folder className="h-5 w-5 text-formality-primary" />
                    <span>Dossiers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Show Settings feature to Admin and Jurist only */}
              {(user?.role === "ADMIN" || user?.role === "JURIST") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard")}
                    tooltip="Paramètres"
                    className={`transition-all rounded-[10px] ${
                      isActive("/dashboard")
                        ? "bg-blue-100 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <Settings className="h-5 w-5 text-formality-primary" />
                      <span>Paramètres</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="px-3 py-3">
            <Button
              variant="ghost"
              onClick={logout}
              className="flex w-full items-center justify-start gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-[10px] hover:bg-gray-200 group-data-[collapsible=icon]:justify-center"
            >
              <LogOut size={18} />
              <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          {/* Mobile header with menu toggle */}
          {isMobile && (
            <div className="sticky top-0 z-40 flex items-center gap-4 border-b bg-white px-4 py-3 shadow-sm">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <Link to="/dashboard" className="flex items-center">
                <Logo />
              </Link>
              {user && (
                <div className="ml-auto text-sm font-medium text-gray-600">
                  {user.role}
                </div>
              )}
            </div>
          )}
          
          <div className="p-4 w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
