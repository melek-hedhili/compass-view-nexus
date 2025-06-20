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
import { Eye } from "lucide-react";
import { ListDto } from "@/api-swagger";

interface ListCardProps {
  list: ListDto;
  onView: (list: ListDto) => void;
  onEdit: (list: ListDto) => void;
  onDelete: (id: string) => void;
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onView,
  onEdit,
  onDelete,
}) => (
  <Card className="bg-white shadow-sm border border-gray-100 flex flex-col h-full">
    <CardHeader className="pb-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
        <CardTitle className="text-lg font-semibold">
          {list.fieldName}
        </CardTitle>
        <p className="text-sm text-gray-500 sm:mt-1">Liste N°{list._id}</p>
      </div>
    </CardHeader>

    <CardContent className="pb-2">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">Contenu</h4>
          <p className="text-sm break-words">{list.fieldName}</p>
        </div>

        {list.values?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Utilisation
            </h4>
            <div className="flex flex-wrap gap-2">
              {list.values.map((item, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-100 max-w-full truncate"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </CardContent>

    <CardFooter className="pt-2 mt-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2">
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
          <Button
            variant="outline"
            className="text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-600 w-full sm:w-auto flex-1 min-w-0"
            onClick={() => onView(list)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Détails
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto flex-1 min-w-0"
            onClick={() => onEdit(list)}
          >
            Modifier
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto flex-1 min-w-0"
            onClick={() => onDelete(list._id)}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </CardFooter>
  </Card>
);
