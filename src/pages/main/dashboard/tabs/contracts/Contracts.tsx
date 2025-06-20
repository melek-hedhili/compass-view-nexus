import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Check } from "lucide-react";
import ArborescenceTreePreview from "./ArborescenceTreePreview";
import { ArborescenceList } from "./ArborescenceList";
import { ArborescenceData } from "./ArborescenceCard";
import { CreateTreeDto, TreeService } from "@/api-swagger";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { TreeDto } from "@/api-swagger/models/TreeDto";
import { RubriqueData, Famille, SousFamille } from "./types";
import { Input } from "@/components/ui/input";

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

function AddRubriqueInput({
  onAddRubrique,
  rubriques,
}: {
  onAddRubrique: (name: string) => void;
  rubriques: RubriqueData[];
}) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (name: string) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.SECTION,
          index: rubriques.length,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
      setShowInput(false);
      setName("");
    },
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    mutation.mutate(name.trim());
  };

  return showInput ? (
    <div className="flex items-center gap-2 p-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-xs sm:text-sm transition-all duration-150"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") handleCreate();
          if (e.key === "Escape") setShowInput(false);
        }}
        disabled={mutation.status === "pending"}
      />
      <button
        className="ml-2 text-green-600 hover:text-green-800 disabled:opacity-50"
        onClick={handleCreate}
        disabled={!name.trim() || mutation.status === "pending"}
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  ) : (
    <div
      className="flex items-center gap-2 sm:gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group/add-rubrique"
      onClick={() => setShowInput(true)}
    >
      <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover/add-rubrique:text-blue-500 transition-colors" />
      <span className="text-sm sm:text-base text-gray-500 group-hover/add-rubrique:text-blue-600 transition-colors font-medium">
        Ajouter une rubrique
      </span>
    </div>
  );
}

const Contracts = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedArborescence, setSelectedArborescence] =
    useState<ArborescenceData | null>(null);
  const queryClient = useQueryClient();

  // Replace useEffect with useQuery
  const { data: editTrees = [], isLoading: editLoading } = useQuery({
    queryKey: ["tree"],
    queryFn: async () => {
      const res = await TreeService.treeControllerFindAll({
        page: "1",
        perPage: "100",
      });
      const flat = res.data || [];
      return buildAllRubriquesFromFlat(flat);
    },
    enabled: viewMode === "edit" || viewMode === "create",
  });

  const deleteRubriqueMutation = useMutation({
    mutationFn: (id: string) => TreeService.treeControllerRemove({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
      toast.success("Rubrique supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la rubrique");
    },
  });

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
  };

  const createRubriqueMutation = useMutation({
    mutationFn: (name: string) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.SECTION,
          index: editTrees.length,
        },
      }),
    onSuccess: () => {
      toast.success("Rubrique créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
    onError: () => {
      toast.error("Erreur lors de la création de la rubrique");
    },
  });

  const handleCreateRubrique = () => {
    const name = prompt("Nom de la nouvelle rubrique:");
    if (name?.trim()) {
      createRubriqueMutation.mutate(name.trim());
    }
  };

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
            {editTrees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AddRubriqueInput
                  onAddRubrique={(name) => {
                    TreeService.treeControllerCreate({
                      requestBody: {
                        fieldName: name,
                        type: CreateTreeDto.type.SECTION,
                        index: editTrees.length,
                      },
                    })
                      .then(() => {
                        toast.success("Rubrique créée avec succès");
                        queryClient.invalidateQueries({ queryKey: ["tree"] });
                      })
                      .catch(() => {
                        toast.error(
                          "Erreur lors de la création de la rubrique"
                        );
                      });
                  }}
                  rubriques={editTrees}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {editTrees
                  .slice()
                  .sort((a, b) => a.index - b.index)
                  .map((tree) => (
                    <ArborescenceTreePreview
                      key={tree.id}
                      initialTree={tree}
                      onDelete={() => deleteRubriqueMutation.mutate(tree.id)}
                    />
                  ))}
                <AddRubriqueInput
                  onAddRubrique={(name) => {
                    TreeService.treeControllerCreate({
                      requestBody: {
                        fieldName: name,
                        type: CreateTreeDto.type.SECTION,
                        index: editTrees.length,
                      },
                    })
                      .then(() => {
                        toast.success("Rubrique créée avec succès");
                        queryClient.invalidateQueries({ queryKey: ["tree"] });
                      })
                      .catch(() => {
                        toast.error(
                          "Erreur lors de la création de la rubrique"
                        );
                      });
                  }}
                  rubriques={editTrees}
                />
              </div>
            )}
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
            ) : editTrees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <AddRubriqueInput
                  onAddRubrique={(name) => {
                    TreeService.treeControllerCreate({
                      requestBody: {
                        fieldName: name,
                        type: CreateTreeDto.type.SECTION,
                        index: editTrees.length,
                      },
                    })
                      .then(() => {
                        toast.success("Rubrique créée avec succès");
                        queryClient.invalidateQueries({ queryKey: ["tree"] });
                      })
                      .catch(() => {
                        toast.error(
                          "Erreur lors de la création de la rubrique"
                        );
                      });
                  }}
                  rubriques={editTrees}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {editTrees
                  .slice()
                  .sort((a, b) => a.index - b.index)
                  .map((tree) => (
                    <ArborescenceTreePreview
                      key={tree.id}
                      initialTree={tree}
                      onDelete={() => deleteRubriqueMutation.mutate(tree.id)}
                    />
                  ))}
                <AddRubriqueInput
                  onAddRubrique={(name) => {
                    TreeService.treeControllerCreate({
                      requestBody: {
                        fieldName: name,
                        type: CreateTreeDto.type.SECTION,
                        index: editTrees.length,
                      },
                    })
                      .then(() => {
                        toast.success("Rubrique créée avec succès");
                        queryClient.invalidateQueries({ queryKey: ["tree"] });
                      })
                      .catch(() => {
                        toast.error(
                          "Erreur lors de la création de la rubrique"
                        );
                      });
                  }}
                  rubriques={editTrees}
                />
              </div>
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
