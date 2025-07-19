import React from "react";
import {
  type AttachementDto,
  type PaginatedAttachementDto,
  type DocumentDto,
} from "@/api-swagger";
import { type Column, DataTable } from "@/components/ui/data-table";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";
import { Check, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface DocumentsTableProps {
  attachments: PaginatedAttachementDto;
  filesDocuments: DocumentDto[];
  selectedDocument: DocumentDto | null;
  handleDocumentSelection: (doc: AttachementDto) => void;
  handleDocumentTypeChange: (docId: string, newType: string) => void;
  paginationParams: { page: number; perPage: number };
  setPaginationParams: (params: { page: number; perPage: number }) => void;
  selectedRowId?: string;
  handleDeleteAttachment: (id: string) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  attachments,
  selectedDocument,
  filesDocuments,
  handleDocumentSelection,
  handleDocumentTypeChange,
  paginationParams,
  setPaginationParams,
  selectedRowId,
  handleDeleteAttachment,
}) => {
  const columns: Column<AttachementDto>[] = [
    {
      header: "Nom du document",
      key: "originalFile.fileName",
    },
    {
      header: "Type de document",
      render(_, row) {
        return (
          <ControlledSelect
            data={filesDocuments?.map((doc) => ({
              label: doc.shortName,
              value: doc._id,
            }))}
            name={`documentType_${row._id}`}
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
            defaultValue={row.document ? row.document._id : ""}
          />
        );
      },
    },
    {
      header: "OCR",
      alignHeader: "center",
      render(_, row) {
        return row.readByOcr ? (
          <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="h-3 w-3" />
          </div>
        ) : (
          <div className="mx-auto h-5 w-5 rounded-full border border-gray-300" />
        );
      },
    },
    {
      header: "AI",
      alignHeader: "center",
      render(_, row) {
        return row.updatedByAi ? (
          <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="h-3 w-3" />
          </div>
        ) : (
          <div className="mx-auto h-5 w-5 rounded-full border border-gray-300" />
        );
      },
    },
    {
      header: "Actions",
      alignHeader: "center",
      align: "center",

      render: (_, row) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteAttachment(row._id);
                }}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Supprimer</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];
  return (
    <div className="p-0">
      <DataTable
        data={attachments?.data ?? []}
        columns={columns}
        count={attachments?.count}
        page={paginationParams.page}
        perPage={paginationParams.perPage}
        onRowClick={handleDocumentSelection}
        onPageChange={(page) =>
          setPaginationParams({ ...paginationParams, page })
        }
        onPerPageChange={(perPage) =>
          setPaginationParams({ ...paginationParams, perPage })
        }
        selectedRowId={selectedRowId}
      />
    </div>
  );
};

export default DocumentsTable;
