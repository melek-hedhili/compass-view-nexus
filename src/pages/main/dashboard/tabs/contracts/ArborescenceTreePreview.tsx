
import React, { useState } from "react";
import { GripVertical, Plus, X, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SousFamille = { id: string; name: string };
type Famille = { id: string; name: string; sousFamilles: SousFamille[] };

interface RubriqueData {
  rubriqueName: string;
  familles: Famille[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
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

  // Famille drag handlers
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

  // Sous Famille drag handlers
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
    <div className="min-h-[500px] p-6">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardContent className="p-8">
          {/* Rubrique Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-2 h-12 bg-formality-primary rounded-full"></div>
              <div className="flex-1">
                <Input 
                  value={tree.rubriqueName} 
                  readOnly 
                  className="text-lg font-semibold border-none bg-transparent p-0 focus:ring-0" 
                />
              </div>
              <Button variant="outline" size="sm" className="bg-formality-primary/10 text-formality-primary border-formality-primary/20">
                <Edit3 className="h-4 w-4 mr-2" />
                Rubrique
              </Button>
            </div>
          </div>

          {/* Familles */}
          <div className="space-y-4">
            {tree.familles.map((famille, famIdx) => (
              <div
                key={famille.id}
                className={cn(
                  "group relative transition-all duration-200",
                  familleDrag === famIdx && "opacity-50 scale-95",
                  dragOver?.type === 'famille' && dragOver.idx === famIdx && "transform translate-y-1"
                )}
                draggable
                onDragStart={() => handleFamilleDragStart(famIdx)}
                onDragOver={(e) => handleFamilleDragOver(e, famIdx)}
                onDrop={() => handleFamilleDrop(famIdx)}
                onDragLeave={handleDragLeave}
              >
                <Card className={cn(
                  "transition-all duration-200 hover:shadow-md",
                  dragOver?.type === 'famille' && dragOver.idx === famIdx && "border-formality-primary bg-formality-primary/5"
                )}>
                  <CardContent className="p-4">
                    {/* Famille Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-grab active:cursor-grabbing group-hover:text-formality-primary transition-colors" />
                      <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                      <Input 
                        defaultValue={famille.name} 
                        readOnly 
                        className="flex-1 font-medium border-none bg-transparent p-0 focus:ring-0" 
                      />
                      <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Famille
                      </Button>
                      <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sous Familles */}
                    <div className="ml-8 space-y-2">
                      {famille.sousFamilles.map((sf, sfIdx) => (
                        <div
                          key={sf.id}
                          className={cn(
                            "group/sf flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50",
                            sfDrag && sfDrag.famIdx === famIdx && sfDrag.sfIdx === sfIdx && "opacity-50 scale-95",
                            dragOver?.type === 'sf' && dragOver.idx === famIdx && dragOver.sfIdx === sfIdx && "bg-green-50 border border-green-200"
                          )}
                          draggable
                          onDragStart={() => handleSfDragStart(famIdx, sfIdx)}
                          onDragOver={(e) => handleSfDragOver(e, famIdx, sfIdx)}
                          onDrop={() => handleSfDrop(famIdx, sfIdx)}
                          onDragLeave={handleDragLeave}
                        >
                          <GripVertical className="h-4 w-4 text-gray-300 cursor-grab active:cursor-grabbing group-hover/sf:text-green-500 transition-colors" />
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          <Input 
                            defaultValue={sf.name} 
                            readOnly 
                            className="flex-1 border-none bg-transparent p-0 focus:ring-0 text-sm" 
                          />
                          <Button variant="outline" size="sm" className="bg-green-50 text-green-600 border-green-200 opacity-0 group-hover/sf:opacity-100 transition-opacity">
                            <Edit3 className="h-3 w-3 mr-2" />
                            Sous Famille
                          </Button>
                          <Button variant="outline" size="sm" className="opacity-0 group-hover/sf:opacity-100 transition-opacity text-red-500 hover:text-red-700">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      
                      {/* Add Sous Famille Button */}
                      <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 cursor-pointer group/add">
                        <Plus className="h-4 w-4 text-gray-400 group-hover/add:text-green-500 transition-colors" />
                        <span className="text-sm text-gray-500 group-hover/add:text-green-600 transition-colors">Ajouter une sous-famille</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Add Famille Button */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group/add-famille">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3">
                  <Plus className="h-5 w-5 text-gray-400 group-hover/add-famille:text-blue-500 transition-colors" />
                  <span className="text-gray-500 group-hover/add-famille:text-blue-600 transition-colors font-medium">Ajouter une famille</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
            <Button className="bg-formality-primary hover:bg-formality-primary/90 text-white px-6">
              <Plus className="h-4 w-4 mr-2" />
              Sauvegarder l'arborescence
            </Button>
            <Button variant="outline" className="px-6">
              Aperçu
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Info Text */}
      <div className="text-center text-gray-500 mt-6 max-w-2xl mx-auto">
        <p className="text-sm">
          Glissez-déposez les familles et sous-familles pour les réorganiser. 
          Utilisez les boutons d'édition pour modifier les noms et les boutons "+" pour ajouter de nouveaux éléments.
        </p>
      </div>
    </div>
  );
};

export default ArborescenceTreePreview;
