import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";

interface OcrLaunchCardProps {
  documentToRead: number;
  handleLaunchOCR: () => void;
}

const OcrLaunchCard: React.FC<OcrLaunchCardProps> = ({
  documentToRead,
  handleLaunchOCR,
}) => (
  <Card className="border rounded-lg overflow-hidden">
    <div className="p-4 border-b bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Lecture OCR</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {documentToRead} document à lire
          </span>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleLaunchOCR}
          >
            Lancer OCR
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

export default OcrLaunchCard;
