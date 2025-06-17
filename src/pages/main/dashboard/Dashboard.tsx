import { Route, Routes } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Users from "./tabs/users/Users";
import Contracts from "./tabs/contracts/Contracts";
import Lists from "./tabs/lists/Lists";
import Documents from "./tabs/documents/Documents";
import Controls from "./tabs/controls/Controls";
import Quotes from "./tabs/quotes/Quotes";
import Client from "./tabs/client/Client";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Client />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/controls" element={<Controls />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
