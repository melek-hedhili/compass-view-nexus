import { useState } from "react";
import { Folder, Pencil } from "lucide-react";

import { TreeService, type UpdateTreeDto } from "@/api-swagger";
import { useQuery } from "@tanstack/react-query";
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
import { useArboresenceMutations } from "./hooks/useArboresenceMutations";
import { renderSectionsView, getNextAvailableIndex } from "./arboresence.utils";

type ViewMode = "list" | "create" | "edit" | "details";

const Arboresence = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [editingItem, setEditingItem] = useState<UpdateTreeDto | null>(null);
  const [editValue, setEditValue] = useState("");

  const { data: tree, isLoading } = useQuery({
    queryKey: ["tree"],
    queryFn: () => TreeService.treeControllerFindAll(),
  });

  const {
    deleteRubriqueMutation,
    sortMutation,
    createRubriqueMutation,
    updateNameMutation,
    createTitleMutation,
    createSubtitleMutation,
  } = useArboresenceMutations({ setEditingItem, setEditValue });

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
      id: item._id,
      index: item.index,
      type: item.type,
      parentId: item.parent?._id,
    } as any);
    setEditValue(currentName);
  };

  const handleSave = () => {
    if (
      editingItem &&
      editValue.trim() &&
      editValue !== editingItem.fieldName
    ) {
      updateNameMutation.mutate({
        id: (editingItem as any)._id,
        data: {
          fieldName: editValue.trim(),
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
