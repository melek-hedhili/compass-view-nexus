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
  Eye,
  Edit2,
  FileText,
  List as ListIcon,
  Archive,
  RotateCcw,
} from "lucide-react";
import { type ListDto } from "@/api-swagger";

interface ListCardProps {
  list: ListDto;
  onView: (list: ListDto) => void;
  onEdit: (list: ListDto) => void;
  onArchive: (id: string, type: "archive" | "unarchive") => void;
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onView,
  onEdit,
  onArchive,
}) => (
  <Card className="bg-white border border-gray-100 flex flex-col h-full shadow-sm rounded-xl overflow-hidden">
    {/* Accent bar */}
    <div className="h-2 w-full bg-formality-primary" />
    <CardHeader className="pb-2">
      <div className="flex flex-col gap-1">
        <CardTitle className="text-lg font-bold text-formality-accent truncate max-w-full">
          {list.fieldName}
        </CardTitle>
      </div>
    </CardHeader>

    <CardContent className="pb-2 bg-gray-50 rounded-b-lg px-4 py-3">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-formality-primary" />
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Contenu
            </h4>
          </div>
          <p className="text-sm break-words text-gray-700 font-medium truncate max-w-full pl-6">
            {list.fieldName}
          </p>
        </div>

        {list.values?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ListIcon className="h-4 w-4 text-formality-primary" />
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Valeurs
              </h4>
            </div>
            <div className="flex flex-wrap gap-2 pl-6">
              {list.values.slice(0, 7).map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-100 max-w-full truncate px-2 py-1 text-xs font-medium"
                  title={item}
                >
                  {item}
                </Badge>
              ))}
              {list.values.length > 7 && (
                <Badge
                  variant="outline"
                  className="bg-gray-200 text-gray-600 px-2 py-1 text-xs font-medium"
                >
                  +{list.values.length - 7}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </CardContent>

    <CardFooter className="pt-2 mt-auto">
      <div className="flex flex-row flex-wrap gap-2 w-full">
        <Button
          variant="outline"
          className="text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600 flex-1 min-w-[120px]"
          onClick={() => onView(list)}
        >
          <Eye className="h-4 w-4" />
          Détails
        </Button>

        <Button
          className="bg-formality-primary hover:bg-formality-primary/80 text-white flex-1 min-w-[120px]"
          onClick={() => onEdit(list)}
        >
          <Edit2 className="h-4 w-4" />
          Modifier
        </Button>

        <Button
          variant={list.isArchived ? "outline" : "outline"}
          className={`flex-1 min-w-[120px] ${
            list.isArchived
              ? "text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
              : "text-gray-600 border-gray-600 hover:bg-gray-50 hover:text-gray-700"
          }`}
          onClick={() =>
            onArchive(list._id, list.isArchived ? "unarchive" : "archive")
          }
        >
          {list.isArchived ? (
            <>
              <RotateCcw className="h-4 w-4" />
              Désarchiver
            </>
          ) : (
            <>
              <Archive className="h-4 w-4" />
              Archiver
            </>
          )}
        </Button>
      </div>
    </CardFooter>
  </Card>
);
