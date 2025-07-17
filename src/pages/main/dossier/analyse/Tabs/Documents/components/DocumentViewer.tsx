
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import FileUpload from "./FileUpload";

interface DocumentFileProps {
  fileName: string;
  url: string;
  expiresIn: number;
  mimetype: string;
}

interface DocumentViewerProps {
  selectedDocument: DocumentFileProps | null;
  handleLaunchOCR: () => void;
  handleValidateDocument: (docId: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  selectedDocument,
  handleLaunchOCR,
  handleValidateDocument,
}) => {
  const { control } = useFormContext();

  const handleFilesUploaded = (files: File[]) => {
    console.log("Files uploaded:", files);
    // Handle uploaded files here - you can process them or send to API
  };

  return (
    <div className="space-y-6">
      {/* Document Actions */}
      <Card className="border rounded-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-blue-100">
              Document
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedDocument) {
                  handleLaunchOCR();
                }
              }}
            >
              OCR
            </Button>
          </div>
          <Button
            size="sm"
            onClick={() => {
              if (selectedDocument) {
                handleValidateDocument(selectedDocument.id);
              }
            }}
          >
            Valider
          </Button>
        </div>
        <div className="p-4 flex justify-center">
          {selectedDocument && (
            <div className="max-w-md">
              <img
                src={selectedDocument.imageUrl || "/placeholder.svg"}
                alt={selectedDocument.nom}
                className="border rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </Card>

      {/* File Upload Component */}
      <FileUpload
        name="uploadedFiles"
        control={control}
        maxFiles={2}
        maxSizePerFile={4}
        acceptedTypes={["image/*", "application/pdf"]}
        onFilesUploaded={handleFilesUploaded}
      />
    </div>
  );
};

export default DocumentViewer;
