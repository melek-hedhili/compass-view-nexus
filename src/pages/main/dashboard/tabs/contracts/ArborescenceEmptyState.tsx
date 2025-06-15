
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, TreePine } from "lucide-react";

interface ArborescenceEmptyStateProps {
  onCreateNew: () => void;
}

export const ArborescenceEmptyState: React.FC<ArborescenceEmptyStateProps> = ({
  onCreateNew,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <TreePine className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Aucune arborescence trouvée
      </h3>
      <p className="text-gray-500 text-center mb-8 max-w-md">
        Commencez par créer votre première arborescence pour organiser vos rubriques, familles et sous-familles.
      </p>
      <Button
        onClick={onCreateNew}
        className="bg-formality-primary hover:bg-formality-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        Créer une arborescence
      </Button>
    </div>
  );
};
