import React from "react";
import { Button } from "./button";

interface ArchiveFilterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  archived: boolean;
  onToggle: () => void;
  featureName: string;
  icon: React.ReactNode;
  className?: string;
}

export const ArchiveFilterButton: React.FC<ArchiveFilterButtonProps> = ({
  archived,
  onToggle,
  featureName,
  icon,
  className = "",
  ...props
}) => (
  <Button
    type="button"
    variant="outline"
    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors duration-200
      ${
        archived
          ? "bg-formality-primary text-white border-formality-primary hover:bg-formality-primary/90 hover:text-white hover:border-formality-primary"
          : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-formality-primary hover:border-formality-primary"
      }
      ${className}`}
    onClick={onToggle}
    {...props}
  >
    {icon}
    <span>
      {featureName} {archived ? "désarchivés" : "archivés"}
    </span>
  </Button>
);
