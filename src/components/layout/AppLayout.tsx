
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Folder, Settings, Menu } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
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
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEmailNotifications } from "@/hooks/use-email-notifications";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { logout, user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  useEmailNotifications({ isAuthenticated });

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
        <Sidebar 
          variant="sidebar" 
          collapsible={isMobile ? "offcanvas" : "icon"}
          // Set the sidebar background to orange - unified theme
          className="border-r border-gray-200 bg-formality-primary"
        >
          <SidebarHeader className="border-b border-gray-100 bg-formality-primary">
            <div className="flex items-center justify-between px-4 py-4">
              <Link to="/dashboard" className="flex items-center">
                <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center shadow-sm">
                  <span className="text-formality-primary font-bold text-lg">F</span>
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
          
          <SidebarContent className="px-3 py-4 bg-formality-primary">
            <SidebarMenu className="space-y-2">
              {(user?.role === "ADMIN" || user?.role === "JURIST") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/mail")}
                    className={`transition-all duration-200 rounded-lg ${
                      isActive("/dashboard/mail")
                        ? "bg-white/5 text-white font-semibold border border-white/20 shadow-sm hover:bg-white/10"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Link
                      to="/dashboard/mail"
                      className="flex items-center gap-3 px-3 py-2.5 w-full"
                    >
                      <Mail className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium group-data-[collapsible=icon]:hidden">Boîte mail</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard/dossiers")}
                  className={`transition-all duration-200 rounded-lg ${
                    isActive("/dashboard/dossiers")
                      ? "bg-white/5 text-white font-semibold border border-white/20 shadow-sm hover:bg-white/10"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Link
                    to="/dashboard/dossiers"
                    className="flex items-center gap-3 px-3 py-2.5 w-full"
                  >
                    <Folder className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium group-data-[collapsible=icon]:hidden">Dossiers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {(user?.role === "ADMIN" || user?.role === "JURIST") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard")}
                    className={`transition-all duration-200 rounded-lg ${
                      isActive("/dashboard")
                        ? "bg-white/5 text-white font-semibold border border-white/20 shadow-sm hover:bg-white/10"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-3 py-2.5 w-full"
                    >
                      <Settings className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium group-data-[collapsible=icon]:hidden">Paramètres</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-amber-200 bg-formality-primary/90 px-3 py-3">
            <Button
              variant="ghost"
              onClick={logout}
              className="flex w-full items-center justify-start gap-3 px-3 py-2.5 text-white/80 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all group-data-[collapsible=icon]:justify-center"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden font-medium">Déconnexion</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Mobile header - always visible on mobile */}
          <div className="sticky top-0 z-50 flex items-center gap-4 border-b bg-formality-primary px-4 py-3 shadow-sm md:hidden">
            <SidebarTrigger className="rounded-md border border-amber-200 bg-formality-primary p-2 hover:bg-amber-100/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-formality-primary">
              <Menu className="h-5 w-5 text-white" />
            </SidebarTrigger>
            <Link to="/dashboard" className="flex items-center">
              <Logo />
            </Link>
            {user && (
              <div className="ml-auto text-xs font-medium text-white bg-formality-primary/20 px-2 py-1 rounded">
                {user.role}
              </div>
            )}
          </div>
          {/* Breadcrumbs header with unified background */}
          <div className="sticky top-0 z-40 bg-formality-primary px-6 py-3 shadow-sm">
            {/* Use white text for contrast */}
            <AppBreadcrumbs />
          </div>
          <div className="p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
