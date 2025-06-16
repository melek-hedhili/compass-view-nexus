
import React, { useState } from "react";
import { Folder, Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DossierDetail from "./dossier-detail";

const Dossiers = () => {
  const [selectedDossier, setSelectedDossier] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for dossiers
  const dossiers = [
    {
      id: "1",
      title: "Création - Chocolat & Co",
      subtitle: "Cabinet MAZARS",
      status: "En cours",
      date: "2025-01-15",
    },
    {
      id: "2", 
      title: "Modification - Tech Solutions",
      subtitle: "Cabinet DELOITTE",
      status: "En attente",
      date: "2025-01-14",
    },
    {
      id: "3",
      title: "Dissolution - StartUp Inc",
      subtitle: "Cabinet PWC",
      status: "Terminé",
      date: "2025-01-13",
    },
  ];

  const filteredDossiers = dossiers.filter(dossier =>
    dossier.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "bg-blue-100 text-blue-700";
      case "En attente":
        return "bg-yellow-100 text-yellow-700";
      case "Terminé":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (selectedDossier) {
    return (
      <DossierDetail
        dossierId={selectedDossier}
        onClose={() => setSelectedDossier(null)}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-formality-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Dossiers</h1>
        </div>
        <Button className="bg-formality-primary hover:bg-formality-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau dossier
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un dossier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Dossiers grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDossiers.map((dossier) => (
          <div
            key={dossier.id}
            onClick={() => setSelectedDossier(dossier.id)}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-formality-primary/10 rounded-lg flex items-center justify-center">
                  <Folder className="h-5 w-5 text-formality-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {dossier.title}
                  </h3>
                  <p className="text-gray-500 text-xs">{dossier.subtitle}</p>
                </div>
              </div>
              <Badge className={`text-xs ${getStatusColor(dossier.status)}`}>
                {dossier.status}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              Dernière modification: {dossier.date}
            </div>
          </div>
        ))}
      </div>

      {filteredDossiers.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun dossier trouvé
          </h3>
          <p className="text-gray-500">
            Aucun dossier ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dossiers;
