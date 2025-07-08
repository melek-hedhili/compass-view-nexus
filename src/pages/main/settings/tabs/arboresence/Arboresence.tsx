import { useState } from "react";
import { ChevronDown, Folder, Pencil } from "lucide-react";

import {
  CreateTreeDto,
  TreeService,
  type UpdateOrderDto,
  type UpdateTreeDto,
} from "@/api-swagger";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { type GetSectionsResponseDto } from "@/api-swagger/models/GetSectionsResponseDto";
import { type GetTitlesResponseDto } from "@/api-swagger/models/GetTitlesResponseDto";
import { type TreeDto } from "@/api-swagger/models/TreeDto";
import { SortableItem, SortableList } from "@/components/ui/sortableList";
import { Accordion } from "@/components/ui/accordion";
import SettingsNoDataFound from "@/components/layout/SettingsNoDataFound";
import LoadingSpinner from "@/components/LoadingSpinner";
import AddActionCard from "./components/AddActionCard";
import AddInputCard from "./components/AddInputCard";
import FamilleItem from "./components/FamilleItem";
import SousFamilleItem from "./components/SousFamilleItem";
import SectionItem from "./components/SectionItem";
import { Button } from "@/components/ui/button";

type ViewMode = "list" | "create" | "edit" | "details";

// Utility to get the next available index
function getNextAvailableIndex(items: { index: number }[]) {
  const used = new Set(items.map((i) => i.index));
  let idx = 0;
  while (used.has(idx)) idx++;
  return idx;
}

