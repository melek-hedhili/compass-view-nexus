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
  const { data: document } = useQuery<DocumentDto>({
    queryKey: ["document", documentId],
    queryFn: () =>
      DocumentService.documentControllerFindOne({ id: documentId }),
    enabled: !!documentId,
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[450px] sm:w-[900px] p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            Détails du document
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Informations détaillées du document
          </SheetDescription>
        </SheetHeader>
        {document && (
          <div className="p-6 space-y-6">
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Nom du document
              </Label>
              <p className="text-sm font-normal">{document.documentName}</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Nom court
              </Label>
              <p className="text-sm font-normal">{document.shortName}</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Forme juridique
              </Label>
              <Badge variant="outline" className="text-sm font-normal">
                {document.legalForm}
              </Badge>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Prestations
              </Label>
              <Badge variant="outline" className="text-sm font-normal">
                {document.benefit}
              </Badge>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Utilisation
              </Label>
              <Badge variant="outline" className="text-sm font-normal">
                {document.type}
              </Badge>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                ID
              </Label>
              <p className="text-xs text-gray-400">{document._id}</p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Date de création
              </Label>
              <p className="text-sm font-normal text-gray-600">
                {document.created_at
                  ? new Date(document.created_at).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div>
              <Label className="block text-base font-semibold text-gray-700 mb-1">
                Dernière mise à jour
              </Label>
              <p className="text-sm font-normal text-gray-600">
                {document.updated_at
                  ? new Date(document.updated_at).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
