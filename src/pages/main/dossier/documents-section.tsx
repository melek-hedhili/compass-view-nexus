import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentsSectionProps {
  dossierId?: string;
}

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

export default function DocumentsSection({ dossierId }: DocumentsSectionProps) {
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

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    documents[0]
  );
  const [documentToRead, setDocumentToRead] = useState(0);

  // Fonction pour gérer la sélection de document
  const handleDocumentSelection = (doc: Document) => {
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
          doc.id === selectedDocument.id ? { ...doc, ocr: true } : doc
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        {/* Lecture OCR Section */}
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

        {/* Liste des documents */}
        <Card className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium">Liste des documents</h3>
          </div>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead className="text-left font-medium">
                    Nom du document
                  </TableHead>
                  <TableHead className="text-left font-medium">
                    Type de document
                  </TableHead>
                  <TableHead className="text-center font-medium w-12">
                    OCR
                  </TableHead>
                  <TableHead className="text-center font-medium w-12">
                    AI
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow
                    key={doc.id}
                    className={`${
                      selectedDocument?.id === doc.id
                        ? "bg-blue-50"
                        : "bg-gray-100"
                    } hover:bg-gray-50 cursor-pointer`}
                    onClick={() => handleDocumentSelection(doc)}
                  >
                    <TableCell>{doc.nom}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={doc.type}
                        onValueChange={(value) =>
                          handleDocumentTypeChange(doc.id, value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carte vitale">
                            Carte vitale
                          </SelectItem>
                          <SelectItem value="Statut constitutif">
                            Statut constitutif
                          </SelectItem>
                          <SelectItem value="Papier d'identité">
                            Papier d'identité
                          </SelectItem>
                          <SelectItem value="Attestation de domiciliation">
                            Attestation de domiciliation
                          </SelectItem>
                          <SelectItem value="Nomination gérant">
                            Nomination gérant
                          </SelectItem>
                          <SelectItem value="Annonce légale">
                            Annonce légale
                          </SelectItem>
                          <SelectItem value="Justificatif de domicile">
                            Justificatif de domicile
                          </SelectItem>
                          <SelectItem value="Dépôt de capital">
                            Dépôt de capital
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      {doc.ocr ? (
                        <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="mx-auto h-5 w-5 rounded-full border border-gray-300"></div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {doc.ai ? (
                        <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="mx-auto h-5 w-5 rounded-full border border-gray-300"></div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Zone de drag & drop */}
        <Card className="border rounded-lg overflow-hidden">
          <div className="p-8 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-gray-500">
            <Upload className="h-8 w-8 mb-2" />
            <p className="text-sm">Zone de drag & drop des fichiers</p>
          </div>
        </Card>

        {/* Documents nécessaires pour le dossier */}
        <Card className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium">
              Documents nécessaires pour le dossier
            </h3>
          </div>
          <div className="p-0">
            <Table>
              <TableBody>
                {requiredDocuments.map((doc) => (
                  <TableRow
                    key={doc.id}
                    className={`bg-gray-100 hover:bg-gray-50 ${
                      doc.linkedDocumentId ? "cursor-pointer" : ""
                    }`}
                    onClick={() => {
                      if (doc.linkedDocumentId) {
                        const linkedDoc = documents.find(
                          (d) => d.id === doc.linkedDocumentId
                        );
                        if (linkedDoc) handleDocumentSelection(linkedDoc);
                      }
                    }}
                  >
                    <TableCell>{doc.nom}</TableCell>
                    <TableCell className="w-12 text-center">
                      {doc.checked ? (
                        <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="mx-auto h-5 w-5 rounded-full border border-gray-300"></div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Document Viewer */}
      <div>
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
      </div>
    </div>
  );
}
