
import React, { useState } from "react";
import AppLayout from "../../../../../components/layout/AppLayout";
import { NavTabs } from "../../../../../components/dashboard/NavTabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ArborescenceTreePreview from "./ArborescenceTreePreview";
import { ArborescenceList } from "./ArborescenceList";
import { ArborescenceData } from "./ArborescenceCard";

type ViewMode = 'list' | 'create' | 'edit' | 'details';

const Contracts = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedArborescence, setSelectedArborescence] = useState<ArborescenceData | null>(null);

  const handleSelectArborescence = (arborescence: ArborescenceData) => {
    setSelectedArborescence(arborescence);
    setViewMode('details');
  };

  const handleCreateNew = () => {
    setSelectedArborescence(null);
    setViewMode('create');
  };

  const handleEditArborescence = (arborescence: ArborescenceData) => {
    setSelectedArborescence(arborescence);
    setViewMode('edit');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedArborescence(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <ArborescenceList
            onSelectArborescence={handleSelectArborescence}
            onCreateNew={handleCreateNew}
            onEditArborescence={handleEditArborescence}
          />
        );
      case 'create':
      case 'edit':
      case 'details':
        return (
          <div>
            {/* Header with back button */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToList}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux arborescences
              </Button>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {viewMode === 'create' && "Création d'une nouvelle arborescence"}
                {viewMode === 'edit' && `Modification de ${selectedArborescence?.name}`}
                {viewMode === 'details' && `Détails de ${selectedArborescence?.name}`}
              </h2>
            </div>
            
            <ArborescenceTreePreview />
            
            {viewMode !== 'details' && (
              <div className="text-center text-gray-500 mt-8">
                <span>
                  {viewMode === 'create' 
                    ? "Créez votre arborescence en ajoutant des rubriques, familles et sous-familles. Utilisez le glisser-déposer pour organiser la structure."
                    : "Modifiez votre arborescence : ajoutez, supprimez ou réorganisez les éléments selon vos besoins."
                  }
                </span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <NavTabs />
      <div className="mb-8">
        {renderContent()}
      </div>
    </AppLayout>
  );
};

export default Contracts;
