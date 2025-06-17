import { ReactNode } from "react";
import NavTabs from "../dashboard/NavTabs";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="w-full animate-fade-in">
      <NavTabs />
      {children}
    </div>
  );
};

export default DashboardLayout;
