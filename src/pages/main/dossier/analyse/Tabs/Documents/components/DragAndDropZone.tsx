import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";
import React from "react";

const DragAndDropZone: React.FC = () => (
  <Card className="border rounded-lg overflow-hidden">
    <div className="p-8 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-gray-500">
      <Upload className="h-8 w-8 mb-2" />
      <p className="text-sm">Zone de drag & drop des fichiers</p>
    </div>
  </Card>
);

export default DragAndDropZone;
