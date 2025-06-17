import React from "react";
import { cn } from "@/lib/utils";
import { RubriqueData } from "../types";
import { ChevronRight, ChevronDown } from "lucide-react";

interface ArborescenceListProps {
  tree: RubriqueData;
  className?: string;
}

export const ArborescenceList: React.FC<ArborescenceListProps> = ({
  tree,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Rubrique */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
        <div className="w-4 h-4 flex items-center justify-center">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
        <span className="font-medium text-gray-900">{tree.rubriqueName}</span>
      </div>

      {/* Familles */}
      <div className="ml-6 space-y-2">
        {tree.familles.map((famille) => (
          <div key={famille.id} className="space-y-2">
            {/* Famille */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <div className="w-4 h-4 flex items-center justify-center">
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </div>
              <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
              <span className="font-medium text-gray-800">{famille.name}</span>
            </div>

            {/* Sous Familles */}
            {famille.sousFamilles.length > 0 && (
              <div className="ml-6 space-y-1">
                {famille.sousFamilles.map((sousFamille) => (
                  <div
                    key={sousFamille.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                  >
                    <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      {sousFamille.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArborescenceList;
