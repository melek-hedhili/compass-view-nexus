import { type DocumentDto } from "@/api-swagger";
import { DocumentCard } from "./DocumentCard";
import SettingsNoDataFound from "@/components/layout/SettingsNoDataFound";
import { FileText } from "lucide-react";

interface DocumentsGridProps {
  documents?: DocumentDto[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
}

export const DocumentsGrid: React.FC<DocumentsGridProps> = ({
  documents,
  onEdit,
  onDelete,
  deleteLoading,
}) => {
  if (!documents || documents.length === 0) {
    return (
      <SettingsNoDataFound
        icon={<FileText className="h-12 w-12 text-gray-400" />}
        title="Aucun document trouvé"
        description="Ajoutez un document pour commencer."
        buttonText="Nouveau document"
        onButtonClick={() => onEdit && onEdit(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((doc) => (
        <DocumentCard
          key={doc._id}
          doc={doc}
          onEdit={onEdit}
          onDelete={onDelete}
          deleteLoading={deleteLoading}
        />
      ))}
    </div>
  );
};
