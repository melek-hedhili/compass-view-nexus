
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ArborescenceCard, ArborescenceData } from "./ArborescenceCard";
import { ArborescenceEmptyState } from "./ArborescenceEmptyState";

// Dummy data
const dummyArborescences: ArborescenceData[] = [
  {
    id: "1",
    name: "Arborescence Marketing",
    description: "Organisation des campagnes et contenus marketing",
    famillesCount: 5,
    sousFamillesCount: 12,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Arborescence Produits",
    description: "Classification des produits et services",
    famillesCount: 8,
    sousFamillesCount: 24,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-22T11:15:00Z",
  },
  {
    id: "3",
    name: "Arborescence RH",
    description: "Organisation des processus ressources humaines",
    famillesCount: 3,
    sousFamillesCount: 9,
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
];

interface ArborescenceListProps {
  onSelectArborescence: (arborescence: ArborescenceData) => void;
  onCreateNew: () => void;
  onEditArborescence: (arborescence: ArborescenceData) => void;
}

export const ArborescenceList: React.FC<ArborescenceListProps> = ({
  onSelectArborescence,
  onCreateNew,
  onEditArborescence,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [arborescences] = useState<ArborescenceData[]>(dummyArborescences);

  const filteredArborescences = arborescences.filter((arb) =>
    arb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (arb.description && arb.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (arborescences.length === 0) {
    return <ArborescenceEmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Arborescences</h2>
          <p className="text-gray-600 mt-1">
            Gérez vos arborescences de rubriques, familles et sous-familles
          </p>
        </div>
        <Button
          onClick={onCreateNew}
          className="bg-formality-primary hover:bg-formality-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle arborescence
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une arborescence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid */}
      {filteredArborescences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Aucune arborescence trouvée pour votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArborescences.map((arborescence) => (
            <ArborescenceCard
              key={arborescence.id}
              arborescence={arborescence}
              onSelect={onSelectArborescence}
              onEdit={onEditArborescence}
            />
          ))}
        </div>
      )}
    </div>
  );
};
