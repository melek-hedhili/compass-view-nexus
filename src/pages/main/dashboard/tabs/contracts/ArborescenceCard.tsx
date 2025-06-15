
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tree, Edit3, Folder, Users } from "lucide-react";
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
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-formality-primary/10 rounded-lg flex items-center justify-center">
              <Tree className="h-5 w-5 text-formality-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-formality-primary transition-colors">
                {arborescence.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
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
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Folder className="h-4 w-4" />
            <span>{arborescence.famillesCount} familles</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{arborescence.sousFamillesCount} sous-familles</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Modifié le {new Date(arborescence.updatedAt).toLocaleDateString()}
          </div>
          <Button
            size="sm"
            onClick={() => onSelect(arborescence)}
            className="bg-formality-primary hover:bg-formality-primary/90"
          >
            Voir détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
