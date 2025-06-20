import React from "react";
import MainLayout from "../components/layout/MainLayout";
import { NavTabs } from "../components/dashboard/NavTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  date: string;
  progress: number;
}

const projectsData: Project[] = [
  {
    id: "1",
    name: "Refonte du site e-commerce",
    description: "Mise à jour complète de la plateforme de vente en ligne",
    status: "En cours",
    date: "12/05/2025",
    progress: 65,
  },
  {
    id: "2",
    name: "Application mobile iOS",
    description: "Développement d'une application native pour les clients",
    status: "À démarrer",
    date: "25/05/2025",
    progress: 0,
  },
  {
    id: "3",
    name: "Intégration CRM",
    description: "Connecter notre système avec la nouvelle solution CRM",
    status: "Terminé",
    date: "01/05/2025",
    progress: 100,
  },
  {
    id: "4",
    name: "Amélioration du tableau de bord",
    description: "Refonte des statistiques et des visualisations",
    status: "En attente",
    date: "18/05/2025",
    progress: 30,
  },
];

const Projects = () => (
  <MainLayout>
    <NavTabs />
    <div className="layout-container py-6 animate-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <FileText className="h-6 w-6 mr-2 text-formality-primary" />
          <h1 className="text-2xl font-bold text-formality-accent">
            Gestion des projets
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Recherche..." className="pl-10 input-elegant" />
          </div>
          <Button className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Nouveau projet</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <Card
            key={project.id}
            className="card-elegant overflow-hidden border-none transition-all hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">
                  {project.name}
                </CardTitle>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    project.status === "En cours"
                      ? "bg-amber-100 text-amber-800"
                      : project.status === "Terminé"
                      ? "bg-green-100 text-green-800"
                      : project.status === "À démarrer"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {project.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Date: {project.date}</span>
                <span className="text-formality-primary font-medium">
                  {project.progress}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-formality-primary rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="card-elegant border-dashed border-2 border-gray-200 flex flex-col items-center justify-center h-full min-h-[220px] transition-all hover:border-formality-primary hover:bg-formality-primary/5 cursor-pointer">
          <Plus className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-gray-500 font-medium">Ajouter un projet</p>
        </Card>
      </div>
    </div>
  </MainLayout>
);

export default Projects;
