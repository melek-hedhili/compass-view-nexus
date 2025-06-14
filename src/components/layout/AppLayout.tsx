
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Folder, Settings, Menu, X } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: "Boîte mail",
    path: "/dashboard/mail",
    icon: Mail,
    roles: ["ADMIN", "JURIST"],
  },
  {
    title: "Dossiers",
    path: "/dashboard/dossiers", 
    icon: Folder,
    roles: ["ADMIN", "JURIST", "USER"],
  },
  {
    title: "Paramètres",
    path: "/dashboard",
    icon: Settings,
    roles: ["ADMIN", "JURIST"],
  },
];

const MobileHeader = () => {
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 md:hidden">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Logo />
      </div>
      {user && (
        <div className="text-sm font-medium text-gray-600">
          {user.role}
        </div>
      )}
    </div>
  );
};

const AppSidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

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
    // Close mobile sidebar on navigation
    setOpenMobile(false);
  };

  const handleLogout = () => {
    logout();
    setOpenMobile(false);
  };

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || "")
  );

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center" onClick={() => setOpenMobile(false)}>
            <Logo />
          </Link>
          {user && (
            <div className="text-sm font-medium text-gray-600 hidden md:block">
              {user.role}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={isActive(item.path)}
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2 text-sm font-medium transition-all rounded-lg",
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-3">
        <div className="space-y-2">
          {user && (
            <div className="px-3 py-2 text-sm">
              <div className="font-medium text-gray-900 truncate">{user.email}</div>
              <div className="text-xs text-gray-500">{user.role}</div>
            </div>
          )}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MobileHeader />
          <main className="flex-1 overflow-auto">
            <div className="p-4 w-full">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
