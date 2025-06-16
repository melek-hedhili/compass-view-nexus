
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Users, FileText, List, BarChart3, Shield, Building } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Quotes from "./tabs/quotes/Quotes";
import Controls from "./tabs/controls/Controls";
import Documents from "./tabs/documents/Documents";
import Lists from "./tabs/lists/Lists";
import Users from "./tabs/users/Users";
import Contracts from "./tabs/contracts/Contracts";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("quotes");

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-formality-primary" />
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger 
            value="quotes" 
            className="flex items-center gap-2 text-sm"
            onClick={() => navigate("/dashboard/quotes")}
          >
            <BarChart3 className="h-4 w-4" />
            Données
          </TabsTrigger>
          <TabsTrigger 
            value="controls"
            className="flex items-center gap-2 text-sm"
            onClick={() => navigate("/dashboard/controls")}
          >
            <Shield className="h-4 w-4" />
            Contrôles
          </TabsTrigger>
          <TabsTrigger 
            value="documents"
            className="flex items-center gap-2 text-sm"
            onClick={() => navigate("/dashboard/documents")}
          >
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger 
            value="lists"
            className="flex items-center gap-2 text-sm"
            onClick={() => navigate("/dashboard/lists")}
          >
            <List className="h-4 w-4" />
            Listes
          </TabsTrigger>
          <TabsTrigger 
            value="users"
            className="flex items-center gap-2 text-sm"
            onClick={() => navigate("/dashboard/users")}
          >
            <Users className="h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger 
            value="contracts"
            className="flex items-center gap-2 text-sm"
            onClick={() => navigate("/dashboard/contracts")}
          >
            <Building className="h-4 w-4" />
            Arborescences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes">
          <Quotes />
        </TabsContent>

        <TabsContent value="controls">
          <Controls />
        </TabsContent>

        <TabsContent value="documents">
          <Documents />
        </TabsContent>

        <TabsContent value="lists">
          <Lists />
        </TabsContent>

        <TabsContent value="users">
          <Users />
        </TabsContent>

        <TabsContent value="contracts">
          <Contracts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
