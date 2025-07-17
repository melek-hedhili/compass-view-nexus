import { useState } from "react";
import OcrLaunchCard from "./components/OcrLaunchCard";
import DocumentsTable from "./components/DocumentsTable";
import DragAndDropZone from "./components/DragAndDropZone";
import RequiredDocumentsTable from "./components/RequiredDocumentsTable";
import DocumentViewer from "./components/DocumentViewer";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AttachementService, DocumentDto, FileService } from "@/api-swagger";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

interface Document {
  id: string;
  nom: string;
  type: string;
  ocr: boolean;
  ai: boolean;
  checked: boolean;
  imageUrl: string;
}

interface RequiredDocument {
  id: string;
  nom: string;
  checked: boolean;
  linkedDocumentId?: string;
}

const DocumentsSection = () => {
  const { dossierId } = useParams();
  console.log("dossierId", dossierId);
  const methoods = useForm<{
    documentType: string;
  }>({
    defaultValues: {
      documentType: "",
    },
  });
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      nom: "Carte vitale N°1",
      type: "Carte vitale",
      ocr: true,
      ai: false,
      checked: true,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-19%20at%2010.07.34%E2%80%AFAM-9emI1785vebni1SNIcikFmGnH66HsR.png",
    },
    {
      id: "2",
      nom: "Statut constitutif",
      type: "Sélectionner",
      ocr: false,
      ai: false,
      checked: false,
      imageUrl: "/placeholder.svg?height=400&width=300",
    },
  ]);

  const [requiredDocuments, setRequiredDocuments] = useState<
    RequiredDocument[]
  >([
    { id: "1", nom: "Statut", checked: false, linkedDocumentId: "2" },
    { id: "2", nom: "Papier d'identité", checked: false },
    { id: "3", nom: "Attestation de domiciliation", checked: false },
    { id: "4", nom: "Nomination gérant", checked: false },
    { id: "5", nom: "Carte vitale", checked: true, linkedDocumentId: "1" },
    { id: "6", nom: "Annonce légale", checked: false },
    { id: "7", nom: "Justificatif de domicile", checked: false },
    { id: "8", nom: "Dépôt de capital", checked: false },
  ]);

  const attachmentsQuery = useQuery({
    queryKey: ["attachments", dossierId],
    queryFn: () =>
      AttachementService.attachementControllerFindFileAttachements({
        id: dossierId,
      }),
  });
  const fileDocuments = useQuery({
    queryKey: ["file-documents", dossierId],
    queryFn: () =>
      FileService.fileControllerGetFileDocuments({
        id: dossierId,
      }),
  });
  const [selectedDocument, setSelectedDocument] = useState<DocumentDto | null>(
    null
  );
  const [documentToRead, setDocumentToRead] = useState(0);

  // Fonction pour gérer la sélection de document
  const handleDocumentSelection = (doc: DocumentDto) => {
    setSelectedDocument(doc);
  };

  // Fonction pour gérer le changement de type de document
  const handleDocumentTypeChange = (docId: string, newType: string) => {
    // Mettre à jour le type du document
    const updatedDocs = documents.map((doc) =>
      doc.id === docId ? { ...doc, type: newType } : doc
    );

    // Mettre à jour les documents requis si nécessaire
    const updatedRequiredDocs = [...requiredDocuments];

    // Trouver le document requis correspondant au type sélectionné
    const requiredDocIndex = updatedRequiredDocs.findIndex(
      (reqDoc) => reqDoc.nom.toLowerCase() === newType.toLowerCase()
    );

    if (requiredDocIndex !== -1) {
      // Mettre à jour le document requis pour le lier au document actuel
      updatedRequiredDocs[requiredDocIndex] = {
        ...updatedRequiredDocs[requiredDocIndex],
        checked: true,
        linkedDocumentId: docId,
      };

      // Mettre à jour les états
      setRequiredDocuments(updatedRequiredDocs);
    }

    setDocuments(updatedDocs);
  };

  // Fonction pour lancer l'OCR
  const handleLaunchOCR = () => {
    setDocumentToRead((prevCount) => prevCount + 1);
    setTimeout(() => {
      setDocumentToRead(0);
      // Simuler le traitement OCR sur le document sélectionné
      if (selectedDocument) {
        const updatedDocs = documents.map((doc) =>
          doc.id === selectedDocument._id ? { ...doc, ocr: true } : doc
        );
        setDocuments(updatedDocs);
      }
    }, 2000);
  };

  // Fonction pour valider un document
  const handleValidateDocument = (docId: string) => {
    const updatedDocs = documents.map((doc) =>
      doc.id === docId ? { ...doc, checked: true } : doc
    );
    setDocuments(updatedDocs);

    // Mettre à jour le document requis correspondant
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      const updatedRequiredDocs = requiredDocuments.map((reqDoc) => {
        if (reqDoc.nom.toLowerCase() === doc.type.toLowerCase()) {
          return { ...reqDoc, checked: true, linkedDocumentId: docId };
        }
        return reqDoc;
      });
      setRequiredDocuments(updatedRequiredDocs);
    }
  };

  return (
    <Form methods={methoods}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Lecture OCR Section */}
          <OcrLaunchCard
            documentToRead={documentToRead}
            handleLaunchOCR={handleLaunchOCR}
          />

          {/* Liste des documents */}
          <DocumentsTable
            attachments={attachmentsQuery.data}
            filesDocuments={fileDocuments.data}
            selectedDocument={selectedDocument}
            handleDocumentSelection={handleDocumentSelection}
            handleDocumentTypeChange={handleDocumentTypeChange}
          />

          {/* Zone de drag & drop */}
          <DragAndDropZone />

          {/* Documents nécessaires pour le dossier */}
          <RequiredDocumentsTable
            loading={fileDocuments.isLoading}
            documents={fileDocuments.data}
          />
        </div>

        {/* Document Viewer */}
        <div>
          <DocumentViewer
            selectedDocument={selectedDocument}
            handleLaunchOCR={handleLaunchOCR}
            handleValidateDocument={handleValidateDocument}
          />
        </div>
      </div>
    </Form>
  );
};

export default DocumentsSection;
