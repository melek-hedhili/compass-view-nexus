import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit3, X } from "lucide-react";
import { SousFamille, DragState } from "../types";
import { useState } from "react";
import { TreeService } from "@/api-swagger/services/TreeService";

function SortableSousFamille({
  sousFamille,
  famIdx,
  sfIdx,
  onEdit,
  onSave,
  onDelete,
  dragState,
}: {
  sousFamille: SousFamille;
  famIdx: number;
  sfIdx: number;
  onEdit: (famIdx: number, sfIdx: number) => void;
  onSave: (famIdx: number, sfIdx: number, newName: string) => void;
  onDelete: (famIdx: number, sfIdx: number) => void;
  dragState: DragState;
}) {
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
    transition: isDragging
      ? "none"
      : transition || "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
    zIndex: isDragging ? 1000 : "auto",
    opacity: isDragging ? 0.4 : 1,
  };

  const { isActive, isOver, dropPosition, dragType } = dragState;

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await TreeService.treeControllerRemove({ id: sousFamille.id });
      onDelete(famIdx, sfIdx);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/sf flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 ease-out bg-white border border-gray-100",
        isDragging
          ? "shadow-lg rotate-1 scale-105"
          : "hover:bg-gray-50 hover:shadow-sm",
        isActive &&
          isOver &&
          dragType === "sousFamille" &&
          "ring-1 ring-green-300/60 bg-green-50/30"
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
        <GripVertical
          className={cn(
            "h-3 w-3 sm:h-4 sm:w-4 text-gray-300 group-hover/sf:text-green-500 transition-all duration-150 flex-shrink-0",
            isActive && isOver && "text-green-500"
          )}
        />
      </div>
      <div className="w-0.5 sm:w-1 h-4 sm:h-6 bg-green-500 rounded-full flex-shrink-0 transition-all duration-150" />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {sousFamille.isEditing ? (
          <Input
            defaultValue={sousFamille.name}
            autoFocus
            onBlur={(e) => onSave(famIdx, sfIdx, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <X className="h-2 w-2 sm:h-3 sm:w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
export default SortableSousFamille;
