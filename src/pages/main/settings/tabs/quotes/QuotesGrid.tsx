import React from "react";
import { QuoteCard } from "./QuoteCard";
import { type DataDto, type PaginatedDataDto } from "@/api-swagger";
import SettingsNoDataFound from "@/components/layout/SettingsNoDataFound";
import { Database } from "lucide-react";

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
}) => {
  if (dataItems?.data?.length === 0) {
    return (
      <SettingsNoDataFound
        icon={<Database className="h-12 w-12 text-gray-400" />}
        title="Aucune donnée trouvée"
        description="Ajoutez une donnée pour commencer."
        buttonText="Nouvelle donnée"
        onButtonClick={() => onEdit && onEdit(null)}
      />
    );
  }
  return (
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
};
