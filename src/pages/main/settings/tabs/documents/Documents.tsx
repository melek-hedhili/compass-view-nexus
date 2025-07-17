import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Search, Archive } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DocumentService } from "@/api-swagger";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { DocumentForm } from "./DocumentForm";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { useSearchDebounce } from "@/hooks/use-search-debounce";
import { Form } from "@/components/ui/form";
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  benefitOptions,
  legalFormOptions,
  typeOptions,
} from "./documents.utils";
import { ArchiveFilterButton } from "@/components/ui/ArchiveFilterButton";
import { useDocumentMutations } from "./hooks/useDocumentMutations";

const Documents = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    docId: string;
    type: "archive" | "unarchive";
  } | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const { handleArchivingMutation } = useDocumentMutations({});
  const methods = useForm<{
    search: string;
  }>({
    defaultValues: {
      search: "",
    },
  });

  const searchValue = useSearchDebounce({
    control: methods.control,
    name: "search",
  });
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (paginationParams.page !== 1) {
      setPaginationParams((prev) => ({ ...prev, page: 1 }));
    }
  }, [searchValue]);

  const handlePageChange = (newPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      perPage: newPerPage,
      page: 1,
    }));
  };

  // Fetch all documents
  const { data: documentsData, isLoading } = useQuery({
    queryKey: [
      "documents",
      paginationParams.page,
      paginationParams.perPage,
      searchValue,
      isArchived,
    ],
    queryFn: () =>
      DocumentService.documentControllerFindAll({
        page: paginationParams.page.toString(),
        perPage: paginationParams.perPage.toString(),
        searchValue,
        searchFields: [
          "documentName",
          "shortName",
          "legalForm",
          "benefit",
          "type",
        ],
        filters: JSON.stringify([
          {
            field: "isArchived",
            values: [isArchived.toString()],
          },
        ]),
      }),
  });

  const handleArchivingDocument = (
    docId: string,
    type: "archive" | "unarchive"
  ) => {
    setDocumentToDelete({ docId, type });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmArchiving = (type: "archive" | "unarchive") => {
    if (documentToDelete) {
      handleArchivingMutation.mutateAsync({
        docId: documentToDelete.docId,
        type: documentToDelete.type,
      });
    }
    setIsConfirmModalOpen(false);
    setDocumentToDelete(null);
  };

  const handleCancelArchiving = () => {
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

  const handleOpenDetails = (docId: string) => {
    setSelectedDocumentId(docId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedDocumentId(null);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-6">
        <div className="flex items-center mb-4 md:mb-0" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Form methods={methods}>
            <ControlledInput
              startAdornment={<Search className="h-4 w-4 text-gray-400" />}
              name="search"
              placeholder="Recherche..."
            />
          </Form>
          <ArchiveFilterButton
            archived={isArchived}
            onToggle={() => setIsArchived((prev) => !prev)}
            featureName="Documents"
            icon={<Archive className="h-4 w-4" />}
          />
          <Button
            onClick={() => handleOpenDrawer()}
            className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau document</span>
          </Button>
        </div>
      </div>
      <div className="card-elegant w-full">
        <DataTable
          columns={[
            {
              header: "Nom",
              key: "documentName",
            },
            {
              header: "Nom court",
              key: "shortName",
            },
            {
              header: "Forme juridique",
              key: "legalForm",
              render: (value) =>
                Array.isArray(value) ? (
                  <div className="flex flex-row flex-wrap gap-1">
                    {value.map((v, idx) => (
                      <Badge key={idx} variant="outline">
                        {legalFormOptions.find((option) => option.value === v)
                          ?.label || v}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Badge variant="outline">
                    {legalFormOptions.find((option) => option.value === value)
                      ?.label || value}
                  </Badge>
                ),
            },
            {
              header: "Prestations",
              key: "benefit",
              render: (value) =>
                Array.isArray(value) ? (
                  <div className="flex flex-row flex-wrap gap-1">
                    {value.map((v, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {benefitOptions.find((option) => option.value === v)
                          ?.label || v}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {benefitOptions.find((option) => option.value === value)
                      ?.label || value}
                  </Badge>
                ),
            },
            {
              header: "Utilisation",
              key: "type",
              render: (value) =>
                Array.isArray(value) ? (
                  <div className="flex flex-row flex-wrap gap-1">
                    {value.map((v, idx) => (
                      <Badge key={idx} variant="outline">
                        {typeOptions.find((option) => option.value === v)
                          ?.label || v}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Badge variant="outline">
                    {typeOptions.find((option) => option.value === value)
                      ?.label || value}
                  </Badge>
                ),
            },
            {
              header: "Actions",
              render: (_, row) => (
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          disabled={row.isArchived}
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawer(row._id);
                          }}
                        >
                          <Pencil className="h-4 w-4 text-formality-primary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editer</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchivingDocument(
                              row._id,
                              row.isArchived ? "unarchive" : "archive"
                            );
                          }}
                        >
                          <Archive className="h-4 w-4 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {row.isArchived ? "Restaurer" : "Archiver"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              ),
            },
          ]}
          perPage={paginationParams.perPage}
          page={paginationParams.page}
          data={documentsData?.data || []}
          count={documentsData?.count}
          loading={isLoading}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onRowClick={(row) => handleOpenDetails(row._id)}
        />
      </div>
      {/* <DocumentsGrid
        documents={documentsData?.data || []}
        onEdit={handleOpenDrawer}
        onDelete={handleDeleteDocument}
        deleteLoading={deleteDocumentMutation.isPending}
      /> */}

      <DocumentForm
        isOpen={isSheetOpen}
        onClose={handleCloseDrawer}
        editingId={editingId}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelArchiving}
        onPressConfirm={() => handleConfirmArchiving(documentToDelete?.type)}
        title="Archiver le document"
        description="Êtes-vous sûr de vouloir archiver ce document ?"
      />

      <DocumentDetailsSheet
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        documentId={selectedDocumentId}
      />
    </div>
  );
};

export default Documents;
