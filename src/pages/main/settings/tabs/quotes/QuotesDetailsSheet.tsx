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
import { DataService } from "@/api-swagger/services/DataService";
import type { DataDto } from "@/api-swagger/models/DataDto";
import { CreateDataDto, TreeDto } from "@/api-swagger";
import { FileText, Link, Layers, Code, Calendar, Hash } from "lucide-react";
import { benefitOptions, typeOptions } from "../documents/documents.utils";

interface QuotesDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  quoteId: string | null;
}

const getResponseTypeLabel = (type: DataDto.type) => {
  switch (type) {
    case CreateDataDto.type.STRING:
      return "Texte libre";
    case CreateDataDto.type.DATE:
      return "Date";
    case CreateDataDto.type.NUMBER:
      return "Nombre";
    case CreateDataDto.type.SINGLE_CHOICE:
      return "Choix unique";
    case CreateDataDto.type.MULTIPLE_CHOICE:
      return "Choix multiple";
    default:
      return type;
  }
};
const getTreeTypeLabel = (type: TreeDto.type) => {
  switch (type) {
    case TreeDto.type.SECTION:
      return "Rubrique";
    case TreeDto.type.TITLE:
      return "Famille";
    case TreeDto.type.SUB_TITLE:
      return "Sous-Famille";
    default:
      return type;
  }
};

export const QuotesDetailsSheet: React.FC<QuotesDetailsSheetProps> = ({
  isOpen,
  onClose,
  quoteId,
}) => {
  const { data: quote } = useQuery<DataDto>({
    queryKey: ["quote", quoteId, isOpen],
    queryFn: () => DataService.dataControllerFindOne({ id: quoteId }),
    enabled: !!quoteId && isOpen,
  });
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            Détails de la donnée
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Informations détaillées de la donnée
          </SheetDescription>
        </SheetHeader>
        {quote && (
          <div className="p-6 space-y-8">
            {/* Basic Information Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Hash className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {quote.fieldName || "-"}
                  </h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  {quote.type ? getResponseTypeLabel(quote.type) : "-"}
                </Badge>
                <Badge
                  variant={quote.isArchived ? "destructive" : "default"}
                  className={
                    quote.isArchived ? "" : "bg-green-100 text-green-800"
                  }
                >
                  {quote.isArchived ? "Archivé" : "Actif"}
                </Badge>
              </div>
            </div>

            {/* Main Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Forme juridique
                    </Label>
                  </div>
                  {quote.legalForm ? (
                    Array.isArray(quote.legalForm) ? (
                      quote.legalForm.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {quote.legalForm.map((form, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-sm"
                            >
                              {form || "-"}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">-</p>
                      )
                    ) : (
                      <Badge variant="outline" className="text-sm">
                        {quote.legalForm || "-"}
                      </Badge>
                    )
                  ) : (
                    <p className="text-sm text-gray-400">-</p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Link className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Liste associée
                    </Label>
                  </div>
                  {quote.list?.fieldName ? (
                    <div>
                      <Badge variant="outline" className="text-sm mb-2">
                        {quote.list.fieldName || "-"}
                      </Badge>
                      {quote.list.values && quote.list.values.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {quote.list.values.map((value, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {value || "-"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">-</p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Dates
                    </Label>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Créé le:</span>
                      <p className="font-medium">
                        {quote.created_at
                          ? new Date(quote.created_at).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Modifié le:</span>
                      <p className="font-medium">
                        {quote.updated_at
                          ? new Date(quote.updated_at).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Propriétés
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Modifiable:</span>
                      <Badge
                        variant={quote.isModifiable ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {quote.isModifiable ? "Oui" : "Non"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Champ de contrôle:
                      </span>
                      <Badge
                        variant={quote.isControlField ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {quote.isControlField ? "Oui" : "Non"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Multi-éléments:
                      </span>
                      <Badge
                        variant={quote.isMultiItem ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {quote.isMultiItem ? "Oui" : "Non"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {quote.dependsOn && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Link className="h-4 w-4 text-formality-primary" />
                      <Label className="text-sm font-semibold text-gray-700">
                        Dépend de
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Champ:</span>
                        <p className="text-sm font-medium">
                          {quote.dependsOn.fieldName || "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          {quote.dependsOn.type
                            ? getResponseTypeLabel(quote.dependsOn.type)
                            : "-"}
                        </Badge>
                      </div>
                      <div className="flex flex-row flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">Valeur:</span>
                        {quote.dependenceValue.map((value, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {quote.tree && (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="h-4 w-4 text-formality-primary" />
                      <Label className="text-sm font-semibold text-gray-700">
                        Arborescence
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-row gap-1">
                        <span className="text-sm text-gray-600">Nom:</span>
                        <p className="text-sm font-medium">
                          {quote.tree.fieldName || "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="outline" className="text-xs ml-1">
                          {getTreeTypeLabel(quote.tree.type) || "-"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Documents Section */}
            {quote.documents && quote.documents.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-formality-primary" />
                  <Label className="text-base font-semibold text-gray-700">
                    Scripts associés ({quote.documents.length})
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quote.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg border"
                    >
                      <div className="mb-2">
                        <h4 className="font-medium text-sm">
                          {doc.document.documentName || "-"}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Array.isArray(doc.document?.type) &&
                          doc.document?.type.length > 0 ? (
                            doc.document?.type.map((t, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs px-2 py-0.5"
                              >
                                {typeOptions.find(
                                  (option) => option.value === t
                                )?.label || t}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>
                          <span className="font-medium">Nom court:</span>{" "}
                          {doc.document.shortName || "-"}
                        </p>
                        <p>
                          <span className="font-medium">Forme juridique:</span>{" "}
                          {doc.document.legalForm || "-"}
                        </p>
                        <p>
                          <span className="font-medium">Prestation:</span>{" "}
                          {Array.isArray(doc.document?.benefit)
                            ? doc.document?.benefit?.map((b, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {benefitOptions.find(
                                    (option) => option.value === b
                                  )?.label || b}
                                </Badge>
                              ))
                            : "-"}
                        </p>
                        <p>
                          <span className="font-medium">Script:</span>{" "}
                          {doc.script || "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
