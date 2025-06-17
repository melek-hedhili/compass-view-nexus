import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ArborescenceTreePreview from "./ArborescenceTreePreview";
import { ArborescenceList } from "./ArborescenceList";
import { ArborescenceData } from "./ArborescenceCard";
import { CreateTreeDto, TreeService } from "@/api-swagger";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { TreeDto } from "@/api-swagger/models/TreeDto";
import { RubriqueData, Famille, SousFamille } from "./types";

type ViewMode = "list" | "create" | "edit" | "details";

// Improved utility to build all rubriques from flat API data
function buildAllRubriquesFromFlat(flat: TreeDto[]): RubriqueData[] {
  // Index all nodes by their _id
  const nodeMap: Record<
    string,
    TreeDto & { familles: string[]; sousFamilles: string[] }
  > = {};
  flat.forEach((item) => {
    nodeMap[item._id] = { ...item, familles: [], sousFamilles: [] };
  });

  // Attach children to their parents (store only IDs)
  flat.forEach((item) => {
    if (item.parent && item.parent._id) {
      const parent = nodeMap[item.parent._id];
      if (!parent) return;
      if (item.type === "TITLE") {
        parent.familles = parent.familles || [];
        parent.familles.push(item._id);
      } else if (item.type === "SUB_TITLE") {
        parent.sousFamilles = parent.sousFamilles || [];
        parent.sousFamilles.push(item._id);
      }
    }
  });

  // Find all SECTION nodes (rubriques)
  const sections = Object.values(nodeMap).filter(
    (node) => node.type === CreateTreeDto.type.SECTION
  );

  // Recursively convert to RubriqueData structure
  function convertSection(
    node: TreeDto & { familles: string[]; sousFamilles: string[] }
  ): RubriqueData {
    return {
      id: node._id,
      rubriqueName: node.fieldName,
      familles: (node.familles || []).map((familleId) =>
        convertFamille(nodeMap[familleId])
      ),
      type: CreateTreeDto.type.SECTION,
      index: node.index,
    };
  }
  function convertFamille(
    node: TreeDto & { familles: string[]; sousFamilles: string[] }
  ): Famille {
    return {
      id: node._id,
      name: node.fieldName,
      sousFamilles: (node.sousFamilles || []).map((sfId) =>
        convertSousFamille(nodeMap[sfId])
      ),
      parentId: node.parent?._id,
      type: CreateTreeDto.type.TITLE,
      index: node.index,
    };
  }
  function convertSousFamille(
    node: TreeDto & { familles: string[]; sousFamilles: string[] }
  ): SousFamille {
    return {
      id: node._id,
      name: node.fieldName,
      parentId: node.parent?._id,
      type: CreateTreeDto.type.SUB_TITLE,
      index: node.index,
    };
  }

  return sections.map(convertSection);
}

const Contracts = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedArborescence, setSelectedArborescence] =
    useState<ArborescenceData | null>(null);
  const [editTrees, setEditTrees] = useState<RubriqueData[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  const handleSelectArborescence = (arborescence: ArborescenceData) => {
    setSelectedArborescence(arborescence);
    setViewMode("details");
  };

  const handleCreateNew = () => {
    setSelectedArborescence(null);
    setViewMode("create");
  };

  const handleEditArborescence = () => {
    setViewMode("edit");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedArborescence(null);
    setEditTrees([]);
  };

  // Fetch all rubriques and their children for edit mode
  useEffect(() => {
    if (viewMode === "edit") {
      setEditLoading(true);
      TreeService.treeControllerFindAll({ page: "1", perPage: "100" })
        .then((res) => {
          const flat = res.data || [];
          const rubriques = buildAllRubriquesFromFlat(flat);
          setEditTrees(rubriques);
        })
        .finally(() => setEditLoading(false));
    }
  }, [viewMode]);

  const createArborescenceMutation = useMutation({
    mutationFn: (arborescence: CreateTreeDto) => {
      return TreeService.treeControllerCreate({
        requestBody: arborescence,
      });
    },
    onSuccess: () => {
      toast.success("Arborescence créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'arborescence");
    },
  });

  const renderContent = () => {
    switch (viewMode) {
      case "list":
        return (
          <ArborescenceList
            onSelectArborescence={handleSelectArborescence}
            onCreateNew={handleCreateNew}
            onEditArborescence={handleEditArborescence}
          />
        );
      case "create":
        return (
          <div>
            {/* Header with back button */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToList}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux arborescences
              </Button>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Création d'une nouvelle arborescence
              </h2>
            </div>
            <ArborescenceTreePreview />
            <div className="text-center text-gray-500 mt-8">
              <span>
                Créez votre arborescence en ajoutant des rubriques, familles et
                sous-familles. Utilisez le glisser-déposer pour organiser la
                structure.
              </span>
            </div>
          </div>
        );
      case "edit":
        return (
          <div>
            {/* Header with back button */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToList}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux arborescences
              </Button>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Modification de l'arborescence
              </h2>
            </div>
            {editLoading ? (
              <div className="text-center py-8 text-gray-500">
                Chargement...
              </div>
            ) : (
              editTrees.map((tree) => (
                <ArborescenceTreePreview key={tree.id} initialTree={tree} />
              ))
            )}
            <div className="text-center text-gray-500 mt-8">
              <span>
                Modifiez votre arborescence : ajoutez, supprimez ou réorganisez
                les éléments selon vos besoins.
              </span>
            </div>
          </div>
        );
      case "details":
        return (
          <div>
            {/* Header with back button */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToList}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux arborescences
              </Button>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {`Détails de ${selectedArborescence?.name}`}
              </h2>
            </div>
            <ArborescenceTreePreview />
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="mb-8">{renderContent()}</div>;
};

export default Contracts;
