import React from "react";
import { QuoteCard } from "./QuoteCard";
import { DataDto, PaginatedDataDto } from "@/api-swagger";

interface QuotesGridProps {
  dataItems: PaginatedDataDto | undefined;
  viewingArchived: boolean;
  onEdit: (data: DataDto) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export const QuotesGrid: React.FC<QuotesGridProps> = ({
  dataItems,
  viewingArchived,
  onEdit,
  onArchive,
  onRestore,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {dataItems?.data?.map((data) => (
      <QuoteCard
        key={data._id!}
        data={data}
        viewingArchived={viewingArchived}
        onEdit={onEdit}
        onArchive={onArchive}
        onRestore={onRestore}
      />
    ))}
  </div>
);
