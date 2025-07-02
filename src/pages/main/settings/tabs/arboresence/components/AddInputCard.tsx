import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import React from "react";

interface AddInputCardProps {
  value: string;
  setValue: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  placeholder: string;
  autoFocus?: boolean;
  className?: string;
}

const AddInputCard: React.FC<AddInputCardProps> = ({
  value,
  setValue,
  onCancel,
  onConfirm,
  placeholder,
  autoFocus = true,
  className,
}) => (
  <div
    className={cn(
      "flex items-center gap-2 sm:gap-3 p-4 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 transition-all duration-200 select-none mb-2",
      className
    )}
  >
    <input
      className="flex-1 bg-transparent outline-none border-none text-gray-700 placeholder-gray-400 text-sm sm:text-base font-medium"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onConfirm();
        if (e.key === "Escape") onCancel();
      }}
      placeholder={placeholder}
      autoFocus={autoFocus}
    />
    <button
      className="p-1 text-green-600 hover:text-green-800"
      onClick={onConfirm}
      tabIndex={0}
      aria-label="Valider"
    >
      <Check className="h-5 w-5" />
    </button>
    <button
      className="p-1 text-gray-400 hover:text-red-500"
      onClick={onCancel}
      tabIndex={0}
      aria-label="Annuler"
    >
      <X className="h-5 w-5" />
    </button>
  </div>
);

export default AddInputCard;
