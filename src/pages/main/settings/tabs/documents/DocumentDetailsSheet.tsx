import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { DocumentService } from "@/api-swagger/services/DocumentService";
import type { DocumentDto } from "@/api-swagger/models/DocumentDto";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FileText, Calendar, Layers } from "lucide-react";
import { benefitOptions, typeOptions } from "./documents.utils";

interface DocumentDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string | null;
}

export const DocumentDetailsSheet: React.FC<DocumentDetailsSheetProps> = ({
  isOpen,
  onClose,
  documentId,
}) => {
  const { data: document, isLoading } = useQuery<DocumentDto>({
    queryKey: ["document", documentId, isOpen],
    queryFn: () =>
      DocumentService.documentControllerFindOne({ id: documentId }),
    enabled: !!documentId && isOpen,
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            Détails du document
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Informations détaillées du document
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        ) : document ? (
          <div className="p-6 space-y-8">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-blue-100 mb-2 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {document.documentName || "-"}
                </h3>

                <div className="flex gap-2 mt-1">
                  <Badge
                    variant="default"
                    className={
                      document.isArchived
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {document.isArchived ? "Archivé" : "Actif"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Nom court
                    </Label>
                  </div>
                  <p className="text-sm font-normal">
                    {document.shortName || "-"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Forme juridique
                    </Label>
                  </div>
                  <div className="flex flex-row flex-wrap gap-1">
                    {document.legalForm.map((v, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="truncate max-w-[60px] overflow-hidden"
                      >
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Prestations
                    </Label>
                  </div>
                  <div className="flex flex-row flex-wrap gap-1">
                    {document.benefit.map((v, idx) => (
                      <Badge key={idx} variant="outline">
                        {benefitOptions.find((option) => option.value === v)
                          ?.label || v}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Utilisation
                    </Label>
                  </div>
                  <div className="flex flex-row flex-wrap gap-1">
                    {document.type.map((v, idx) => (
                      <Badge key={idx} variant="outline">
                        {typeOptions.find((option) => option.value === v)
                          ?.label || v}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dates & ID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-formality-primary" />
                  <Label className="text-sm font-semibold text-gray-700">
                    Créé le
                  </Label>
                </div>
                <p className="text-sm font-normal text-gray-600">
                  {document.created_at
                    ? new Date(document.created_at).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-formality-primary" />
                  <Label className="text-sm font-semibold text-gray-700">
                    Dernière mise à jour
                  </Label>
                </div>
                <p className="text-sm font-normal text-gray-600">
                  {document.updated_at
                    ? new Date(document.updated_at).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
