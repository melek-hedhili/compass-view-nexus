import React, { useState } from "react";
import { GripVertical, Plus, Edit3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { RubriqueData, convertToApiFormat, Famille } from "./types";
import SortableFamille from "./components/SortableFamille";
import { TreeService } from "@/api-swagger/services/TreeService";
import { CreateTreeDto } from "@/api-swagger/models/CreateTreeDto";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const ArborescenceTreePreview: React.FC<{
  initialTree?: RubriqueData;
}> = ({ initialTree }) => {
  const [tree, setTree] = useState<RubriqueData>(
    initialTree || {
      id: "",
      rubriqueName: "Rubrique exemple",
      familles: [],
      type: CreateTreeDto.type.SECTION,
      index: 0,
    }
  );

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingFamille, setIsAddingFamille] = useState(false);
  const [newFamilleName, setNewFamilleName] = useState("");
  const [isCreatingFamille, setIsCreatingFamille] = useState(false);
  const [addingSousFamilleIdx, setAddingSousFamilleIdx] = useState<
    number | null
  >(null);
  const [newSousFamilleName, setNewSousFamilleName] = useState("");
  const [isCreatingSousFamille, setIsCreatingSousFamille] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleEditRubrique = () => {
    setTree((prev) => ({ ...prev, isEditingRubrique: true }));
  };

  const handleSaveRubrique = (newName: string) => {
    setTree((prev) => ({
      ...prev,
      rubriqueName: newName,
      isEditingRubrique: false,
    }));
  };

  const handleEditFamille = (famIdx: number) => {
    setTree((prev) => ({
      ...prev,
      familles: prev.familles.map((f, idx) =>
        idx === famIdx ? { ...f, isEditing: true } : f
      ),
    }));
  };

  const handleSaveFamille = (famIdx: number, newName: string) => {
    setTree((prev) => ({
      ...prev,
      familles: prev.familles.map((f, idx) =>
        idx === famIdx ? { ...f, name: newName, isEditing: false } : f
      ),
    }));
  };

  const handleEditSousFamille = (famIdx: number, sfIdx: number) => {
    setTree((prev) => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) =>
        fIdx === famIdx
          ? {
              ...f,
              sousFamilles: f.sousFamilles.map((sf, sIdx) =>
                sIdx === sfIdx ? { ...sf, isEditing: true } : sf
              ),
            }
          : f
      ),
    }));
  };

  const handleSaveSousFamille = (
    famIdx: number,
    sfIdx: number,
    newName: string
  ) => {
    setTree((prev) => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) =>
        fIdx === famIdx
          ? {
              ...f,
              sousFamilles: f.sousFamilles.map((sf, sIdx) =>
                sIdx === sfIdx ? { ...sf, name: newName, isEditing: false } : sf
              ),
            }
          : f
      ),
    }));
  };

  const handleAddFamille = async () => {
    if (!newFamilleName.trim()) return;
    setIsCreatingFamille(true);
    try {
      const index = tree.familles.length;
      const res = await TreeService.treeControllerCreate({
        requestBody: {
          fieldName: newFamilleName,
          type: CreateTreeDto.type.TITLE,
          parentId: tree.id,
          index,
        },
      });
      setTree((prev) => ({
        ...prev,
        familles: [
          ...prev.familles,
          {
            id: res._id,
            name: res.fieldName,
            sousFamilles: [],
            parentId: tree.id,
            type: CreateTreeDto.type.TITLE,
            index: res.index,
          },
        ],
      }));
      setNewFamilleName("");
      setIsAddingFamille(false);
    } catch (e) {
      // handle error
    } finally {
      setIsCreatingFamille(false);
    }
  };

  const handleAddSousFamille = async (famIdx: number) => {
    if (!newSousFamilleName.trim()) return;
    setIsCreatingSousFamille(true);
    try {
      const famille = tree.familles[famIdx];
      const index = famille.sousFamilles.length;
      const res = await TreeService.treeControllerCreate({
        requestBody: {
          fieldName: newSousFamilleName,
          type: CreateTreeDto.type.SUB_TITLE,
          parentId: famille.id,
          index,
        },
      });
      setTree((prev) => ({
        ...prev,
        familles: prev.familles.map((f, idx) =>
          idx === famIdx
            ? {
                ...f,
                sousFamilles: [
                  ...f.sousFamilles,
                  {
                    id: res._id,
                    name: res.fieldName,
                    parentId: famille.id,
                    type: CreateTreeDto.type.SUB_TITLE,
                    index: res.index,
                  },
                ],
              }
            : f
        ),
      }));
      setNewSousFamilleName("");
      setAddingSousFamilleIdx(null);
    } catch (e) {
      // handle error
    } finally {
      setIsCreatingSousFamille(false);
    }
  };

  const handleDeleteSousFamille = (famIdx: number, sfIdx: number) => {
    setTree((prev) => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) =>
        fIdx === famIdx
          ? {
              ...f,
              sousFamilles: f.sousFamilles.filter((_, sIdx) => sIdx !== sfIdx),
            }
          : f
      ),
    }));
  };

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    setOverId((event.over?.id as string) || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const activeFamilleIndex = tree.familles.findIndex(
      (f) => f.id === active.id
    );
    const overFamilleIndex = tree.familles.findIndex((f) => f.id === over.id);

    if (activeFamilleIndex !== -1 && overFamilleIndex !== -1) {
      setTree((prev) => {
        const newFamilles = arrayMove(
          prev.familles,
          activeFamilleIndex,
          overFamilleIndex
        );
        // Update indices after reordering
        return {
          ...prev,
          familles: newFamilles.map((f, idx) => ({ ...f, index: idx })),
        };
      });
      return;
    }

    // Handle sous-famille reordering
    let sourceFamIdx = -1,
      sourceSfIdx = -1,
      targetFamIdx = -1,
      targetSfIdx = -1;

    for (let famIdx = 0; famIdx < tree.familles.length; famIdx++) {
      const famille = tree.familles[famIdx];
      const activeIndex = famille.sousFamilles.findIndex(
        (sf) => sf.id === active.id
      );
      const overIndex = famille.sousFamilles.findIndex(
        (sf) => sf.id === over.id
      );

      if (activeIndex !== -1) {
        sourceFamIdx = famIdx;
        sourceSfIdx = activeIndex;
      }
      if (overIndex !== -1) {
        targetFamIdx = famIdx;
        targetSfIdx = overIndex;
      }
    }

    if (sourceFamIdx !== -1 && targetFamIdx !== -1) {
      setTree((prev) => {
        const newFamilles = [...prev.familles];
        const sourceFamily = { ...newFamilles[sourceFamIdx] };
        const targetFamily =
          sourceFamIdx === targetFamIdx
            ? sourceFamily
            : { ...newFamilles[targetFamIdx] };

        const [movedItem] = sourceFamily.sousFamilles.splice(sourceSfIdx, 1);

        if (sourceFamIdx === targetFamIdx && sourceSfIdx < targetSfIdx) {
          targetSfIdx -= 1;
        }

        targetFamily.sousFamilles.splice(targetSfIdx, 0, movedItem);

        // Update indices after reordering
        targetFamily.sousFamilles = targetFamily.sousFamilles.map(
          (sf, idx) => ({
            ...sf,
            index: idx,
          })
        );

        newFamilles[sourceFamIdx] = sourceFamily;
        if (sourceFamIdx !== targetFamIdx) {
          newFamilles[targetFamIdx] = targetFamily;
        }

        return { ...prev, familles: newFamilles };
      });
    }
  }

  const handleSaveTree = async () => {
    try {
      setIsSaving(true);
      const treeData = convertToApiFormat(tree);

      // Create each item in the tree
      for (const item of treeData) {
        await TreeService.treeControllerCreate({
          requestBody: item,
        });
      }

      toast.success("Arborescence sauvegardée avec succès");
    } catch (error) {
      console.error("Error saving tree:", error);
      toast.error("Erreur lors de la sauvegarde de l'arborescence");
    } finally {
      setIsSaving(false);
    }
  };

  const getDragState = (itemId: string) => {
    const isActive = !!activeId;
    const isDragging = activeId === itemId;
    const isOver = overId === itemId;

    return {
      isActive,
      isDragging,
      isOver,
      dropPosition: "below" as const,
      dragType: getActiveDragType(),
    };
  };

  const getActiveDragType = (): "famille" | "sousFamille" | undefined => {
    if (!activeId) return undefined;

    if (tree.familles.find((f) => f.id === activeId)) {
      return "famille";
    }

    for (const fam of tree.familles) {
      if (fam.sousFamilles.find((sf) => sf.id === activeId)) {
        return "sousFamille";
      }
    }

    return undefined;
  };

  const getDraggedItem = () => {
    if (!activeId) return null;

    const famille = tree.familles.find((f) => f.id === activeId);
    if (famille) {
      return { type: "famille", item: famille };
    }

    for (const fam of tree.familles) {
      const sousFamille = fam.sousFamilles.find((sf) => sf.id === activeId);
      if (sousFamille) {
        return { type: "sousFamille", item: sousFamille };
      }
    }

    return null;
  };

  const draggedItem = getDraggedItem();

  const setFamilles = (updater) => {
    setTree((prev) => ({
      ...prev,
      familles:
        typeof updater === "function" ? updater(prev.familles) : updater,
    }));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-[500px] p-3 sm:p-6">
        <Card className="max-w-5xl mx-auto shadow-lg">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* Rubrique Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
                <div className="w-2 h-8 sm:h-12 bg-formality-primary rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  {tree.isEditingRubrique ? (
                    <Input
                      defaultValue={tree.rubriqueName}
                      autoFocus
                      onBlur={(e) => handleSaveRubrique(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveRubrique(e.currentTarget.value);
                        }
                      }}
                      className="text-base sm:text-lg font-semibold"
                    />
                  ) : (
                    <div
                      className="text-base sm:text-lg font-semibold cursor-pointer hover:bg-gray-50 p-2 rounded truncate"
                      onClick={handleEditRubrique}
                    >
                      {tree.rubriqueName}
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-formality-primary/10 text-formality-primary border-formality-primary/20 flex-shrink-0"
                  onClick={handleEditRubrique}
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Rubrique</span>
                </Button>
              </div>
            </div>

            {/* Familles */}
            <div className="space-y-3 sm:space-y-4">
              <SortableContext
                items={tree.familles.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                {tree.familles
                  .slice()
                  .sort((a, b) => a.index - b.index)
                  .map((famille, famIdx) => (
                    <SortableFamille
                      key={famille.id}
                      famille={famille}
                      famIdx={famIdx}
                      onEdit={handleEditFamille}
                      onSave={handleSaveFamille}
                      onAddSousFamille={handleAddSousFamille}
                      onEditSousFamille={handleEditSousFamille}
                      onSaveSousFamille={handleSaveSousFamille}
                      onDeleteSousFamille={handleDeleteSousFamille}
                      dragState={getDragState(famille.id)}
                      setFamilles={setFamilles}
                    />
                  ))}
              </SortableContext>

              {/* Add Famille Button */}
              <AddFamilleInput
                rubriqueId={tree.id}
                familles={tree.familles}
                setFamilles={setFamilles}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
        style={{
          transformOrigin: "50% 50%",
        }}
      >
        {draggedItem ? (
          <div className="opacity-95 rotate-2 scale-105 transform-gpu shadow-2xl">
            <Card className="border-2 border-blue-400 bg-white shadow-2xl">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-blue-500" />
                  <div
                    className={cn(
                      "w-1 h-6 rounded-full",
                      draggedItem.type === "famille"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    )}
                  ></div>
                  <span className="font-medium text-gray-800">
                    {draggedItem.item.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

function AddFamilleInput({
  rubriqueId,
  familles,
  setFamilles,
}: {
  rubriqueId: string;
  familles: Famille[];
  setFamilles: React.Dispatch<React.SetStateAction<Famille[]>>;
}) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      name,
      parentId,
      index,
    }: {
      name: string;
      parentId: string;
      index: number;
    }) => {
      return TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.TITLE,
          parentId,
          index,
        },
      });
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
      setFamilles((prevFamilles) => [
        ...prevFamilles,
        {
          id: res._id,
          name: res.fieldName,
          sousFamilles: [],
          parentId: rubriqueId,
          type: CreateTreeDto.type.TITLE,
          index: res.index,
        },
      ]);
      setShowInput(false);
      setName("");
    },
  });
  const handleCreate = () => {
    if (!name.trim()) return;
    mutation.mutate({ name, parentId: rubriqueId, index: familles.length });
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
      className="flex items-center gap-2 sm:gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group/add-famille"
      onClick={() => setShowInput(true)}
    >
      <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover/add-famille:text-blue-500 transition-colors" />
      <span className="text-sm sm:text-base text-gray-500 group-hover/add-famille:text-blue-600 transition-colors font-medium">
        Ajouter une famille
      </span>
    </div>
  );
}

export default ArborescenceTreePreview;
