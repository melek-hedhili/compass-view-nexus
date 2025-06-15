import React, { useState } from "react";
import { GripVertical, Plus, X, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SousFamille = { id: string; name: string; isEditing?: boolean };
type Famille = { id: string; name: string; sousFamilles: SousFamille[]; isEditing?: boolean };

interface RubriqueData {
  rubriqueName: string;
  familles: Famille[];
  isEditingRubrique?: boolean;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const ArborescenceTreePreview: React.FC = () => {
  const [tree, setTree] = useState<RubriqueData>({
    rubriqueName: "Rubrique exemple",
    familles: [
      {
        id: "f1",
        name: "Famille 1",
        sousFamilles: [
          { id: "sf1", name: "Sous Famille 1-1" },
          { id: "sf2", name: "Sous Famille 1-2" },
        ],
      },
      {
        id: "f2",
        name: "Famille 2",
        sousFamilles: [{ id: "sf3", name: "Sous Famille 2-1" }],
      },
    ],
  });

  // Drag state
  const [familleDrag, setFamilleDrag] = useState<number | null>(null);
  const [sfDrag, setSfDrag] = useState<{ famIdx: number; sfIdx: number } | null>(null);
  const [dragOver, setDragOver] = useState<{ type: 'famille' | 'sf'; idx: number; sfIdx?: number } | null>(null);

  // Edit handlers
  const handleEditRubrique = () => {
    setTree(prev => ({ ...prev, isEditingRubrique: true }));
  };

  const handleSaveRubrique = (newName: string) => {
    setTree(prev => ({ ...prev, rubriqueName: newName, isEditingRubrique: false }));
  };

  const handleEditFamille = (famIdx: number) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, idx) => 
        idx === famIdx ? { ...f, isEditing: true } : f
      )
    }));
  };

  const handleSaveFamille = (famIdx: number, newName: string) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, idx) => 
        idx === famIdx ? { ...f, name: newName, isEditing: false } : f
      )
    }));
  };

  const handleEditSousFamille = (famIdx: number, sfIdx: number) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) => 
        fIdx === famIdx ? {
          ...f,
          sousFamilles: f.sousFamilles.map((sf, sIdx) =>
            sIdx === sfIdx ? { ...sf, isEditing: true } : sf
          )
        } : f
      )
    }));
  };

  const handleSaveSousFamille = (famIdx: number, sfIdx: number, newName: string) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) => 
        fIdx === famIdx ? {
          ...f,
          sousFamilles: f.sousFamilles.map((sf, sIdx) =>
            sIdx === sfIdx ? { ...sf, name: newName, isEditing: false } : sf
          )
        } : f
      )
    }));
  };

  // Add handlers
  const handleAddFamille = () => {
    const newFamille: Famille = {
      id: generateId(),
      name: "Nouvelle Famille",
      sousFamilles: [],
      isEditing: true
    };
    setTree(prev => ({
      ...prev,
      familles: [...prev.familles, newFamille]
    }));
  };

  const handleAddSousFamille = (famIdx: number) => {
    const newSousFamille: SousFamille = {
      id: generateId(),
      name: "Nouvelle Sous-Famille",
      isEditing: true
    };
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, idx) => 
        idx === famIdx ? {
          ...f,
          sousFamilles: [...f.sousFamilles, newSousFamille]
        } : f
      )
    }));
  };

  // Delete handlers
  const handleDeleteSousFamille = (famIdx: number, sfIdx: number) => {
    setTree(prev => ({
      ...prev,
      familles: prev.familles.map((f, fIdx) => 
        fIdx === famIdx ? {
          ...f,
          sousFamilles: f.sousFamilles.filter((_, sIdx) => sIdx !== sfIdx)
        } : f
      )
    }));
  };

  // Drag handlers
  function handleFamilleDragStart(idx: number) { 
    setFamilleDrag(idx);
  }
  
  function handleFamilleDragOver(e: React.DragEvent, idx: number) {
    if (familleDrag !== null && familleDrag !== idx) {
      e.preventDefault();
      setDragOver({ type: 'famille', idx });
    }
  }
  
  function handleFamilleDrop(idx: number) {
    if (familleDrag === null || familleDrag === idx) return;
    setTree((prev) => ({
      ...prev,
      familles: reorder(prev.familles, familleDrag, idx)
    }));
    setFamilleDrag(null);
    setDragOver(null);
  }

  function handleSfDragStart(famIdx: number, sfIdx: number) { 
    setSfDrag({ famIdx, sfIdx });
  }
  
  function handleSfDragOver(e: React.DragEvent, famIdx: number, sfIdx: number) {
    if (!sfDrag || sfDrag.famIdx !== famIdx) return;
    if (sfDrag.sfIdx !== sfIdx) {
      e.preventDefault();
      setDragOver({ type: 'sf', idx: famIdx, sfIdx });
    }
  }
  
  function handleSfDrop(famIdx: number, sfIdx: number) {
    if (!sfDrag || sfDrag.famIdx !== famIdx || sfDrag.sfIdx === sfIdx) return;
    setTree((prev) => {
      const familles = [...prev.familles];
      familles[famIdx] = {
        ...familles[famIdx],
        sousFamilles: reorder(
          familles[famIdx].sousFamilles,
          sfDrag.sfIdx,
          sfIdx
        ),
      };
      return { ...prev, familles };
    });
    setSfDrag(null);
    setDragOver(null);
  }

  function handleDragLeave() {
    setDragOver(null);
  }

  return (
    <div className="min-h-[500px] p-3 sm:p-6">
      <Card className="max-w-5xl mx-auto shadow-lg">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          {/* Rubrique Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
              <div className="w-2 h-8 sm:h-12 bg-formality-primary rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                {tree.isEditingRubrique ? (
                  <Input 
                    defaultValue={tree.rubriqueName}
                    autoFocus
                    onBlur={(e) => handleSaveRubrique(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveRubrique(e.currentTarget.value);
                      }
                    }}
                    className="text-base sm:text-lg font-semibold" 
                  />
                ) : (
                  <div className="text-base sm:text-lg font-semibold cursor-pointer hover:bg-gray-50 p-2 rounded truncate" onClick={handleEditRubrique}>
                    {tree.rubriqueName}
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-formality-primary/10 text-formality-primary border-formality-primary/20 flex-shrink-0"
                onClick={handleEditRubrique}
              >
                <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Rubrique</span>
              </Button>
            </div>
          </div>

          {/* Familles */}
          <div className="space-y-3 sm:space-y-4">
            {tree.familles.map((famille, famIdx) => (
              <div
                key={famille.id}
                className={cn(
                  "group relative transition-all duration-200",
                  dragOver?.type === 'famille' && dragOver.idx === famIdx && "transform translate-y-1"
                )}
                draggable
                onDragStart={() => handleFamilleDragStart(famIdx)}
                onDragOver={(e) => handleFamilleDragOver(e, famIdx)}
                onDrop={() => handleFamilleDrop(famIdx)}
                onDragLeave={handleDragLeave}
              >
                <Card className={cn(
                  "transition-all duration-200 hover:shadow-md cursor-move",
                  dragOver?.type === 'famille' && dragOver.idx === famIdx && "border-formality-primary bg-formality-primary/5"
                )}>
                  <CardContent className="p-3 sm:p-4">
                    {/* Famille Header */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <GripVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 cursor-grab active:cursor-grabbing group-hover:text-formality-primary transition-colors flex-shrink-0" />
                      <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        {famille.isEditing ? (
                          <Input 
                            defaultValue={famille.name}
                            autoFocus
                            onBlur={(e) => handleSaveFamille(famIdx, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveFamille(famIdx, e.currentTarget.value);
                              }
                            }}
                            className="font-medium text-sm sm:text-base" 
                          />
                        ) : (
                          <div 
                            className="font-medium cursor-pointer hover:bg-gray-50 p-2 rounded text-sm sm:text-base truncate"
                            onClick={() => handleEditFamille(famIdx)}
                          >
                            {famille.name}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-blue-50 text-blue-600 border-blue-200 h-6 px-2 sm:h-9 sm:px-3"
                          onClick={() => handleEditFamille(famIdx)}
                        >
                          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Famille</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 sm:h-9 sm:px-3"
                          onClick={() => handleAddSousFamille(famIdx)}
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Sous Familles */}
                    <div className="ml-4 sm:ml-8 space-y-2">
                      {famille.sousFamilles.map((sf, sfIdx) => (
                        <div
                          key={sf.id}
                          className={cn(
                            "group/sf flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-move",
                            dragOver?.type === 'sf' && dragOver.idx === famIdx && dragOver.sfIdx === sfIdx && "bg-green-50 border border-green-200"
                          )}
                          draggable
                          onDragStart={() => handleSfDragStart(famIdx, sfIdx)}
                          onDragOver={(e) => handleSfDragOver(e, famIdx, sfIdx)}
                          onDrop={() => handleSfDrop(famIdx, sfIdx)}
                          onDragLeave={handleDragLeave}
                        >
                          <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300 cursor-grab active:cursor-grabbing group-hover/sf:text-green-500 transition-colors flex-shrink-0" />
                          <div className="w-0.5 sm:w-1 h-4 sm:h-6 bg-green-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            {sf.isEditing ? (
                              <Input 
                                defaultValue={sf.name}
                                autoFocus
                                onBlur={(e) => handleSaveSousFamille(famIdx, sfIdx, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveSousFamille(famIdx, sfIdx, e.currentTarget.value);
                                  }
                                }}
                                className="text-xs sm:text-sm" 
                              />
                            ) : (
                              <div 
                                className="text-xs sm:text-sm cursor-pointer hover:bg-gray-50 p-2 rounded truncate"
                                onClick={() => handleEditSousFamille(famIdx, sfIdx)}
                              >
                                {sf.name}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-green-50 text-green-600 border-green-200 opacity-0 group-hover/sf:opacity-100 transition-opacity h-5 px-1 sm:h-8 sm:px-2"
                              onClick={() => handleEditSousFamille(famIdx, sfIdx)}
                            >
                              <Edit3 className="h-2 w-2 sm:h-3 sm:w-3 sm:mr-1" />
                              <span className="hidden sm:inline text-xs">Sous Famille</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="opacity-0 group-hover/sf:opacity-100 transition-opacity text-red-500 hover:text-red-700 h-5 px-1 sm:h-8 sm:px-2"
                              onClick={() => handleDeleteSousFamille(famIdx, sfIdx)}
                            >
                              <X className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Sous Famille Button */}
                      <div 
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 cursor-pointer group/add"
                        onClick={() => handleAddSousFamille(famIdx)}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover/add:text-green-500 transition-colors flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-500 group-hover/add:text-green-600 transition-colors">Ajouter une sous-famille</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Add Famille Button */}
            <Card 
              className="border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group/add-famille"
              onClick={handleAddFamille}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover/add-famille:text-blue-500 transition-colors" />
                  <span className="text-sm sm:text-base text-gray-500 group-hover/add-famille:text-blue-600 transition-colors font-medium">Ajouter une famille</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
            <Button className="bg-formality-primary hover:bg-formality-primary/90 text-white px-4 sm:px-6 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Sauvegarder l'arborescence
            </Button>
            <Button variant="outline" className="px-4 sm:px-6 w-full sm:w-auto">
              Aperçu
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Info Text */}
      <div className="text-center text-gray-500 mt-4 sm:mt-6 max-w-2xl mx-auto px-4">
        <p className="text-xs sm:text-sm">
          Cliquez sur les noms pour les éditer, utilisez les boutons "+" pour ajouter des éléments et glissez-déposez pour réorganiser.
        </p>
      </div>
    </div>
  );
};

export default ArborescenceTreePreview;
