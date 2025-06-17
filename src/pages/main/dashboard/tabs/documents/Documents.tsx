import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/api-swagger";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { DocumentsGrid } from "./DocumentsGrid";
import { DocumentForm } from "./DocumentForm";
import { usePagination } from "./hooks/usePagination";
import { toast } from "sonner";

const Documents = () => {
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { paginationParams, handleSearch } = usePagination();

  // Fetch all documents
  const { data: documentsData, isLoading } = useQuery({
    queryKey: [
      "documents",
      paginationParams.page,
      paginationParams.perPage,
      paginationParams.sortField,
      paginationParams.sortOrder,
    ],
    queryFn: () =>
      DocumentService.documentControllerFindAll({
        page: paginationParams.page.toString(),
        perPage: paginationParams.perPage.toString(),
        ...(paginationParams.sortField && {
          sortField: paginationParams.sortField,
        }),
        ...(paginationParams.sortOrder && {
          sortOrder: paginationParams.sortOrder,
        }),
      }),
  });
  const deleteDocumentMutation = useMutation({
    mutationFn: (docId: string) =>
      DocumentService.documentControllerRemove({ id: docId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast.success("Document supprimé avec succès");
    },
    onError: (error) => {
      toast.error("Erreur lors de la suppression du document");
      console.error("Delete error:", error);
    },
  });
  const handleDeleteDocument = (docId: string) => {
    setDocumentToDelete(docId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteDocumentMutation.mutateAsync(documentToDelete);
    }
    setIsConfirmModalOpen(false);
    setDocumentToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setDocumentToDelete(null);
  };

  const handleOpenDrawer = (docId?: string) => {
    if (docId) {
      setEditingId(docId);
    } else {
      setEditingId(null);
    }
    setIsSheetOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsSheetOpen(false);
    setEditingId(null);
  };

  // Filter documents based on search term
  const filteredDocuments = documentsData?.data?.filter((doc) => {
    if (!paginationParams.searchTerm) return true;
    const term = paginationParams.searchTerm.toLowerCase();
    return (
      doc.documentName?.toLowerCase().includes(term) ||
      doc.shortName?.toLowerCase().includes(term) ||
      doc.legalForm?.toLowerCase().includes(term) ||
      doc.benefit?.toLowerCase().includes(term) ||
      doc.type?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border-gray-200"
            />
          </div>
          <Button
            onClick={() => handleOpenDrawer()}
            className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau document</span>
          </Button>
        </div>
      </div>

      <DocumentsGrid
        documents={filteredDocuments}
        isLoading={isLoading}
        onEdit={handleOpenDrawer}
        onDelete={handleDeleteDocument}
        deleteLoading={deleteDocumentMutation.isPending}
      />

      <DocumentForm
        isOpen={isSheetOpen}
        onClose={handleCloseDrawer}
        editingId={editingId}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onPressConfirm={handleConfirmDelete}
        title="Supprimer le document"
        description="Êtes-vous sûr de vouloir supprimer ce document ?"
      />
    </div>
  );
};

export default Documents;
