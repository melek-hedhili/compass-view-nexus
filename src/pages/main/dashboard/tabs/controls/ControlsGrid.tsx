import React from "react";
import { ControlCard } from "./ControlCard";

interface Control {
  id: string;
  number: number;
  description: string;
  document: string;
  legalForms: string[];
  controlType: string;
  errorMessage: string;
  rule: string;
  isModifiable: boolean;
}

interface ControlsGridProps {
  controls: Control[];
  viewingArchived: boolean;
  onEdit: (control: Control) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export const ControlsGrid: React.FC<ControlsGridProps> = ({
  controls,
  viewingArchived,
  onEdit,
  onArchive,
  onRestore,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {controls.map((control) => (
      <ControlCard
        key={control.id}
        control={control}
        viewingArchived={viewingArchived}
        onEdit={onEdit}
        onArchive={onArchive}
        onRestore={onRestore}
      />
    ))}
  </div>
);
