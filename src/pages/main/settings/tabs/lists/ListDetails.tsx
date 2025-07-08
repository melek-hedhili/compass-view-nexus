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
import LoadingSpinner from "@/components/LoadingSpinner";
import { List, Hash, Calendar } from "lucide-react";

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
  const { data: selectedList, isLoading } = useQuery({
    queryKey: ["list", selectedListId, isOpen],
    queryFn: () => ListService.listControllerFindOne({ id: selectedListId }),
    enabled: !!selectedListId && isOpen,
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader className="p-6 pb-4 border-b border-gray-100">
          <SheetTitle className="text-2xl font-bold text-formality-accent">
            Détails de la liste
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Informations détaillées de la liste
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        ) : selectedList ? (
          <div className="p-6 space-y-8">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100 mb-2 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl flex items-center justify-center">
                <List className="h-6 w-6 text-yellow-700" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedList.fieldName || "-"}
                </h3>
              </div>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <List className="h-4 w-4 text-formality-primary" />
                    <Label className="text-sm font-semibold text-gray-700">
                      Valeurs
                    </Label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedList.values && selectedList.values.length > 0 ? (
                      selectedList.values.map((value, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-100 text-gray-700 text-sm font-normal"
                        >
                          {value || "-"}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
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
                  {selectedList.created_at
                    ? new Date(selectedList.created_at).toLocaleString()
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
                  {selectedList.updated_at
                    ? new Date(selectedList.updated_at).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-formality-primary" />
                  <Label className="text-sm font-semibold text-gray-700">
                    ID
                  </Label>
                </div>
                <p className="text-xs text-gray-400">
                  {selectedList._id || "-"}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
