import React from "react";
import { Pencil, Trash2, Check } from "lucide-react";
import { type GetTitlesResponseDto } from "@/api-swagger/models/GetTitlesResponseDto";
import type { TreeDto, UpdateTreeDto } from "@/api-swagger";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface FamilleItemProps {
  title: GetTitlesResponseDto | TreeDto;
  editingItem: UpdateTreeDto | null;
  editValue: string;
  setEditValue: (v: string) => void;
  handleEdit: (currentName: string, item: TreeDto) => void;
  handleSave: () => void;
  handleDelete: (id: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  DragHandle: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const FamilleItem: React.FC<FamilleItemProps> = ({
  title,
  editingItem,
  editValue,
  setEditValue,
  handleEdit,
  handleSave,
  handleDelete,
  handleKeyPress,
  DragHandle,
  children,
  className,
}) => (
  <AccordionItem
    value={title._id}
    className={className + " border border-gray-200 rounded bg-white mb-2"}
  >
    <AccordionTrigger className="px-3 py-2 hover:no-underline">
      <div className="flex items-center gap-2 flex-1">
        {DragHandle}
        {editingItem?._id === title._id ? (
          <>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-0 py-0 bg-transparent border-none text-gray-900 font-medium text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minWidth: 0 }}
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-800"
            >
              <Check className="h-4 w-4" />
            </button>
          </>
        ) : (
          <>
            <span className="text-gray-900 font-medium text-base flex-1 text-start">
              {title.fieldName}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(title.fieldName, title);
              }}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Pencil className="h-4 w-4 text-formality-primary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(title._id);
              }}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-3 pb-2">{children}</AccordionContent>
  </AccordionItem>
);

export default FamilleItem;
