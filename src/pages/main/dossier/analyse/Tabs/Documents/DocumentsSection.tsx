import { useState, useMemo } from "react";
import OcrLaunchCard from "./components/OcrLaunchCard";
import DocumentsTable from "./components/DocumentsTable";
import DragAndDropZone from "./components/DragAndDropZone";
import RequiredDocumentsTable from "./components/RequiredDocumentsTable";
import DocumentViewer from "./components/DocumentViewer";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AttachementService,
  DocumentDto,
  FileService,
  UpdateAttachementDto,
} from "@/api-swagger";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  const { dossierId } = useParams();
  console.log("dossierId", dossierId);

  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });

  const attachmentsQuery = useQuery({
    queryKey: [
      "attachments",
      dossierId,
      paginationParams.page,
      paginationParams.perPage,
    ],
    queryFn: () =>
      AttachementService.attachementControllerFindFileAttachements({
        id: dossierId,
        page: paginationParams.page.toString(),
        perPage: paginationParams.perPage.toString(),
      }),
  });

  const attachmentsData = attachmentsQuery.data?.data ?? [];

  const defaultValues = useMemo(
    () => ({
      uploadDocuments: [],
      ...attachmentsData.reduce((acc, row) => {
        acc[`documentType_${row._id}`] = row.document ? row.document._id : "";
        return acc;
      }, {}),
    }),
    [attachmentsData]
  );

  const methoods = useForm({
    defaultValues,
  });
  console.log("methoods", methoods.watch());
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

  const fileDocuments = useQuery({
    queryKey: ["file-documents", dossierId],
    queryFn: () =>
      FileService.fileControllerGetFileDocuments({
        id: dossierId,
      }),
  });
  const uploadAttachementFiles = useMutation({
    mutationFn: ({ files, onProgress }: { files: File[], onProgress?: (fileId: string, progress: number) => void }) =>
      AttachementService.attachementControllerUploadMultipleFiles({
        formData: {
          fileId: dossierId,
          files,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            // For multiple files, we'll use the first file's ID as a simplification
            // In a real implementation, you might want to track individual file progress
            files.forEach((_, index) => {
              onProgress(`upload-${index}`, progress);
            });
          }
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "attachments",
          dossierId,
          paginationParams.page,
          paginationParams.perPage,
        ],
      });
    },
  });
  const startOCRMutation = useMutation({
    mutationFn: (id: string) =>
      AttachementService.attachementControllerStartOcr({
        id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "attachments",
          dossierId,
          paginationParams.page,
          paginationParams.perPage,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["file-documents", dossierId],
      });
      toast.success("OCR lancé avec succès");
      methoods.reset();
    },
    onError: () => {
      toast.error("Erreur lors du lancement de l'OCR");
    },
  });
  const updateAttachmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttachementDto }) =>
      AttachementService.attachementControllerUpdate({
        id,
        requestBody: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "attachments",
          dossierId,
          paginationParams.page,
          paginationParams.perPage,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["file-documents", dossierId],
      });
    },
  });
  const deleteAttachmentMutation = useMutation({
    mutationFn: (id: string) =>
      AttachementService.attachementControllerRemove({
        id,
      }),
    onSuccess: () => {
      toast.success("Fichier supprimé avec succès");
      queryClient.invalidateQueries({
        queryKey: [
          "attachments",
          dossierId,
          paginationParams.page,
          paginationParams.perPage,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["file-documents", dossierId],
      });
    },
  });
  const handleDeleteAttachment = (id: string) => {
    deleteAttachmentMutation.mutate(id);
  };
  const onUpdateAttachment = async () => {
    if (selectedDocument?._id) {
      // Get the current value of the select for this row
      const selectValue = methoods.getValues(
        `documentType_${selectedDocument._id}` as any
      );
      // Optionally update the form state (if you want to force a value)
      methoods.setValue(`documentType_${selectedDocument._id}` as any, selectValue);
      // Call the mutation
      await updateAttachmentMutation.mutateAsync({
        id: selectedDocument._id,
        data: {
          documentId: selectValue,
        },
      });
    }
  };
  const onUploadAttachementFiles = async (files: File[], onProgress: (fileId: string, progress: number) => void) => {
    await uploadAttachementFiles.mutateAsync({ files, onProgress });
  };
  const [selectedDocument, setSelectedDocument] = useState<any>(
    null
  );
  const [documentToRead, setDocumentToRead] = useState(0);

  // Fonction pour gérer la sélection de document
  const handleDocumentSelection = (doc: any) => {
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
    startOCRMutation.mutateAsync(selectedDocument?._id);
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

  const isLoading = attachmentsQuery.isLoading || fileDocuments.isLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {/* OCR Launch Card Skeleton */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        {/* Drag and Drop Zone Skeleton */}
        <div className="border rounded-lg p-6 bg-white flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-8 w-40 mt-2" />
        </div>
        {/* Documents Table Skeleton */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50 flex gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="p-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b px-4 py-3"
              >
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Required Documents Table Skeleton */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b bg-gray-50">
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="p-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border-b px-4 py-3"
              >
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        {/* Document Viewer Skeleton */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="p-4 flex justify-center">
            <Skeleton className="h-96 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form methods={methoods}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Lecture OCR Section */}
          <OcrLaunchCard
            documentToRead={documentToRead}
            handleLaunchOCR={handleLaunchOCR}
            loading={startOCRMutation.isPending}
            disabled={!selectedDocument}
          />

          {/* Liste des documents */}
          <DocumentsTable
            attachments={attachmentsQuery.data}
            filesDocuments={fileDocuments.data}
            selectedDocument={selectedDocument}
            handleDocumentSelection={handleDocumentSelection}
            handleDocumentTypeChange={handleDocumentTypeChange}
            paginationParams={paginationParams}
            setPaginationParams={setPaginationParams}
            selectedRowId={selectedDocument?._id}
            handleDeleteAttachment={handleDeleteAttachment}
          />

          {/* Zone de drag & drop */}
          <DragAndDropZone
            onUpload={onUploadAttachementFiles}
            loading={uploadAttachementFiles.isPending}
          />

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
            onUpdateAttachment={onUpdateAttachment}
            loading={updateAttachmentMutation.isPending}
          />
        </div>
      </div>
    </Form>
  );
};

export default DocumentsSection;
