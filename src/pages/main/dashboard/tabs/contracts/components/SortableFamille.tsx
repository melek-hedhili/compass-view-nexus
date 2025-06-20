import { Card, CardContent } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Check } from "lucide-react";
import SortableSousFamille from "./SortableSousFamille";
import { Famille, DragState } from "../types";
import { useState } from "react";
import { TreeService } from "@/api-swagger/services/TreeService";
import { CreateTreeDto } from "@/api-swagger/models/CreateTreeDto";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddSousFamilleInput({
  famille,
  famIdx,
  onAddSousFamille,
  setFamilles,
}: {
  famille: Famille;
  famIdx: number;
  onAddSousFamille: (
    famIdx: number,
    name: string,
    onCreated: (id: string) => void
  ) => void;
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
    }) =>
      TreeService.treeControllerCreate({
        requestBody: {
          fieldName: name,
          type: CreateTreeDto.type.SUB_TITLE,
          parentId,
          index,
        },
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["tree"] });
      setFamilles((prevFamilles) =>
        prevFamilles.map((f, idx) =>
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
        )
      );
      setShowInput(false);
      setName("");
    },
  });
  const handleCreate = () => {
    if (!name.trim()) return;
    mutation.mutate({
      name,
      parentId: famille.id,
      index: famille.sousFamilles.length,
    });
  };
  return showInput ? (
    <div className="flex items-center gap-2">
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
      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 cursor-pointer group/add"
      onClick={() => setShowInput(true)}
    >
      <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover/add:text-green-500 transition-colors flex-shrink-0" />
      <span className="text-xs sm:text-sm text-gray-500 group-hover/add:text-green-600 transition-colors">
        Ajouter une sous-famille
      </span>
    </div>
  );
}

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
  setFamilles,
}: {
  famille: Famille;
  famIdx: number;
  onEdit: (famIdx: number) => void;
  onSave: (famIdx: number, newName: string) => void;
  onAddSousFamille: (
    famIdx: number,
    name: string,
    onCreated: (id: string) => void
  ) => void;
  onEditSousFamille: (famIdx: number, sfIdx: number) => void;
  onSaveSousFamille: (famIdx: number, sfIdx: number, newName: string) => void;
  onDeleteSousFamille: (famIdx: number, sfIdx: number) => void;
  dragState: DragState;
  renderSousFamilleList?: () => JSX.Element[];
  setFamilles: React.Dispatch<React.SetStateAction<Famille[]>>;
}) {
  const queryClient = useQueryClient();
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
    transition: isDragging
      ? "none"
      : transition || "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
    zIndex: isDragging ? 1000 : "auto",
    opacity: isDragging ? 0 : 1,
  };

  const { isActive, isOver, dropPosition, dragType } = dragState;
  const showDropIndicator = isActive && isOver && dragType === "famille";

  return (
    <div className="relative">
      {/* Drop indicator above */}
      {showDropIndicator && dropPosition === "above" && (
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
          isActive &&
            isOver &&
            dragType === "famille" &&
            "scale-[1.02] shadow-lg ring-2 ring-blue-300/60 bg-blue-50/30",
          "hover:shadow-sm"
        )}
      >
        <Card
          className={cn(
            "transition-all duration-200 ease-out border-2",
            isActive && isOver && dragType === "famille"
              ? "border-blue-400 shadow-md"
              : "border-transparent hover:border-gray-200"
          )}
        >
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
                <GripVertical
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-500 transition-all duration-150 flex-shrink-0",
                    isActive && isOver && "text-blue-500"
                  )}
                />
              </div>
              <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-blue-500 rounded-full flex-shrink-0 transition-all duration-150" />
              <div className="flex-1 min-w-0 flex items-center gap-2">
                {famille.isEditing ? (
                  <Input
                    defaultValue={famille.name}
                    autoFocus
                    onBlur={(e) => onSave(famIdx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
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
              </div>
            </div>

            {/* Sous Familles */}
            <div className="ml-4 sm:ml-8 space-y-2">
              <SortableContext
                items={famille.sousFamilles.map((sf) => sf.id)}
                strategy={verticalListSortingStrategy}
              >
                {famille.sousFamilles
                  .slice()
                  .sort((a, b) => a.index - b.index)
                  .map((sf, sfIdx) => (
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
                        isOver: isOver && dragType === "sousFamille",
                        dropPosition,
                        dragType,
                      }}
                    />
                  ))}
              </SortableContext>

              {/* Add Sous Famille Button */}
              <AddSousFamilleInput
                famille={famille}
                famIdx={famIdx}
                onAddSousFamille={onAddSousFamille}
                setFamilles={setFamilles}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drop indicator below */}
      {showDropIndicator && dropPosition === "below" && (
        <div className="h-3 flex items-center justify-center mt-1 animate-in fade-in duration-150">
          <div className="h-1 bg-blue-500 rounded-full flex-1 shadow-lg animate-pulse" />
        </div>
      )}
    </div>
  );
}
export default SortableFamille;
