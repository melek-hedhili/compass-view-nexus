import React from "react";
import { Pencil, Trash2, Check } from "lucide-react";
import type { TreeDto, UpdateTreeDto } from "@/api-swagger";

interface SousFamilleItemProps {
  subtitle: TreeDto;
  editingItem: UpdateTreeDto | null;
  editValue: string;
  setEditValue: (v: string) => void;
  handleEdit: (currentName: string, item: TreeDto) => void;
  handleSave: () => void;
  handleDelete: (id: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  DragHandle: React.ReactNode;
  className?: string;
}

const SousFamilleItem: React.FC<SousFamilleItemProps> = ({
  subtitle,
  editingItem,
  editValue,
  setEditValue,
  handleEdit,
  handleSave,
  handleDelete,
  handleKeyPress,
  DragHandle,
  className,
}) => (
  <div
    className={
      (className || "") +
      " ml-12 my-2 p-2 rounded border border-gray-200 bg-gray-50 flex items-center gap-2"
    }
  >
    {DragHandle}
    {editingItem?._id === subtitle._id ? (
      <>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-0 py-0 bg-transparent border-none text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <span className="text-gray-700 text-sm flex-1">
          {subtitle.fieldName}
        </span>
        <button
          onClick={() => handleEdit(subtitle.fieldName, subtitle)}
          className="p-1 text-blue-600 hover:text-blue-800"
        >
          <Pencil className="h-4 w-4 text-formality-primary" />
        </button>
        <button
          onClick={() => handleDelete(subtitle._id)}
          className="p-1 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </>
    )}
  </div>
);

export default SousFamilleItem;
