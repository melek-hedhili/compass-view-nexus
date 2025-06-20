import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentDto } from "@/api-swagger";

interface DocumentCardProps {
  doc: DocumentDto;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  onEdit,
  onDelete,
  deleteLoading,
}) => (
  <Card className="p-6 border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between min-h-[360px]">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-lg font-semibold">{doc.documentName}</h2>
        <p className="text-sm text-gray-500">Raccourci: {doc.shortName}</p>
      </div>
    </div>

    <div className="mt-4">
      <p className="text-sm font-medium mb-1">Formes juridiques:</p>
      <div className="flex flex-wrap gap-1 mt-1">
        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
          {doc.legalForm}
        </span>
      </div>
    </div>

    <div className="mt-3">
      <p className="text-sm font-medium mb-1">Prestations:</p>
      <div className="flex flex-wrap gap-1 mt-1">
        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
          {doc.benefit}
        </span>
      </div>
    </div>

    <div className="mt-3">
      <p className="text-sm font-medium mb-1">Utilisation:</p>
      <div className="flex flex-wrap gap-1 mt-1">
        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
          {doc.type}
        </span>
      </div>
    </div>

    <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-2 justify-end items-stretch sm:items-center">
      <Button
        className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
        onClick={() => onEdit(doc._id)}
      >
        Modifier
      </Button>
      <Button
        className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
        onClick={() => onDelete(doc._id)}
        disabled={deleteLoading}
      >
        Supprimer
      </Button>
    </div>
  </Card>
);
