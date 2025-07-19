import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUpload from "./FileUpload";

interface DocumentFileProps {
  fileName: string;
  url: string;
  expiresIn: number;
  mimetype: string;
}

import type { AttachementDto } from "@/api-swagger";

interface DocumentViewerProps {
  selectedDocument: AttachementDto | null;
  handleLaunchOCR: () => void;
  handleValidateDocument: (docId: string) => void;
  onUpdateAttachment: () => void;
  loading?: boolean;
}

const TABS = [
  { key: "document", label: "Document" },
  { key: "ocr", label: "OCR" },
];

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  selectedDocument,
  handleLaunchOCR,
  handleValidateDocument,
}) => {
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
                handleValidateDocument(selectedDocument._id || "");
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
                src={selectedDocument.originalFile?.url || "/placeholder.svg"}
                alt={selectedDocument.originalFile?.fileName || "Document"}
                className="border rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </Card>

      {/* File Upload Component */}
      <FileUpload
        name="uploadedFiles"
        maxFiles={2}
        maxSizePerFile={4}
        acceptedTypes={["image/*", "application/pdf"]}
        onUpload={async (files, onProgress) => {          
          try {
            // Use the actual AttachementService with real progress tracking
            const { AttachementService } = await import("@/api-swagger");
            
            // Call the real API with progress tracking
            await AttachementService.attachementControllerUploadMultipleFiles({
              formData: {
                fileId: selectedDocument?._id || '',
                files,
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                  // For each file, update progress (simplified approach)
                  files.forEach((file, index) => {
                    const fileId = file.name + index; // Use filename + index as ID
                    onProgress(fileId, progress);
                  });
                }
              }
            });
            
            console.log('Upload completed successfully');
          } catch (error) {
            console.error('Upload failed:', error);
            throw error;
          }
        }}
      />
    </div>
  );
};

export default DocumentViewer;
