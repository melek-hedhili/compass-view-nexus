import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";
import { type DocumentDto } from "@/api-swagger";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface RequiredDocumentsTableProps {
  documents: DocumentDto[];

  loading: boolean;
}

const RequiredDocumentsTable: React.FC<RequiredDocumentsTableProps> = ({
  documents,
  loading,
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (!loading && documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 border rounded bg-muted">
        Aucun document requis trouvé
      </div>
    );
  }
  return (
    <Card className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-medium">Documents nécessaires pour le dossier</h3>
      </div>

      <div className="p-0">
        <Table>
          <TableBody>
            {documents.map((doc) => (
              <TableRow
                key={doc._id}
                // className={`bg-gray-100 hover:bg-gray-50 ${
                //   doc.linkedDocumentId ? "cursor-pointer" : ""
                // }`}
                // onClick={() => {
                //   if (doc.linkedDocumentId) {
                //     const linkedDoc = documents.find(
                //       (d) => d._id === doc.linkedDocumentId
                //     );
                //     if (linkedDoc) handleDocumentSelection(linkedDoc);
                //   }
                // }}
              >
                <TableCell>{doc.shortName}</TableCell>
                <TableCell className="w-12 text-center">
                  {doc.documentUploaded ? (
                    <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                      <Check className="h-3 w-3" />
                    </div>
                  ) : (
                    <div className="mx-auto h-5 w-5 rounded-full border border-gray-300" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RequiredDocumentsTable;
