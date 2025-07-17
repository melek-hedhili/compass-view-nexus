import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Edit2,
  Archive,
  RotateCcw,
  FileText,
  Layers,
  Code,
  Eye,
} from "lucide-react";
import { DataDto } from "@/api-swagger";

interface QuoteCardProps {
  data: DataDto;
  viewingArchived: boolean;
  onView: (data: DataDto) => void;
  onEdit: (data: DataDto) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  data,
  viewingArchived,
  onView,
  onEdit,
  onArchive,
  onRestore,
}) => (
  <Card className="bg-white border border-gray-100 flex flex-col h-full shadow-sm rounded-xl overflow-hidden">
    {/* Accent bar */}
    <div className="h-2 w-full bg-formality-primary" />
    <CardHeader className="pb-2">
      <div className="flex flex-col gap-1">
        <CardTitle className="text-lg font-bold text-formality-accent truncate max-w-full">
          {data.fieldName}
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="pb-2 bg-gray-50 rounded-b-lg px-4 py-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-4 w-4 text-formality-primary" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Type
          </span>
          <Badge
            variant="outline"
            className={`bg-gray-100 text-xs font-medium truncate max-w-[80px] min-w-[56px] px-2.5 py-1 ml-3 flex items-center justify-center ${
              data.type ? "text-gray-700" : "text-gray-400"
            }`}
            style={{ lineHeight: "1.2" }}
          >
            {data.type ? getResponseTypeLabel(data.type) : "—"}
          </Badge>
        </div>
        {/* Forme juridique Section (badges start inline, wrap only if needed) */}
        <div className="flex flex-row flex-wrap items-center gap-2 mb-1 min-w-0">
          <FileText className="h-4 w-4 text-formality-primary" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
            Forme juridique
          </span>
          <div className="flex flex-row flex-wrap gap-1 items-center min-w-0 flex-1">
            {Array.isArray(data.legalForm) && data.legalForm.length > 0 ? (
              <>
                {data.legalForm.slice(0, 1).map((form, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 font-medium min-w-fit truncate max-w-[80px] overflow-hidden"
                  >
                    {form}
                  </Badge>
                ))}
                {data.legalForm.length > 1 && (
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 font-medium min-w-fit truncate max-w-[80px] overflow-hidden"
                  >
                    +{data.legalForm.length - 1}
                  </Badge>
                )}
              </>
            ) : data.legalForm ? (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 font-medium min-w-fit truncate max-w-[80px] overflow-hidden"
              >
                {data.legalForm}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5 font-medium min-w-fit truncate max-w-[80px] overflow-hidden"
              >
                —
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-4 w-4 text-formality-primary" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Liste associée
          </span>
          <Badge
            variant="outline"
            className={`bg-gray-100 text-xs font-medium  min-w-[56px] px-2.5 py-1 ml-3 flex items-center justify-center ${
              data.list?.fieldName ? "text-gray-700" : "text-gray-400"
            }`}
            style={{ lineHeight: "1.2" }}
          >
            {data.list?.fieldName || "—"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Code className="h-4 w-4 text-formality-primary" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Scripts
          </span>
          <Badge
            variant="outline"
            className={`bg-gray-100 text-xs font-medium ${
              typeof data.documents?.length === "number"
                ? "text-gray-700"
                : "text-gray-400"
            }`}
          >
            {typeof data.documents?.length === "number"
              ? data.documents.length
              : "—"}
          </Badge>
        </div>
      </div>
    </CardContent>
    <CardFooter className="pt-2 mt-auto">
      <div className="flex flex-row flex-wrap gap-2 w-full">
        <Button
          variant="outline"
          className="text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600 flex-1 min-w-[120px]"
          onClick={() => onView(data)}
        >
          <Eye className="h-4 w-4" />
          Détails
        </Button>
        <Button
          className="bg-formality-primary hover:bg-formality-primary/80 text-white flex-1 min-w-[120px]"
          onClick={() => onEdit(data)}
          disabled={viewingArchived}
        >
          <Edit2 className="h-4 w-4" /> Modifier
        </Button>
        {viewingArchived ? (
          <Button
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 flex-1 min-w-[120px]"
            onClick={() => onRestore(data._id!)}
          >
            <RotateCcw className="h-4 w-4" /> Restaurer
          </Button>
        ) : (
          <Button
            variant="outline"
            className="text-gray-600 border-gray-600 hover:bg-gray-50 hover:text-gray-700 flex-1 min-w-[120px]"
            onClick={() => onArchive(data._id!)}
          >
            <Archive className="h-4 w-4" /> Archiver
          </Button>
        )}
      </div>
    </CardFooter>
  </Card>
);
const getResponseTypeLabel = (type: DataDto.type) => {
  switch (type) {
    case DataDto.type.STRING:
      return "Texte libre";
    case DataDto.type.DATE:
      return "Date";
    case DataDto.type.NUMBER:
      return "Nombre";
    case DataDto.type.SINGLE_CHOICE:
      return "Choix unique";
    case DataDto.type.MULTIPLE_CHOICE:
      return "Choix multiple";
    default:
      return type;
  }
};
