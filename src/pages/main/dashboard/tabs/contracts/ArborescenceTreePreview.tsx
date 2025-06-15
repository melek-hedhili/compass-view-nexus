
import React, { useState } from "react";
import { Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  // Famille drag
  function handleFamilleDragStart(idx: number) { setFamilleDrag(idx);}
  function handleFamilleDrop(idx: number) {
    if (familleDrag === null || familleDrag === idx) return;
    setTree((prev) => ({
      ...prev,
      familles: reorder(prev.familles, familleDrag, idx)
    }));
    setFamilleDrag(null);
  }

  // Sous Famille drag
  function handleSfDragStart(famIdx: number, sfIdx: number) { setSfDrag({ famIdx, sfIdx });}
  function handleSfDrop(famIdx: number, sfIdx: number) {
    if (!sfDrag) return;
    // Only within same family
    if (sfDrag.famIdx !== famIdx) return;
    if (sfDrag.sfIdx === sfIdx) return;
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
  }

  return (
    <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-3xl transition animate-fade-in">
        <div className="flex gap-3 items-end mb-6">
          <Input value={tree.rubriqueName} readOnly className="flex-1" />
          <Button variant="outline" className="w-36">Rubrique</Button>
        </div>
        {tree.familles.map((famille, famIdx) => (
          <div
            key={famille.id}
            className="mb-3 flex gap-3 items-start group"
            draggable
            onDragStart={() => handleFamilleDragStart(famIdx)}
            onDragOver={(e) => { if (familleDrag !== null) e.preventDefault(); }}
            onDrop={() => handleFamilleDrop(famIdx)}
            style={{ background: familleDrag === famIdx ? "#f3f4f6" : undefined }}
          >
            <div className="flex flex-col gap-2 flex-1">
              <Input defaultValue={famille.name} readOnly className="w-full" />
              {/* Sous familles */}
              {famille.sousFamilles.map((sf, sfIdx) => (
                <div
                  key={sf.id}
                  className="flex gap-2 items-center ml-6"
                  draggable
                  onDragStart={() => handleSfDragStart(famIdx, sfIdx)}
                  onDragOver={(e) => { if (sfDrag) e.preventDefault(); }}
                  onDrop={() => handleSfDrop(famIdx, sfIdx)}
                  style={{
                    background:
                      sfDrag &&
                      sfDrag.famIdx === famIdx &&
                      sfDrag.sfIdx === sfIdx
                        ? "#e5e7eb"
                        : undefined,
                  }}
                >
                  <Move className="h-4 w-4 text-gray-400 cursor-move" />
                  <Input defaultValue={sf.name} readOnly className="w-full" />
                  <Button variant="outline" className="w-32">Sous Famille</Button>
                </div>
              ))}
            </div>
            {/* Famille controls */}
            <div className="flex flex-col gap-1 min-w-[130px]">
              <Button variant="outline" className="w-full">Famille</Button>
            </div>
            <Move className="h-5 w-5 text-gray-400 cursor-move group-hover:text-formality-primary transition" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <Button variant="default">Ajouter une famille</Button>
        <Button variant="outline">Ajouter une sous-famille</Button>
      </div>
    </div>
  );
};

export default ArborescenceTreePreview;
