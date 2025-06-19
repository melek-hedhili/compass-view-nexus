import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
}) => {
  const getLegalFormLabels = (legalForm: string) => {
    if (legalForm.length === 5) return "Toutes les formes";
    return legalForm;
  };

  const getResponseTypeLabel = (type: string) => {
    switch (type) {
      case "STRING":
        return "Texte libre";
      case "DATE":
        return "Date";
      case "NUMBER":
        return "Nombre";
      case "BOOLEAN":
        return "Choix unique";
      case "MULTIPLE_CHOICE":
        return "Choix multiple";
      default:
        return type;
    }
  };

  return (
    <Card className="border border-gray-100 hover:shadow-md transition-shadow rounded-lg overflow-hidden">
      <CardContent className="p-6 relative pb-20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{data.fieldName}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {data.tree?.fieldName ?? "Aucune arborescence"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium mb-1">Formes juridiques:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              {getLegalFormLabels(data.legalForm ?? "")}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm font-medium mb-1">Type de réponse:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              {getResponseTypeLabel(data.type ?? "")}
            </span>
          </div>
        </div>
        {data.isModifiable && (
          <div className="mt-2">
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
              Modifiable
            </span>
          </div>
        )}
        <div className="mt-4">
          <Button
            variant="outline"
            className="w-full flex justify-between items-center py-2 border-gray-200"
          >
            <div className="flex items-center gap-2">
              <code className="text-gray-500">&lt;&gt;</code>
              <span>Scripts ChatGPT</span>
            </div>
            <span className="text-lg">▼</span>
          </Button>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
          {viewingArchived ? (
            <Button
              variant="outline"
              className="text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600"
              onClick={() => onRestore(data._id!)}
            >
              Restaurer
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => onArchive(data._id!)}
            >
              Archiver
            </Button>
          )}
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => onEdit(data)}
            disabled={viewingArchived}
          >
            Modifier
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
