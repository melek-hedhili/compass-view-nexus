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
} from "lucide-react";
import { DataDto } from "@/api-swagger";

interface QuoteCardProps {
  data: DataDto;
  viewingArchived: boolean;
  onEdit: (data: DataDto) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  data,
  viewingArchived,
  onEdit,
  onArchive,
  onRestore,
}) => (
  <Card className="bg-white border border-gray-100 flex flex-col h-full shadow-sm rounded-xl overflow-hidden">
    {/* Accent bar */}
    <div className="h-2 w-full bg-formality-primary" />
    <CardHeader className="pb-2">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 font-mono truncate">
          N°{data._id}
        </span>
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
            className={`bg-gray-100 text-xs font-medium ${
              data.type ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {data.type ? getResponseTypeLabel(data.type) : "—"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="h-4 w-4 text-formality-primary" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Forme juridique
          </span>
          {data.legalForm ? (
            Array.isArray(data.legalForm) ? (
              data.legalForm.map((form, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="bg-gray-100 text-gray-700 text-xs font-medium"
                >
                  {form}
                </Badge>
              ))
            ) : (
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {data.legalForm}
              </Badge>
            )
          ) : (
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-400 text-xs font-medium"
            >
              —
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-4 w-4 text-formality-primary" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Liste associée
          </span>
          <Badge
            variant="outline"
            className={`bg-gray-100 text-xs font-medium ${
              data.list?.fieldName ? "text-gray-700" : "text-gray-400"
            }`}
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
    <CardFooter className="pt-2 mt-auto flex gap-2">
      {viewingArchived ? (
        <Button
          variant="outline"
          className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 flex-1 min-w-[100px]"
          onClick={() => onRestore(data._id!)}
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Désarchiver
        </Button>
      ) : (
        <Button
          variant="outline"
          className="text-gray-600 border-gray-600 hover:bg-gray-50 hover:text-gray-700 flex-1 min-w-[100px]"
          onClick={() => onArchive(data._id!)}
        >
          <Archive className="h-4 w-4 mr-1" /> Archiver
        </Button>
      )}
      <Button
        className="bg-orange-500 hover:bg-orange-600 text-white flex-1 min-w-[100px]"
        onClick={() => onEdit(data)}
        disabled={viewingArchived}
      >
        <Edit2 className="h-4 w-4 mr-1" /> Modifier
      </Button>
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
    case DataDto.type.BOOLEAN:
      return "Choix unique";
    case DataDto.type.MULTIPLE_CHOICE:
      return "Choix multiple";
    default:
      return type;
  }
};
