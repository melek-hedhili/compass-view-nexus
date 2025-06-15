
import { DocumentDto } from "@/api-swagger";
import { DocumentCard } from "./DocumentCard";

interface DocumentsGridProps {
  documents?: DocumentDto[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
}

export const DocumentsGrid: React.FC<DocumentsGridProps> = ({
  documents,
  isLoading,
  onEdit,
  onDelete,
  deleteLoading,
}) => {
  if (isLoading) {
    return (
      <div className="col-span-full text-center py-8">Chargement...</div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="col-span-full bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
        Aucun document trouvé
      </div>
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
