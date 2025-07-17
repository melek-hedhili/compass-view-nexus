import React from "react";
import {
  type AttachementDto,
  type PaginatedAttachementDto,
  type DocumentDto,
} from "@/api-swagger";
import { type Column, DataTable } from "@/components/ui/data-table";
import { ControlledSelect } from "@/components/ui/controlled/controlled-select/controlled-select";
import { Check } from "lucide-react";

interface DocumentsTableProps {
  attachments: PaginatedAttachementDto;
  filesDocuments: DocumentDto[];
  selectedDocument: DocumentDto | null;
  handleDocumentSelection: (doc: DocumentDto) => void;
  handleDocumentTypeChange: (docId: string, newType: string) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({
  attachments,
  selectedDocument,
  filesDocuments,
  handleDocumentSelection,
  handleDocumentTypeChange,
}) => {
  const columns: Column<AttachementDto>[] = [
    {
      header: "Nom du document",
      key: "document.shortName",
    },
    {
      header: "Type de document",
      render(_, __) {
        return (
          <ControlledSelect
            data={filesDocuments.map((doc) => ({
              label: doc.shortName,
              value: doc._id,
            }))}
            name="documentType"
            getOptionValue={(option) => option.value}
            getOptionLabel={(option) => option.label}
          />
        );
      },
    },
    {
      header: "OCR",
      render(_, row) {
        return row.document ? (
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
      render(_, row) {
        return row.document ? (
          <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="h-3 w-3" />
          </div>
        ) : (
          <div className="mx-auto h-5 w-5 rounded-full border border-gray-300" />
        );
      },
    },
  ];
  return (
    <div className="p-0">
      <DataTable
        data={attachments?.data ?? []}
        columns={columns}
        count={attachments?.count}
        page={attachments?.page}
        perPage={attachments?.perPage}
      />
    </div>
  );
};

export default DocumentsTable;
