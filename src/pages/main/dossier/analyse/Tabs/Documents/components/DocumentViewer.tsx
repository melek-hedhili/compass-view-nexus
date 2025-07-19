import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type AttachementDto } from "@/api-swagger";

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
  onUpdateAttachment,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState<"document" | "ocr">("document");
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Get the correct file object based on the selected tab
  const fileObj =
    activeTab === "document"
      ? selectedDocument?.originalFile
      : selectedDocument?.ocrFile;

  // Helper to render file preview (image or PDF)
  const renderFilePreview = (file?: {
    url: string;
    fileName: string;
    mimetype: string;
  }) => {
    if (!file)
      return <div className="text-gray-400">Aucun fichier à afficher</div>;
    if (file.mimetype.startsWith("image/")) {
      return (
        <img
          src={file.url}
          alt={file.fileName}
          className="border rounded-lg shadow-sm max-h-96"
        />
      );
    }
    if (file.mimetype === "application/pdf") {
      return (
        <div className="w-full flex flex-col items-center justify-center">
          <object
            data={file.url}
            type="application/pdf"
            className="w-full max-w-2xl h-[600px] border rounded shadow"
            onError={() => setPdfError("Échec du chargement du fichier PDF.")}
          >
            {/* Fallback for browsers that don't support object */}
            <div className="text-gray-400 text-center">
              Aperçu PDF non supporté par votre navigateur.
            </div>
          </object>
          {pdfError && (
            <div className="flex flex-col items-center justify-center mt-4">
              <span className="text-red-500 text-center">{pdfError}</span>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  window.open(file.url, "_blank");
                }}
              >
                Télécharger
              </Button>
            </div>
          )}
        </div>
      );
    }
    return (
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Télécharger {file.fileName}
      </a>
    );
  };

  return (
    <Card className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-gray-50">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              size="sm"
              className={activeTab === tab.key ? "bg-blue-100" : ""}
              onClick={() => {
                setActiveTab(tab.key as "document" | "ocr");
                if (tab.key === "ocr" && selectedDocument) {
                  //handleLaunchOCR();
                }
              }}
              disabled={!selectedDocument}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          onClick={() => {
            onUpdateAttachment();
          }}
          loading={loading}
          disabled={!selectedDocument}
        >
          Valider
        </Button>
      </div>
      <div className="p-4 flex justify-center">
        <div className="max-w-md w-full flex justify-center">
          {selectedDocument ? (
            renderFilePreview(fileObj)
          ) : (
            <div className="text-gray-400 text-center w-full">
              Aucun document selectionné
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DocumentViewer;
