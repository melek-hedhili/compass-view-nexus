
import React from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { ListService } from "@/api-swagger/services/ListService";

interface ListDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedListId: string | null;
}

export const ListDetails: React.FC<ListDetailsProps> = ({
  isOpen,
  onClose,
  selectedListId,
}) => {
  const { data: selectedList } = useQuery({
    queryKey: ["list", selectedListId],
    queryFn: () => ListService.listControllerFindOne({ id: selectedListId }),
    enabled: !!selectedListId,
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Détails de la liste</SheetTitle>
          <SheetDescription>
            Informations détaillées de la liste
          </SheetDescription>
        </SheetHeader>

        {selectedList && (
          <div className="space-y-6 py-6">
            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Nom du champ
              </Label>
              <p className="text-lg font-semibold">{selectedList.fieldName}</p>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Valeurs
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedList.values?.map((value, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                ID
              </Label>
              <p className="text-sm text-gray-600">{selectedList._id}</p>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Date de création
              </Label>
              <p className="text-sm text-gray-600">
                {new Date(selectedList.created_at || "").toLocaleString()}
              </p>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-500 mb-1">
                Dernière mise à jour
              </Label>
              <p className="text-sm text-gray-600">
                {new Date(selectedList.updated_at || "").toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
