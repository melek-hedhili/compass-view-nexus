import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React from "react";

const AddActionCard = ({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 sm:gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group/add-action select-none mb-2",
      className
    )}
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    role="button"
    aria-label={typeof children === "string" ? children : undefined}
  >
    <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover/add-action:text-blue-500 transition-colors" />
    <span className="text-sm sm:text-base text-gray-500 group-hover/add-action:text-blue-600 transition-colors font-medium">
      {children}
    </span>
  </div>
);

export default AddActionCard;
