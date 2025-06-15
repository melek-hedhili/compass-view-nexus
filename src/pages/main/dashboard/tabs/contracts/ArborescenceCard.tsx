
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trees, Edit3, Folder, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArborescenceData {
  id: string;
  name: string;
  description?: string;
  famillesCount: number;
  sousFamillesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ArborescenceCardProps {
  arborescence: ArborescenceData;
  onSelect: (arborescence: ArborescenceData) => void;
  onEdit: (arborescence: ArborescenceData) => void;
}

export const ArborescenceCard: React.FC<ArborescenceCardProps> = ({
  arborescence,
  onSelect,
  onEdit,
}) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200 hover:border-formality-primary/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 sm:mb-4 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-formality-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Trees className="h-4 w-4 sm:h-5 sm:w-5 text-formality-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-formality-primary transition-colors text-sm sm:text-base truncate">
                {arborescence.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                {arborescence.description || "Aucune description"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(arborescence);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity self-start flex-shrink-0"
          >
            <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-1">Éditer</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <Folder className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{arborescence.famillesCount} familles</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span>{arborescence.sousFamillesCount} sous-familles</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs text-gray-400 order-2 sm:order-1">
            Modifié le {new Date(arborescence.updatedAt).toLocaleDateString()}
          </div>
          <Button
            size="sm"
            onClick={() => onSelect(arborescence)}
            className="bg-formality-primary hover:bg-formality-primary/90 order-1 sm:order-2 text-xs sm:text-sm"
          >
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
