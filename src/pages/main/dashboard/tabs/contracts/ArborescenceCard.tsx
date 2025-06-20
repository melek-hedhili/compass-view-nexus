import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { RubriqueData } from "./types";

export interface ArborescenceData {
  id: string;
  name: string;
  description?: string;
  famillesCount: number;
  sousFamillesCount: number;
  createdAt: string;
  updatedAt: string;
  tree: RubriqueData;
}

interface ArborescenceCardProps {
  arborescence: ArborescenceData;
  onSelect: (arborescence: ArborescenceData) => void;
}

export const ArborescenceCard: React.FC<ArborescenceCardProps> = ({
  arborescence,
}) => (
  <div className="group border-b border-gray-200 last:border-b-0 py-4 hover:bg-gray-50/50 transition-all duration-200 flex flex-col items-center">
    {/* Header */}
    <div className="flex items-center justify-between mb-4 w-full max-w-2xl">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-formality-primary transition-colors">
          {arborescence.name}
        </h3>
      </div>
      <div className="text-xs text-gray-400">
        Modifié le {new Date(arborescence.updatedAt).toLocaleDateString()}
      </div>
    </div>

    {/* Tree Preview */}
    <div className="space-y-2 w-full max-w-2xl">
      {/* Rubrique */}
      <div className="flex items-center gap-2 p-2 rounded-lg">
        <div className="w-4 h-4 flex items-center justify-center">
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        <div className="w-1 h-4 bg-blue-500 rounded-full" />
        <span className="font-medium text-gray-900">
          {arborescence.tree.rubriqueName}
        </span>
      </div>

      {/* Familles */}
      <div className="ml-6 space-y-2">
        {arborescence.tree.familles.map((famille) => (
          <div key={famille.id} className="space-y-2">
            {/* Famille */}
            <div className="flex items-center gap-2 p-2 rounded-lg">
              <div className="w-4 h-4 flex items-center justify-center">
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </div>
              <div className="w-1 h-4 bg-blue-400 rounded-full" />
              <span className="font-medium text-gray-800">{famille.name}</span>
            </div>

            {/* Sous Familles */}
            {famille.sousFamilles.length > 0 && (
              <div className="ml-6 space-y-1">
                {famille.sousFamilles.map((sousFamille) => (
                  <div
                    key={sousFamille.id}
                    className="flex items-center gap-2 p-2 rounded-lg"
                  >
                    <div className="w-1 h-4 bg-green-500 rounded-full" />
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
  </div>
);
