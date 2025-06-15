
import { useEffect, useState } from "react";
import AppLayout from "../../../../../components/layout/AppLayout";
import { NavTabs } from "../../../../../components/dashboard/NavTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DocumentService } from "@/api-swagger";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { DocumentsGrid } from "./DocumentsGrid";
import { DocumentForm } from "./DocumentForm";
import { usePagination } from "./hooks/usePagination";
import { useDocumentMutations } from "./hooks/useDocumentMutations";

const Documents = () => {
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

  const { paginationParams, handleSearch } = usePagination();
  const { deleteDocumentMutation } = useDocumentMutations();

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
    <AppLayout>
      <NavTabs />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 border-gray-700"
              value={paginationParams.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex items-center gap-2 bg-formality-primary hover:bg-formality-primary/90 text-white"
              onClick={() => handleOpenDrawer()}
            >
              <Plus className="h-4 w-4" />
              <span>Document</span>
            </Button>
          </div>
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
    </AppLayout>
  );
};

export default Documents;
