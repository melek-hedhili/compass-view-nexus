import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ArborescenceCard, ArborescenceData } from "./ArborescenceCard";
import { ArborescenceEmptyState } from "./ArborescenceEmptyState";
import { TreeService } from "@/api-swagger/services/TreeService";
import { TreeDto } from "@/api-swagger/models/TreeDto";
import { CreateTreeDto } from "@/api-swagger/models/CreateTreeDto";
import { Card, CardContent } from "@/components/ui/card";

// Utility to transform flat TreeDto[] to nested ArborescenceData[]
function buildArborescencesFromFlat(flat: TreeDto[]): ArborescenceData[] {
  // Group by SECTION (rubrique)
  const sections = flat.filter((item) => item.type === "SECTION");
  return sections.map((section) => {
    const familles = flat.filter(
      (item) =>
        item.type === "TITLE" && item.parent && item.parent._id === section._id
    );
    return {
      id: section._id || section.fieldName,
      name: section.fieldName,
      description: undefined,
      famillesCount: familles.length,
      sousFamillesCount: flat.filter(
        (item) =>
          item.type === "SUB_TITLE" &&
          familles.some((f) => f._id === item.parent?._id)
      ).length,
      createdAt: section.created_at || "",
      updatedAt: section.updated_at || "",
      tree: {
        id: section._id || section.fieldName,
        rubriqueName: section.fieldName,
        familles: familles.map((famille) => {
          const sousFamilles = flat.filter(
            (item) =>
              item.type === "SUB_TITLE" &&
              item.parent &&
              item.parent._id === famille._id
          );
          return {
            id: famille._id || famille.fieldName,
            name: famille.fieldName,
            sousFamilles: sousFamilles.map((sf) => ({
              id: sf._id || sf.fieldName,
              name: sf.fieldName,
              parentId: famille._id || famille.fieldName,
              type: CreateTreeDto.type.SUB_TITLE,
              index: sf.index,
            })),
            parentId: section._id || section.fieldName,
            type: CreateTreeDto.type.TITLE,
            index: famille.index,
          };
        }),
        type: CreateTreeDto.type.SECTION,
        index: section.index,
      },
    };
  });
}

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
  const [arborescences, setArborescences] = useState<ArborescenceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    TreeService.treeControllerFindAll({ page: "1", perPage: "100" })
      .then((res) => {
        const flat = res.data || [];
        setArborescences(buildArborescencesFromFlat(flat));
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredArborescences = arborescences.filter(
    (arb) =>
      arb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (arb.description &&
        arb.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement...</div>;
  }

  if (arborescences.length === 0) {
    return <ArborescenceEmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="space-y-4 sm:space-y-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full max-w-3xl mx-auto">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Arborescences
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gérez vos arborescences de rubriques, familles et sous-familles
          </p>
        </div>
        {arborescences.length > 0 ? (
          <Button
            onClick={() => onEditArborescence(arborescences[0])}
            className="bg-formality-primary hover:bg-formality-primary/90 w-full sm:w-auto"
          >
            Éditer l'arborescence
          </Button>
        ) : (
          <Button
            onClick={onCreateNew}
            className="bg-formality-primary hover:bg-formality-primary/90 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="sm:inline">Nouvelle arborescence</span>
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une arborescence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Grid */}
      {filteredArborescences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Aucune arborescence trouvée pour votre recherche.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full">
          {filteredArborescences.map((arborescence) => (
            <Card
              key={arborescence.id}
              className="w-full max-w-2xl mx-auto bg-white shadow-md"
            >
              <CardContent className="py-6">
                <ArborescenceCard
                  arborescence={arborescence}
                  onSelect={onSelectArborescence}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