const Arboresence = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [editingItem, setEditingItem] = useState<UpdateTreeDto | null>(null);
  const [editValue, setEditValue] = useState("");
  const queryClient = useQueryClient();

  const { data: tree, isLoading } = useQuery({
    queryKey: ["tree"],
    queryFn: () => TreeService.treeControllerFindAll(),
  });
  const deleteTreeMutation = useMutation({
    mutationFn: () => TreeService.treeControllerRemove({ id: tree?.[0]._id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tree"] });
      setViewMode("list");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'arborescence");
    },
  });
  const deleteRubriqueMutation = useMutation({
    mutationFn: ({
      id,
      type,
    }: {
      id: string;
      type: "rubrique" | "famille" | "sous-famille";
    }) => TreeService.treeControllerRemove({ id }),
    onMutate: async ({ id, type }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["tree"] });

      // Snapshot the previous value
      const previousTree = queryClient.getQueryData(["tree"]);

      // Optimistically update to remove the item
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;

        const removeItemRecursively = (items: any[]): any[] =>
          items.filter((item) => {
            if (item._id === id && item.type === type) return false;

            if (item.titles) {
              item.titles = removeItemRecursively(item.titles);
            }
            if (item.subtitles) {
              item.subtitles = removeItemRecursively(item.subtitles);
            }

            return true;
          });

        return removeItemRecursively(old);
      });

      return { previousTree };
    },
    onError: (err, { type, id }, context) => {
      // Rollback on error
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      //get the name of the deleted item by id
      const errorMessage = (err as any).body.response.message as string;
      if (errorMessage.includes("can t delete this tree")) {
        toast.error(
          `Cette ${type} est liée à un document et ne peut être supprimée`
        );
      } else {
        toast.error(`Erreur lors de la suppression de la ${type}`);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });
  const sortMutation = useMutation({
    mutationFn: (data: UpdateOrderDto) =>
      TreeService.treeControllerUpdateOrder({ requestBody: data }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);

      // Optimistically update the order
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;

        const updateOrderRecursively = (
          items: any[],
          parentId: string | null
        ): any[] => {
          if (parentId === data.parentId) {
            // Create a map of new indices
            const indexMap = new Map(
              data.order.map((item) => [item._id, item.index])
            );

            // Sort items based on the new order
            return [...items]
              .sort((a, b) => {
                const indexA = indexMap.get(a._id) ?? a.index;
                const indexB = indexMap.get(b._id) ?? b.index;
                return indexA - indexB;
              })
              .map((item) => ({
                ...item,
                index: indexMap.get(item._id) ?? item.index,
              }));
          }

          // Recursively update children
          return items.map((item) => ({
            ...item,
            titles: item.titles
              ? updateOrderRecursively(item.titles, item._id)
              : item.titles,
            subtitles: item.subtitles
              ? updateOrderRecursively(item.subtitles, item._id)
              : item.subtitles,
          }));
        };

        return updateOrderRecursively(old, null);
      });

      return { previousTree };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors du tri de l'arborescence");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });
  const createRubriqueMutation = useMutation({
    mutationFn: ({ name, index }: { name: string; index: number }) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.SECTION,
          index,
        },
      }),
    onMutate: async ({ name, index }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);

      // Create optimistic item
      const optimisticItem = {
        _id: `temp-${Date.now()}`,
        fieldName: name,
        type: CreateTreeDto.type.SECTION,
        index,
        titles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add the new section
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return [optimisticItem];
        return [...old, optimisticItem].sort((a, b) => a.index - b.index);
      });

      return { previousTree, optimisticItem };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors de la création de la rubrique");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTreeDto }) =>
      TreeService.treeControllerUpdate({
        id,
        requestBody: data,
      }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);

      // Optimistically update the name
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;

        const updateNameRecursively = (items: any[]): any[] =>
          items.map((item) => {
            if (item._id === id) {
              return { ...item, fieldName: data.fieldName };
            }

            return {
              ...item,
              titles: item.titles
                ? updateNameRecursively(item.titles)
                : item.titles,
              subtitles: item.subtitles
                ? updateNameRecursively(item.subtitles)
                : item.subtitles,
            };
          });

        return updateNameRecursively(old);
      });

      return { previousTree };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors de la mise à jour du nom");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
    onSuccess: () => {
      setEditingItem(null);
      setEditValue("");
    },
  });

  const createTitleMutation = useMutation({
    mutationFn: ({
      sectionId,
      name,
      index,
    }: {
      sectionId: string;
      name: string;
      index: number;
    }) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.TITLE,
          parentId: sectionId,
          index,
        },
      }),
    onMutate: async ({ sectionId, name, index }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);

      // Create optimistic title
      const optimisticTitle = {
        _id: `temp-title-${Date.now()}`,
        fieldName: name,
        type: CreateTreeDto.type.TITLE,
        index,
        parent: { _id: sectionId },
        subtitles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add the new title to the section
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;

        const addTitleToSection = (items: any[]): any[] =>
          items.map((item) => {
            if (item._id === sectionId) {
              const updatedTitles = [
                ...(item.titles || []),
                optimisticTitle,
              ].sort((a, b) => a.index - b.index);
              return { ...item, titles: updatedTitles };
            }

            return {
              ...item,
              titles: item.titles
                ? addTitleToSection(item.titles)
                : item.titles,
              subtitles: item.subtitles
                ? addTitleToSection(item.subtitles)
                : item.subtitles,
            };
          });

        return addTitleToSection(old);
      });

      return { previousTree, optimisticTitle };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors de la création de la famille");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });

  const createSubtitleMutation = useMutation({
    mutationFn: ({
      titleId,
      name,
      index,
    }: {
      titleId: string;
      name: string;
      index: number;
    }) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.SUB_TITLE,
          parentId: titleId,
          index,
        },
      }),
    onMutate: async ({ titleId, name, index }) => {
      await queryClient.cancelQueries({ queryKey: ["tree"] });
      const previousTree = queryClient.getQueryData(["tree"]);

      // Create optimistic subtitle
      const optimisticSubtitle = {
        _id: `temp-subtitle-${Date.now()}`,
        fieldName: name,
        type: CreateTreeDto.type.SUB_TITLE,
        index,
        parent: { _id: titleId },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Optimistically add the new subtitle to the title
      queryClient.setQueryData(["tree"], (old: TreeDto[]) => {
        if (!old) return old;

        const addSubtitleToTitle = (items: any[]): any[] =>
          items.map((item) => {
            if (item._id === titleId) {
              const updatedSubtitles = [
                ...(item.subtitles || []),
                optimisticSubtitle,
              ].sort((a, b) => a.index - b.index);
              return { ...item, subtitles: updatedSubtitles };
            }

            return {
              ...item,
              titles: item.titles
                ? addSubtitleToTitle(item.titles)
                : item.titles,
              subtitles: item.subtitles
                ? addSubtitleToTitle(item.subtitles)
                : item.subtitles,
            };
          });

        return addSubtitleToTitle(old);
      });

      return { previousTree, optimisticSubtitle };
    },
    onError: (_, __, context) => {
      if (context?.previousTree) {
        queryClient.setQueryData(["tree"], context.previousTree);
      }
      toast.error("Erreur lors de la création de la sous-famille");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
    },
  });

  // State for inline add inputs
  const [addRubriqueOpen, setAddRubriqueOpen] = useState(false);
  const [addRubriqueValue, setAddRubriqueValue] = useState("");
  const [addFirstRubriqueOpen, setAddFirstRubriqueOpen] = useState(false);
  const [addFirstRubriqueValue, setAddFirstRubriqueValue] = useState("");
  const [addFamilleOpen, setAddFamilleOpen] = useState<string | null>(null); // sectionId
  const [addFamilleValue, setAddFamilleValue] = useState("");
  const [addSousFamilleOpen, setAddSousFamilleOpen] = useState<string | null>(
    null
  ); // titleId
  const [addSousFamilleValue, setAddSousFamilleValue] = useState("");

  const handleCreateRubrique = (name: string, index: number) => {
    if (name?.trim()) {
      createRubriqueMutation.mutate({ name: name.trim(), index });
    }
  };

  const handleEdit = (currentName: string, item: TreeDto) => {
    setEditingItem({
      fieldName: currentName,
      _id: item._id,
      index: item.index,
      type: item.type,
      parentId: item.parent?._id,
    });
    setEditValue(currentName);
  };

  const handleSave = () => {
    if (
      editingItem &&
      editValue.trim() &&
      editValue !== editingItem.fieldName
    ) {
      updateNameMutation.mutate({
        id: editingItem._id,
        data: {
          fieldName: editValue.trim(),
          _id: editingItem._id,
          index: editingItem.index,
          type: editingItem.type,
          parentId: editingItem.parentId,
        },
      });
    } else if (editingItem && editValue === editingItem.fieldName) {
      setEditingItem(null);
      setEditValue("");
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditValue("");
  };

  const handleDelete = (
    id: string,
    type: "rubrique" | "famille" | "sous-famille"
  ) => {
    deleteRubriqueMutation.mutateAsync({
      id,
      type,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Section reorder handler
  const handleSectionReorder = (items: GetSectionsResponseDto[]) => {
    sortMutation.mutate({
      parentId: null,
      order: items.map((section, idx) => ({
        _id: section._id,
        index: idx,
      })),
    });
  };

  // Title reorder handler
  const handleTitleReorder = (items: GetTitlesResponseDto[]) => {
    sortMutation.mutate({
      parentId: items[0]?.parent?._id,
      order: items.map((title, idx) => ({
        _id: title._id,
        index: idx,
      })),
    });
  };

  // Subtitle reorder handler
  const handleSubtitleReorder = (items: TreeDto[]) => {
    sortMutation.mutate({
      parentId: items[0]?.parent?._id,
      order: items.map((item, idx) => ({
        _id: item._id,
        index: idx,
      })),
    });
  };

  // Render subtitles (view mode)
  const renderSubtitlesView = (subtitles: TreeDto[]) => (
    <div className="ml-12 my-2 flex flex-col gap-2">
      {subtitles.map((subtitle) => (
        <div
          key={subtitle._id}
          className="p-2 rounded border border-gray-200 bg-gray-50 flex items-center gap-2"
        >
          <span className="text-gray-700 text-sm">{subtitle.fieldName}</span>
        </div>
      ))}
    </div>
  );

  // Render titles (view mode)
  const renderTitlesView = (titles: GetTitlesResponseDto[]) => (
    <div className="ml-6 my-2 flex flex-col gap-2">
      {titles.map((title) => (
        <div
          key={title._id}
          className="p-3 rounded border border-gray-200 bg-white flex flex-col gap-1"
        >
          <span className="text-gray-900 font-medium text-base">
            {title.fieldName}
          </span>
          {title.subtitles &&
            title.subtitles.length > 0 &&
            renderSubtitlesView(title.subtitles)}
        </div>
      ))}
    </div>
  );

  // Render sections (view mode)
  const renderSectionsView = (sections: GetSectionsResponseDto[]) => (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <div
          key={section._id}
          className="p-4 rounded-lg bg-gray-100 border border-gray-200 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <ChevronDown className="h-5 w-5 text-gray-400" />
            <span className="text-gray-900 font-bold text-lg">
              {section.fieldName}
            </span>
          </div>
          {section.titles &&
            section.titles.length > 0 &&
            renderTitlesView(section.titles)}
        </div>
      ))}
    </div>
  );

  // --- Add creation logic for famille (title) and sous-famille (subtitle) ---
  const handleCreateTitle = (
    sectionId: string,
    name: string,
    index: number
  ) => {
    if (name?.trim()) {
      createTitleMutation.mutate({ sectionId, name: name.trim(), index });
    }
  };
  const handleCreateSubtitle = (
    titleId: string,
    name: string,
    index: number
  ) => {
    if (name?.trim()) {
      createSubtitleMutation.mutate({ titleId, name: name.trim(), index });
    }
  };

  // --- Update renderSubtitlesEdit to use SousFamilleItem ---
  const renderSubtitlesEdit = (subtitles: TreeDto[], parentTitleId: string) => (
    <>
      <SortableList
        getId={(item) => item._id}
        items={subtitles}
        onChange={handleSubtitleReorder}
        renderItem={(subtitle) => (
          <SortableItem id={subtitle._id}>
            <SousFamilleItem
              subtitle={subtitle}
              editingItem={editingItem}
              editValue={editValue}
              setEditValue={setEditValue}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleDelete={(id) => handleDelete(id, "sous-famille")}
              handleKeyPress={handleKeyPress}
              DragHandle={<SortableList.DragHandle />}
              className="mb-1 border border-gray-200 rounded bg-white shadow-sm"
            />
          </SortableItem>
        )}
        type="LIST"
      />
      <div className="ml-12">
        {addSousFamilleOpen === parentTitleId ? (
          <AddInputCard
            value={addSousFamilleValue}
            setValue={setAddSousFamilleValue}
            onCancel={() => {
              setAddSousFamilleOpen(null);
              setAddSousFamilleValue("");
            }}
            onConfirm={() => {
              if (addSousFamilleValue.trim()) {
                const idx = getNextAvailableIndex(subtitles);
                handleCreateSubtitle(parentTitleId, addSousFamilleValue, idx);
                setAddSousFamilleOpen(null);
                setAddSousFamilleValue("");
              }
            }}
            placeholder="Nom de la nouvelle sous-famille"
          />
        ) : (
          <AddActionCard
            onClick={() => setAddSousFamilleOpen(parentTitleId)}
            className="mt-3"
          >
            Ajouter une sous-famille
          </AddActionCard>
        )}
      </div>
    </>
  );

  // --- Update renderTitlesEdit to use FamilleItem ---
  const renderTitlesEdit = (
    titles: GetTitlesResponseDto[],
    parentSectionId: string
  ) => (
    <>
      <Accordion
        type="multiple"
        defaultValue={titles.map((t) => t._id)}
        className="space-y-2 ml-2"
      >
        <SortableList
          getId={(item) => item._id}
          items={titles}
          onChange={handleTitleReorder}
          renderItem={(title) => (
            <SortableItem id={title._id}>
              <FamilleItem
                title={title}
                editingItem={editingItem}
                editValue={editValue}
                setEditValue={setEditValue}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleDelete={(id) => handleDelete(id, "famille")}
                handleKeyPress={handleKeyPress}
                DragHandle={<SortableList.DragHandle />}
                className="mb-1 shadow border border-gray-200 rounded bg-gray-50"
              >
                {title.subtitles &&
                  title.subtitles.length > 0 &&
                  renderSubtitlesEdit(title.subtitles, title._id)}
                {(!title.subtitles || title.subtitles.length === 0) && (
                  <div className="ml-12">
                    {addSousFamilleOpen === title._id ? (
                      <AddInputCard
                        value={addSousFamilleValue}
                        setValue={setAddSousFamilleValue}
                        onCancel={() => {
                          setAddSousFamilleOpen(null);
                          setAddSousFamilleValue("");
                        }}
                        onConfirm={() => {
                          if (addSousFamilleValue.trim()) {
                            const idx = getNextAvailableIndex(
                              title.subtitles || []
                            );
                            handleCreateSubtitle(
                              title._id,
                              addSousFamilleValue,
                              idx
                            );
                            setAddSousFamilleOpen(null);
                            setAddSousFamilleValue("");
                          }
                        }}
                        placeholder="Nom de la nouvelle sous-famille"
                      />
                    ) : (
                      <AddActionCard
                        onClick={() => setAddSousFamilleOpen(title._id)}
                      >
                        Ajouter une sous-famille
                      </AddActionCard>
                    )}
                  </div>
                )}
              </FamilleItem>
            </SortableItem>
          )}
          type="LIST"
        />
      </Accordion>
      <div className="ml-6">
        {addFamilleOpen === parentSectionId ? (
          <AddInputCard
            value={addFamilleValue}
            setValue={setAddFamilleValue}
            onCancel={() => {
              setAddFamilleOpen(null);
              setAddFamilleValue("");
            }}
            onConfirm={() => {
              if (addFamilleValue.trim()) {
                const idx = getNextAvailableIndex(titles);
                handleCreateTitle(parentSectionId, addFamilleValue, idx);
                setAddFamilleOpen(null);
                setAddFamilleValue("");
              }
            }}
            placeholder="Nom de la nouvelle famille"
          />
        ) : (
          <AddActionCard onClick={() => setAddFamilleOpen(parentSectionId)}>
            Ajouter une famille
          </AddActionCard>
        )}
      </div>
    </>
  );

  // --- Update renderSectionsEdit to use SectionItem ---
  const renderSectionsEdit = (sections: GetSectionsResponseDto[]) => (
    <>
      <div className="mb-4">
        {addRubriqueOpen ? (
          <AddInputCard
            value={addRubriqueValue}
            setValue={setAddRubriqueValue}
            onCancel={() => {
              setAddRubriqueOpen(false);
              setAddRubriqueValue("");
            }}
            onConfirm={() => {
              if (addRubriqueValue.trim()) {
                const idx = getNextAvailableIndex(sections);
                handleCreateRubrique(addRubriqueValue, idx);
                setAddRubriqueOpen(false);
                setAddRubriqueValue("");
              }
            }}
            placeholder="Nom de la nouvelle rubrique"
          />
        ) : (
          <AddActionCard onClick={() => setAddRubriqueOpen(true)}>
            Ajouter une rubrique
          </AddActionCard>
        )}
      </div>
      <Accordion
        type="multiple"
        defaultValue={sections.map((s) => s._id)}
        className="space-y-4"
      >
        <SortableList
          getId={(item) => item._id}
          items={sections}
          onChange={handleSectionReorder}
          type="LIST"
          renderItem={(section) => (
            <SortableItem id={section._id}>
              <SectionItem
                section={section}
                editingItem={editingItem}
                editValue={editValue}
                setEditValue={setEditValue}
                handleEdit={handleEdit}
                handleSave={handleSave}
                handleDelete={(id) => handleDelete(id, "rubrique")}
                handleKeyPress={handleKeyPress}
                DragHandle={<SortableList.DragHandle />}
                className="mb-2 shadow-sm border border-gray-200 rounded-lg bg-white"
              >
                {section.titles &&
                  section.titles.length > 0 &&
                  renderTitlesEdit(section.titles, section._id)}
                {(!section.titles || section.titles.length === 0) && (
                  <div className="ml-6">
                    {addFamilleOpen === section._id ? (
                      <AddInputCard
                        className="mt-3"
                        value={addFamilleValue}
                        setValue={setAddFamilleValue}
                        onCancel={() => {
                          setAddFamilleOpen(null);
                          setAddFamilleValue("");
                        }}
                        onConfirm={() => {
                          if (addFamilleValue.trim()) {
                            const idx = getNextAvailableIndex(
                              section.titles || []
                            );
                            handleCreateTitle(
                              section._id,
                              addFamilleValue,
                              idx
                            );
                            setAddFamilleOpen(null);
                            setAddFamilleValue("");
                          }
                        }}
                        placeholder="Nom de la nouvelle famille"
                      />
                    ) : (
                      <AddActionCard
                        onClick={() => setAddFamilleOpen(section._id)}
                        className="mt-3"
                      >
                        Ajouter une famille
                      </AddActionCard>
                    )}
                  </div>
                )}
              </SectionItem>
            </SortableItem>
          )}
        />
      </Accordion>
    </>
  );

  // If loading, show nothing or a loader (optional)
  if (isLoading) return <LoadingSpinner />;

  // If no data, show SettingsNoDataFound
  if (tree && tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-12">
        <SettingsNoDataFound
          icon={<Folder className="h-12 w-12 text-gray-400" />}
          title="Aucune arborescence trouvée"
          description="Commencez par créer une nouvelle arborescence pour organiser vos rubriques."
          buttonText="Nouvelle arborescence"
          onButtonClick={() => setAddFirstRubriqueOpen(true)}
        />
        {addFirstRubriqueOpen && (
          <div className="mt-6 w-full max-w-md">
            <AddInputCard
              value={addFirstRubriqueValue}
              setValue={setAddFirstRubriqueValue}
              onCancel={() => {
                setAddFirstRubriqueOpen(false);
                setAddFirstRubriqueValue("");
              }}
              onConfirm={() => {
                if (addFirstRubriqueValue.trim()) {
                  handleCreateRubrique(addFirstRubriqueValue, 0);
                  setViewMode("edit");
                  setAddFirstRubriqueOpen(false);
                  setAddFirstRubriqueValue("");
                }
              }}
              placeholder="Nom de la première rubrique"
            />
          </div>
        )}
      </div>
    );
  }

  // Main render
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div className="flex items-center mb-4 md:mb-0" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-between">
          {viewMode === "edit" ? (
            <>
              {/* {tree?.[0]._id && (
                <Button
                  disabled={deleteTreeMutation.isPending}
                  variant="destructive"
                  onClick={() => deleteTreeMutation.mutateAsync()}
                >
                  <Trash className="h-4 w-4" />
                  <span>Supprimer l'arborescence</span>
                </Button>
              )} */}
              <Button variant="outline" onClick={() => setViewMode("list")}>
                <Pencil className="h-4 w-4" />
                <span>Terminer l'édition</span>
              </Button>
            </>
          ) : (
            <Button onClick={() => setViewMode("edit")}>
              <Pencil className="h-4 w-4" />
              <span>Éditer l'arborescence</span>
            </Button>
          )}
        </div>
      </div>
      {viewMode === "edit"
        ? renderSectionsEdit(tree)
        : renderSectionsView(tree)}
    </div>
  );
};

export default Arboresence;
