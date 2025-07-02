import React from "react";
import { Pencil, Trash2, Check } from "lucide-react";
import { type GetSectionsResponseDto } from "@/api-swagger/models/GetSectionsResponseDto";
import type { TreeDto, UpdateTreeDto } from "@/api-swagger";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface SectionItemProps {
  section: GetSectionsResponseDto | TreeDto;
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

const SectionItem: React.FC<SectionItemProps> = ({
  section,
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
    value={section._id}
    className={
      className + " border border-gray-200 rounded-lg bg-gray-100 mb-4"
    }
  >
    <AccordionTrigger className="px-4 py-3 hover:no-underline">
      <div className="flex items-center gap-2 flex-1">
        {DragHandle}
        {editingItem?._id === section._id ? (
          <>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 px-0 py-0 bg-transparent border-none text-gray-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <span className="text-gray-900 font-bold text-lg flex-1 text-start">
              {section.fieldName}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(section.fieldName, section);
              }}
              className="h-4 w-4 text-formality-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(section._id);
              }}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-4 pb-4">{children}</AccordionContent>
  </AccordionItem>
);

export default SectionItem;
