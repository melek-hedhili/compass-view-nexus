import React, { useState } from "react";
import { GripVertical, Plus, X, Edit3 } from "lucide-react";
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
  DragMoveEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SousFamille = { id: string; name: string; isEditing?: boolean };
type Famille = { id: string; name: string; sousFamilles: SousFamille[]; isEditing?: boolean };

interface RubriqueData {
  rubriqueName: string;
  familles: Famille[];
  isEditingRubrique?: boolean;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Sortable Famille Component
function SortableFamille({ 
  famille, 
  famIdx, 
  onEdit, 
  onSave, 
  onAddSousFamille,
  onEditSousFamille,
  onSaveSousFamille,
  onDeleteSousFamille,
  dragState,
  renderSousFamilleList,
}: {
  famille: Famille;
  famIdx: number;
  onEdit: (famIdx: number) => void;
  onSave: (famIdx: number, newName: string) => void;
  onAddSousFamille: (famIdx: number) => void;
  onEditSousFamille: (famIdx: number, sfIdx: number) => void;
  onSaveSousFamille: (famIdx: number, sfIdx: number, newName: string) => void;
  onDeleteSousFamille: (famIdx: number, sfIdx: number) => void;
  dragState: {
    isActive: boolean;
    isDragging: boolean;
    isOver: boolean;
    dropPosition?: 'above' | 'below';
    dragType?: 'famille' | 'sousFamille';
  };
  renderSousFamilleList?: () => JSX.Element[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: famille.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0 : 1,
  };

  const { isActive, isOver, dropPosition, dragType } = dragState;
  const showDropIndicator = isActive && isOver && dragType === 'famille';

  return (
    <div className="relative">
      {/* Drop indicator above */}
      {showDropIndicator && dropPosition === 'above' && (
        <div className="h-3 flex items-center justify-center mb-1 animate-in fade-in duration-150">
          <div className="h-1 bg-blue-500 rounded-full flex-1 shadow-lg animate-pulse" />
        </div>
      )}
      
      <div 
        ref={setNodeRef} 
        style={style} 
        className={cn(
          "group relative transition-all duration-200 ease-out",
          isDragging && "opacity-50 scale-[0.98] rotate-1 z-50",
          isActive && isOver && dragType === 'famille' && "scale-[1.02] shadow-lg ring-2 ring-blue-300/60 bg-blue-50/30",
          "hover:shadow-sm"
        )}
      >
        <Card className={cn(
          "transition-all duration-200 ease-out border-2",
          isActive && isOver && dragType === 'famille' 
            ? "border-blue-400 shadow-md" 
            : "border-transparent hover:border-gray-200"
        )}>
          <CardContent className="p-3 sm:p-4">
            {/* Famille Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div 
                {...attributes} 
                {...listeners} 
                className={cn(
                  "cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110",
                  isDragging && "cursor-grabbing"
                )}
              >
                <GripVertical className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-500 transition-all duration-150 flex-shrink-0",
                  isActive && isOver && "text-blue-500"
                )} />
              </div>
              <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-blue-500 rounded-full flex-shrink-0 transition-all duration-150"></div>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                {famille.isEditing ? (
                  <Input 
                    defaultValue={famille.name}
                    autoFocus
                    onBlur={(e) => onSave(famIdx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSave(famIdx, e.currentTarget.value);
                      }
                    }}
                    className="font-medium text-sm sm:text-base transition-all duration-150" 
                  />
                ) : (
                  <div 
                    className="font-medium cursor-pointer hover:bg-gray-50 p-2 rounded text-sm sm:text-base truncate flex-1 transition-all duration-150"
                    onClick={() => onEdit(famIdx)}
                  >
                    {famille.name}
                  </div>
                )}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-blue-50 text-blue-600 border-blue-200 h-7 px-2 text-xs transition-all duration-150 hover:bg-blue-100"
                    onClick={() => onEdit(famIdx)}
                  >
                    <Edit3 className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Famille</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-all duration-150 h-7 px-2 hover:bg-gray-100"
                    onClick={() => onAddSousFamille(famIdx)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sous Familles */}
            <div className="ml-4 sm:ml-8 space-y-2">
              <SortableContext 
                items={famille.sousFamilles.map(sf => sf.id)} 
                strategy={verticalListSortingStrategy}
              >
                {renderSousFamilleList
                  ? renderSousFamilleList()
                  : famille.sousFamilles.map((sf, sfIdx) => (
                    <SortableSousFamille
                      key={sf.id}
                      sousFamille={sf}
                      famIdx={famIdx}
                      sfIdx={sfIdx}
                      onEdit={onEditSousFamille}
                      onSave={onSaveSousFamille}
                      onDelete={onDeleteSousFamille}
                      dragState={{
                        isActive,
                        isDragging: false,
                        isOver: isOver && dragType === 'sousFamille',
                        dropPosition,
                        dragType
                      }}
                    />
                  ))}
              </SortableContext>
              
              {/* Add Sous Famille Button */}
              <div 
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 cursor-pointer group/add"
                onClick={() => onAddSousFamille(famIdx)}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover/add:text-green-500 transition-colors flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-500 group-hover/add:text-green-600 transition-colors">Ajouter une sous-famille</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drop indicator below */}
      {showDropIndicator && dropPosition === 'below' && (
        <div className="h-3 flex items-center justify-center mt-1 animate-in fade-in duration-150">
          <div className="h-1 bg-blue-500 rounded-full flex-1 shadow-lg animate-pulse" />
        </div>
      )}
    </div>
  );
}

// Sortable Sous Famille Component
function SortableSousFamille({
  sousFamille,
  famIdx,
  sfIdx,
  onEdit,
  onSave,
  onDelete,
  dragState,
  placeholder,
}: {
  sousFamille: SousFamille;
  famIdx: number;
  sfIdx: number;
  onEdit: (famIdx: number, sfIdx: number) => void;
  onSave: (famIdx: number, sfIdx: number, newName: string) => void;
  onDelete: (famIdx: number, sfIdx: number) => void;
  dragState: {
    isActive: boolean;
    isDragging: boolean;
    isOver: boolean;
    dropPosition?: 'above' | 'below';
    dragType?: 'famille' | 'sousFamille';
  };
  placeholder?: boolean;
}) {
  // Don't use useSortable if this is a placeholder
  if (placeholder) {
    return (
      <div
        className="relative my-2 rounded-lg"
        style={{
          height: 52,
          background: 'rgba(34,197,94,0.08)',
          border: '2px dashed #34d399',
          boxShadow: '0 4px 12px 0 rgba(16,185,129,0.08)',
        }}
      />
    );
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sousFamille.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition || 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1)',
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0 : 1,
  };

  const { isActive, isOver, dropPosition, dragType } = dragState;
  const showDropIndicator = isActive && isOver && dragType === 'sousFamille';

  return (
    <div className="relative">
      {/* Drop indicator above */}
      {showDropIndicator && dropPosition === 'above' && (
        <div className="h-2 flex items-center justify-center mb-1 animate-fade-in">
          <div className="h-0.5 bg-green-500 rounded-full flex-1 shadow-md animate-pulse" />
        </div>
      )}
      
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "group/sf flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 ease-out",
          isDragging ? "opacity-0" : "hover:bg-gray-50",
          isActive && isOver && dragType === 'sousFamille' && "bg-green-50 scale-[1.02] shadow-md ring-1 ring-green-300/60"
        )}
      >
        <div 
          {...attributes} 
          {...listeners} 
          className={cn(
            "cursor-grab active:cursor-grabbing transition-all duration-150 hover:scale-110",
            isDragging && "cursor-grabbing"
          )}
        >
          <GripVertical className={cn(
            "h-3 w-3 sm:h-4 sm:w-4 text-gray-300 group-hover/sf:text-green-500 transition-all duration-150 flex-shrink-0",
            isActive && isOver && "text-green-500"
          )} />
        </div>
        <div className="w-0.5 sm:w-1 h-4 sm:h-6 bg-green-500 rounded-full flex-shrink-0 transition-all duration-150"></div>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {sousFamille.isEditing ? (
            <Input 
              defaultValue={sousFamille.name}
              autoFocus
              onBlur={(e) => onSave(famIdx, sfIdx, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSave(famIdx, sfIdx, e.currentTarget.value);
                }
              }}
              className="text-xs sm:text-sm transition-all duration-150" 
            />
          ) : (
            <div 
              className="text-xs sm:text-sm cursor-pointer hover:bg-gray-50 p-2 rounded truncate flex-1 transition-all duration-150"
              onClick={() => onEdit(famIdx, sfIdx)}
            >
              {sousFamille.name}
            </div>
          )}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-green-50 text-green-600 border-green-200 opacity-0 group-hover/sf:opacity-100 transition-all duration-150 h-6 px-1 text-xs hover:bg-green-100"
              onClick={() => onEdit(famIdx, sfIdx)}
            >
              <Edit3 className="h-2 w-2 sm:h-3 sm:w-3 sm:mr-1" />
              <span className="hidden sm:inline">Sous Famille</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="opacity-0 group-hover/sf:opacity-100 transition-all duration-150 text-red-500 hover:text-red-700 hover:bg-red-50 h-6 px-1"
              onClick={() => onDelete(famIdx, sfIdx)}
            >
              <X className="h-2 w-2 sm:h-3 sm:w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Drop indicator below */}
      {showDropIndicator && dropPosition === 'below' && (
        <div className="h-2 flex items-center justify-center mt-1 animate-fade-in">
          <div className="h-0.5 bg-green-500 rounded-full flex-1 shadow-md animate-pulse" />
        </div>
      )}
    </div>
  );
}

