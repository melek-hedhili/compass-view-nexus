
import React from "react";
import { QuoteCard } from "./QuoteCard";

interface DataItem {
  id: string;
  name: string;
  legalForms: string[];
  arborescence: string;
  modifiable: boolean;
  responseType: string;
}

interface QuotesGridProps {
  dataItems: DataItem[];
  viewingArchived: boolean;
  onEdit: (data: DataItem) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export const QuotesGrid: React.FC<QuotesGridProps> = ({
  dataItems,
  viewingArchived,
  onEdit,
  onArchive,
  onRestore,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dataItems.map((data) => (
        <QuoteCard
          key={data.id}
          data={data}
          viewingArchived={viewingArchived}
          onEdit={onEdit}
          onArchive={onArchive}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
};