export const ArborescenceTreePreview: React.FC = () => {
  const [tree, setTree] = useState<RubriqueData>({
    rubriqueName: "Rubrique exemple",
    familles: [
      {
        id: "f1",
        name: "Famille 1",
        sousFamilles: [
          { id: "sf1", name: "Sous Famille 1-1" },
          { id: "sf2", name: "Sous Famille 1-2" },
        ],
      },
      {
        id: "f2",
        name: "Famille 2",
        sousFamilles: [{ id: "sf3", name: "Sous Famille 2-1" }],
      },
    ],
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // Edit handlers
  const handleEditRubrique = () => {
    setTree(prev => ({ ...prev, isEditingRubrique: true }));
  };

  const handleSaveRubrique = (newName: string) => {
    setTree(prev => ({ ...prev, rubriqueName: newName, isEditingRubrique: false }));
  };

  const handleEditFamille = (famIdx: number) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, idx) => 
        idx === famIdx ? { ...f, isEditing: true } : f
      )
    }));
  };

  const handleSaveFamille = (famIdx: number, newName: string) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, idx) => 
        idx === famIdx ? { ...f, name: newName, isEditing: false } : f
      )
    }));
  };

  const handleEditSousFamille = (famIdx: number, sfIdx: number) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) => 
        fIdx === famIdx ? {
          ...f,
          sousFamilles: f.sousFamilles.map((sf, sIdx) =>
            sIdx === sfIdx ? { ...sf, isEditing: true } : sf
          )
        } : f
      )
    }));
  };

  const handleSaveSousFamille = (famIdx: number, sfIdx: number, newName: string) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) => 
        fIdx === famIdx ? {
          ...f,
          sousFamilles: f.sousFamilles.map((sf, sIdx) =>
            sIdx === sfIdx ? { ...sf, name: newName, isEditing: false } : sf
          )
        } : f
      )
    }));
  };

  const handleAddFamille = () => {
    const newFamille: Famille = {
      id: generateId(),
      name: "Nouvelle Famille",
      sousFamilles: [],
      isEditing: true
    };
    setTree(prev => ({
      ...prev,
      familles: [...prev.familles, newFamille]
    }));
  };

  const handleAddSousFamille = (famIdx: number) => {
    const newSousFamille: SousFamille = {
      id: generateId(),
      name: "Nouvelle Sous-Famille",
      isEditing: true
    };
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, idx) => 
        idx === famIdx ? {
          ...f,
          sousFamilles: [...f.sousFamilles, newSousFamille]
        } : f
      )
    }));
  };

  const handleDeleteSousFamille = (famIdx: number, sfIdx: number) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) => 
        fIdx === famIdx ? {
          ...f,
          sousFamilles: f.sousFamilles.filter((_, sIdx) => sIdx !== sfIdx)
        } : f
      )
    }));
  };

  // Enhanced: Track which sous famille is being dragged and where to show a placeholder
  const [draggedSousFamille, setDraggedSousFamille] = useState<{ famIdx: number; sfIdx: number; id: string } | null>(null);
  const [sousFamilleDrop, setSousFamilleDrop] = useState<{ famIdx: number; atIndex: number } | null>(null);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
    // Track sous famille
    for (let famIdx = 0; famIdx < tree.familles.length; famIdx++) {
      const sfIdx = tree.familles[famIdx].sousFamilles.findIndex(sf => sf.id === event.active.id);
      if (sfIdx !== -1) {
        setDraggedSousFamille({ famIdx, sfIdx, id: event.active.id as string });
        setSousFamilleDrop({ famIdx, atIndex: sfIdx });
        break;
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    setOverId(event.over?.id as string || null);

    // If dragging sous-famille, compute dynamic drop index
    if (draggedSousFamille) {
      for (let famIdx = 0; famIdx < tree.familles.length; famIdx++) {
        const famille = tree.familles[famIdx];
        const overSfIndex = famille.sousFamilles.findIndex(sf => sf.id === event.over?.id);
        if (overSfIndex !== -1) {
          setSousFamilleDrop({ famIdx, atIndex: overSfIndex });
          return;
        }
      }
      // If not over any sous-famille, keep old value
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    // Reset after drop
    setDraggedSousFamille(null);
    setSousFamilleDrop(null);

    if (!over || active.id === over.id) return;

    const activeFamilleIndex = tree.familles.findIndex(f => f.id === active.id);
    const overFamilleIndex = tree.familles.findIndex(f => f.id === over.id);

    if (activeFamilleIndex !== -1 && overFamilleIndex !== -1) {
      setTree(prev => ({
        ...prev,
        familles: arrayMove(prev.familles, activeFamilleIndex, overFamilleIndex)
      }));
      return;
    }

    // Handle sous-famille reordering across families
    if (draggedSousFamille && sousFamilleDrop) {
      const srcFamIdx = draggedSousFamille.famIdx;
      const srcSfIdx = draggedSousFamille.sfIdx;
      const destFamIdx = sousFamilleDrop.famIdx;
      let destSfIdx = sousFamilleDrop.atIndex;

      setTree(prev => {
        const fams = [...prev.familles];
        const srcFam = { ...fams[srcFamIdx], sousFamilles: [...fams[srcFamIdx].sousFamilles] };
        const [movedItem] = srcFam.sousFamilles.splice(srcSfIdx, 1);

        if (srcFamIdx === destFamIdx && srcSfIdx < destSfIdx) {
          // Account for removal shift
          destSfIdx -= 1;
        }

        fams[srcFamIdx] = srcFam;
        const destFam = { ...fams[destFamIdx], sousFamilles: [...fams[destFamIdx].sousFamilles] };
        destFam.sousFamilles.splice(destSfIdx, 0, movedItem);
        fams[destFamIdx] = destFam;
        return { ...prev, familles: fams };
      });
      return;
    }
  }

  // Helper functions for drag state management (unchanged)
  const getDragState = (itemId: string) => {
    const isActive = !!activeId;
    const isDragging = activeId === itemId;
    const isOver = overId === itemId;
    
    return {
      isActive,
      isDragging,
      isOver,
      dropPosition: 'below' as const,
      dragType: getActiveDragType()
    };
  };

  const getActiveDragType = (): 'famille' | 'sousFamille' | undefined => {
    if (!activeId) return undefined;
    
    // Check if it's a famille
    if (tree.familles.find(f => f.id === activeId)) {
      return 'famille';
    }
    
    // Check if it's a sous-famille
    for (const fam of tree.familles) {
      if (fam.sousFamilles.find(sf => sf.id === activeId)) {
        return 'sousFamille';
      }
    }
    
    return undefined;
  };

  // Get the dragged item for overlay
  const getDraggedItem = () => {
    if (!activeId) return null;

    // Check if it's a famille
    const famille = tree.familles.find(f => f.id === activeId);
    if (famille) {
      return { type: 'famille', item: famille };
    }

    // Check if it's a sous-famille
    for (const fam of tree.familles) {
      const sousFamille = fam.sousFamilles.find(sf => sf.id === activeId);
      if (sousFamille) {
        return { type: 'sousFamille', item: sousFamille };
      }
    }

    return null;
  };

  const draggedItem = getDraggedItem();

  // Inline helper so it gets access to state/handlers
  function renderSousFamillesWithPlaceholder(famille: Famille, famIdx: number) {
    // If not dragging, just render all as usual
    if (!draggedSousFamille || sousFamilleDrop?.famIdx !== famIdx) {
      return famille.sousFamilles.map((sf, sfIdx) => (
        <SortableSousFamille
          key={sf.id}
          sousFamille={sf}
          famIdx={famIdx}
          sfIdx={sfIdx}
          onEdit={handleEditSousFamille}
          onSave={handleSaveSousFamille}
          onDelete={handleDeleteSousFamille}
          dragState={getDragState(sf.id)}
        />
      ));
    }

    // Build list with placeholder at intended drop position
    const items: JSX.Element[] = [];
    famille.sousFamilles.forEach((sf, sfIdx) => {
      // Insert the placeholder at the hover index BEFORE the normal card
      if (sfIdx === sousFamilleDrop.atIndex) {
        items.push(
          <div
            key="sousfamille-drop-placeholder"
            className="relative my-2 rounded-lg"
            style={{
              height: 48,
              border: '2px dashed #34d399',
              background: 'rgba(34,197,94,0.09)',
              position: 'relative',
              transition: 'all 0.2s',
              outline: '2px solid #22c55e40',
              zIndex: 10,
            }}
          />
        );
      }

      // Hide the card being dragged from the list!
      if (sf.id === draggedSousFamille.id && famIdx === draggedSousFamille.famIdx) {
        // do not render the original item here (overlay will handle)
        return;
      }
      items.push(
        <SortableSousFamille
          sousFamille={sf}
          famIdx={famIdx}
          sfIdx={sfIdx}
          onEdit={handleEditSousFamille}
          onSave={handleSaveSousFamille}
          onDelete={handleDeleteSousFamille}
          dragState={getDragState(sf.id)}
          key={sf.id}
        />
      );
    });

    // If dropping at end of list, show placeholder last
    if (sousFamilleDrop.atIndex === famille.sousFamilles.length) {
      items.push(
        <div
          key="sousfamille-drop-placeholder-end"
          className="relative my-2 rounded-lg"
          style={{
            height: 48,
            border: '2px dashed #34d399',
            background: 'rgba(34,197,94,0.09)',
            position: 'relative',
            transition: 'all 0.2s',
            outline: '2px solid #22c55e40',
            zIndex: 10,
          }}
        />
      );
    }

    return items;
  }

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
                        if (e.key === 'Enter') {
                          handleSaveRubrique(e.currentTarget.value);
                        }
                      }}
                      className="text-base sm:text-lg font-semibold" 
                    />
                  ) : (
                    <div className="text-base sm:text-lg font-semibold cursor-pointer hover:bg-gray-50 p-2 rounded truncate" onClick={handleEditRubrique}>
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
                items={tree.familles.map(f => f.id)} 
                strategy={verticalListSortingStrategy}
              >
                {tree.familles.map((famille, famIdx) => (
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
                    renderSousFamilleList={() => renderSousFamillesWithPlaceholder(famille, famIdx)}
                  />
                ))}
              </SortableContext>

              {/* Add Famille Button */}
              <Card 
                className="border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group/add-famille"
                onClick={handleAddFamille}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover/add-famille:text-blue-500 transition-colors" />
                    <span className="text-sm sm:text-base text-gray-500 group-hover/add-famille:text-blue-600 transition-colors font-medium">Ajouter une famille</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
              <Button className="bg-formality-primary hover:bg-formality-primary/90 text-white px-4 sm:px-6 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Sauvegarder l'arborescence
              </Button>
              <Button variant="outline" className="px-4 sm:px-6 w-full sm:w-auto">
                Aperçu
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Info Text */}
        <div className="text-center text-gray-500 mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
          <p className="text-xs sm:text-sm">
            Cliquez sur les noms pour les éditer, utilisez les boutons "+" pour ajouter des éléments et glissez-déposez pour réorganiser.
          </p>
        </div>
      </div>

      <DragOverlay 
        dropAnimation={{
          duration: 250,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        style={{ 
          transformOrigin: '50% 50%'
        }}
      >
        {draggedItem ? (
          <div className="opacity-95 rotate-2 scale-105 transform-gpu shadow-2xl">
            <Card className="border-2 border-blue-400 bg-white shadow-2xl">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-blue-500" />
                  <div className={cn(
                    "w-1 h-6 rounded-full",
                    draggedItem.type === 'famille' ? "bg-blue-500" : "bg-green-500"
                  )}></div>
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

export default ArborescenceTreePreview;
