"use client";
import type React from "react";
import type { ReactElement } from "react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Mail, FolderOpen, Archive } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DossierDetail from "./dossier-detail";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientService } from "@/api-swagger/services/ClientService";
import { FileService } from "@/api-swagger/services/FileService";
import { EmailService } from "@/api-swagger/services/EmailService";
import { toast } from "sonner";
import { CreateFileDto } from "@/api-swagger/models/CreateFileDto";
import type { ClientDto } from "@/api-swagger/models/ClientDto";
import type { FileDto } from "@/api-swagger/models/FileDto";
import type { EmailDto } from "@/api-swagger/models/EmailDto";

// Extend the DTOs with additional properties we need
interface ExtendedClientDto extends ClientDto {
  _id: string;
  clientName: string;
}

interface ExtendedFileDto extends FileDto {
  _id: string;
  name: string;
  fileName: string;
}

interface ExtendedEmailDto extends EmailDto {
  _id: string;
  id: string; // Add this for backward compatibility
  clientName: string;
  client: ExtendedClientDto;
}

interface StatusTab {
  id: string;
  label: string;
  count?: number;
}

interface Dossier {
  id: string;
  clientNom: string;
  demandeur: string;
  forme: string;
  prestation: string;
  dossier: string;
  tarif: string;
  statutCreation: string;
  creation: string;
  dernMaj: string;
  blocage: string;
  intervenant: string;
  delai: string;
  documentPercent?: number;
  controlePercent?: number;
  donneesPercent?: number;
  motifRefus?: string;
}

const mockDossiers: Dossier[] = [
  {
    id: "2",
    clientNom: "MARTIN CONSULTING",
    demandeur: "Marie Martin",
    forme: "SAS",
    prestation: "Juridique",
    dossier: "Modification",
    tarif: "280€",
    statutCreation: "Terminé",
    creation: "28/04/2025",
    dernMaj: "30/04/2025",
    blocage: "Refus",
    intervenant: "Thomas L.",
    delai: "3 jours",
    documentPercent: 100,
    controlePercent: 100,
    donneesPercent: 100,
  },
  {
    id: "3",
    clientNom: "TECH SOLUTIONS",
    demandeur: "Paul Bernard",
    forme: "EURL",
    prestation: "Administrative",
    dossier: "Dissolution",
    tarif: "420€",
    statutCreation: "Urgent",
    creation: "03/05/2025",
    dernMaj: "05/05/2025",
    intervenant: "Sophie D.",
    blocage: "Refus",
    delai: "1 jour",
    documentPercent: 40,
    controlePercent: 20,
    donneesPercent: 60,
  },
  {
    id: "4",
    clientNom: "BERNARD FRÈRES",
    demandeur: "Lucie Bernard",
    forme: "SCI",
    prestation: "Comptable",
    dossier: "Création",
    tarif: "300€",
    statutCreation: "Bloqué",
    creation: "29/04/2025",
    dernMaj: "01/05/2025",
    blocage: "Refus",
    intervenant: "Alexandre M.",
    delai: "5 jours",
    documentPercent: 30,
    controlePercent: 10,
    donneesPercent: 50,
  },
  {
    id: "5",
    clientNom: "INNOVATION TECH",
    demandeur: "Pierre Dubois",
    forme: "SAS",
    prestation: "Juridique",
    dossier: "A saisir",
    tarif: "380€",
    statutCreation: "A saisir",
    creation: "02/05/2025",
    dernMaj: "04/05/2025",
    blocage: "Refus",
    intervenant: "Marie C.",
    delai: "2 jours",
  },
  {
    id: "6",
    clientNom: "GARCIA ET FILS",
    demandeur: "Carlos Garcia",
    forme: "SARL",
    prestation: "Comptable",
    dossier: "Modification",
    tarif: "240€",
    statutCreation: "Attente greffe",
    creation: "26/04/2025",
    dernMaj: "28/04/2025",
    blocage: "Refus",
    intervenant: "Thomas L.",
    delai: "8 jours",
  },
  {
    id: "7",
    clientNom: "MOREAU SERVICES",
    demandeur: "Émilie Moreau",
    forme: "SAS",
    prestation: "Juridique",
    dossier: "Création",
    tarif: "320€",
    statutCreation: "A payer",
    creation: "01/05/2025",
    dernMaj: "03/05/2025",
    blocage: "Refus",
    intervenant: "Sophie D.",
    delai: "4 jours",
  },
  {
    id: "8",
    clientNom: "DURAND IMMOBILIER",
    demandeur: "Jacques Durand",
    forme: "SCI",
    prestation: "Administrative",
    dossier: "Modification",
    tarif: "290€",
    statutCreation: "Etude",
    creation: "04/05/2025",
    dernMaj: "05/05/2025",
    blocage: "Refus",
    intervenant: "Alexandre M.",
    delai: "6 jours",
  },
  {
    id: "9",
    clientNom: "PETIT CONSULTING",
    demandeur: "Claire Petit",
    forme: "SAS",
    prestation: "Juridique",
    dossier: "Dissolution",
    tarif: "450€",
    statutCreation: "Refus",
    creation: "27/04/2025",
    dernMaj: "02/05/2025",
    blocage: "Refus",
    intervenant: "Thomas L.",
    delai: "3 jours",
    motifRefus: "Documents incomplets",
  },
];
const ITEMS_PER_PAGE = 10;

const Dossiers = (): ReactElement => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("mail");
  const [showArchives, setShowArchives] = useState(false);
  const { user } = useAuth();
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(
    null
  );
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedclientId, setSelectedclientId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState("");
  const [fileName, setFileName] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedProvision, setSelectedProvision] = useState("");

  // Pagination states
  const [currentEmailPage, setCurrentEmailPage] = useState(1);
  const [currentDossierPage, setCurrentDossierPage] = useState(1);

  const queryClient = useQueryClient();

  // Fetch clients
  const {
    data: clientsData,
    isLoading: isClientsLoading,
    error: clientsError,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () =>
      ClientService.clientControllerFindAll({
        page: "1",
        perPage: "100",
      }),
    select: (data) => data.data as ExtendedClientDto[],
  });

  // Fetch legal forms
  const {
    data: legalFormsData,
    isLoading: isLegalFormsLoading,
    error: legalFormsError,
  } = useQuery({
    queryKey: ["legalForms"],
    queryFn: () => FileService.fileControllerGetAllLegalForms(),
  });

  // Fetch provisions
  const {
    data: provisionsData,
    isLoading: isProvisionsLoading,
    error: provisionsError,
  } = useQuery({
    queryKey: ["provisions"],
    queryFn: () => FileService.fileControllerGetAllprovisions(),
  });

  // Fetch files
  const {
    data: filesData,
    isLoading: isFilesLoading,
    error: filesError,
  } = useQuery({
    queryKey: ["files"],
    queryFn: () =>
      FileService.fileControllerFindAll({
        page: "1",
        perPage: "100",
      }),
    select: (data) => data.data as ExtendedFileDto[],
  });

  // Fetch emails
  const {
    data: emailsData,
    isLoading: isEmailsLoading,
    error: emailsError,
  } = useQuery({
    queryKey: ["emails", "dossier"],
    queryFn: () =>
      EmailService.emailControllerFindAll({
        page: "1",
        perPage: "100",
      }),
    enabled: activeTab === "mail",
    select: (data) => data.data as ExtendedEmailDto[],
  });

  // Create file mutation
  const createFileMutation = useMutation({
    mutationFn: (data: CreateFileDto) =>
      FileService.fileControllerCreate({ requestBody: data }),
    onSuccess: () => {
      toast.success("Dossier créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["files"] });
      // Reset form
      setFileName("");
      setSelectedLegalForm("");
      setSelectedProvision("");
      setIsUrgent(false);
    },
    onError: (error) => {
      toast.error("Erreur lors de la création du dossier");
      console.error("Error creating file:", error);
    },
  });

  // Link to file mutation
  const linkToFileMutation = useMutation({
    mutationFn: (data: { fileId: string; emailId: string }) =>
      EmailService.emailControllerLinkToFile({
        requestBody: {
          fileId: data.fileId,
          emailId: data.emailId,
        },
      }),
    onSuccess: () => {
      toast.success("Association réussie");
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
    onError: (error) => {
      toast.error("Erreur lors de l'association");
      console.error("Error linking to file:", error);
    },
  });

  // Place the handlers here so they are in scope for the component
  const handleCreateDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedclientId) {
      toast.error("Veuillez sélectionner un client");
      return;
    }
    try {
      await createFileMutation.mutateAsync({
        clientId: selectedclientId,
        fileName: fileName,
        legalForm: selectedLegalForm as CreateFileDto["legalForm"],
        provision: selectedProvision as CreateFileDto["provision"],
        isUrgent,
        emailId: selectedEmailId,
        status: CreateFileDto.status.UNDER_STUDY,
      });
    } catch (error) {
      console.error("Error creating dossier:", error);
    }
  };

  const handleLinkToFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmailId || !selectedFileId) {
      toast.error("Veuillez sélectionner un email et un dossier");
      return;
    }
    try {
      await linkToFileMutation.mutateAsync({
        emailId: selectedEmailId,
        fileId: selectedFileId,
      });
    } catch (error) {
      console.error("Error linking email to file:", error);
    }
  };

  // Handle initial selections when data is available
  useEffect(() => {
    if (clientsData?.length > 0 && !selectedClientName) {
      setSelectedClientName(clientsData[0].clientName);
      setSelectedclientId(clientsData[0]._id);
    }
  }, [clientsData, selectedClientName]);

  useEffect(() => {
    if (filesData?.length > 0 && !selectedFileId) {
      setSelectedFileId(filesData[0]._id);
    }
  }, [filesData, selectedFileId]);

  useEffect(() => {
    if (emailsData?.length > 0 && !selectedEmailId) {
      setSelectedEmailId(emailsData[0]._id);
    }
  }, [emailsData, selectedEmailId]);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentEmailPage(1);
    setCurrentDossierPage(1);
  }, [activeTab]);

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentEmailPage(1);
    setCurrentDossierPage(1);
  }, [searchTerm]);

  const filteredEmails = useMemo(() => {
    if (!emailsData) return [];
    if (!searchTerm) return emailsData;

    return emailsData.filter((email) => {
      return (
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [emailsData, searchTerm]);

  const filteredDossiers = useMemo(() => {
    if (!searchTerm) return mockDossiers;

    return mockDossiers.filter((dossier) => {
      return (
        dossier.dossier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dossier.clientNom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);

  // Pagination calculations
  const totalEmailPages = Math.ceil(filteredEmails.length / ITEMS_PER_PAGE);
  const totalDossierPages = Math.ceil(filteredDossiers.length / ITEMS_PER_PAGE);

  const paginatedEmails = useMemo(() => {
    const startIndex = (currentEmailPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredEmails.slice(startIndex, endIndex);
  }, [filteredEmails, currentEmailPage]);

  const paginatedDossiers = useMemo(() => {
    const startIndex = (currentDossierPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDossiers.slice(startIndex, endIndex);
  }, [filteredDossiers, currentDossierPage]);

  // Pagination component
  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    itemType,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemType: string;
  }) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(
      currentPage * ITEMS_PER_PAGE,
      itemType === "emails" ? filteredEmails.length : filteredDossiers.length
    );
    const totalItems =
      itemType === "emails" ? filteredEmails.length : filteredDossiers.length;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="text-sm text-gray-700">
          {startItem} à {endItem}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Render table headers based on active tab
  const renderTableHeaders = () => {
    if (activeTab === "mail") return null;
    switch (activeTab) {
      case "urgent":
      case "tous":
        return (
          <TableRow>
            <TableHead className="w-1 p-0"></TableHead>
            <TableHead className="text-left font-medium">
              Nom du client
            </TableHead>
            <TableHead className="text-left font-medium">Demandeur</TableHead>
            <TableHead className="text-left font-medium">Prestation</TableHead>
            <TableHead className="text-left font-medium">Forme</TableHead>
            <TableHead className="text-left font-medium">Dossier</TableHead>
            <TableHead className="text-left font-medium">Tarif</TableHead>
            <TableHead className="text-left font-medium">Statut</TableHead>
            <TableHead className="text-left font-medium">Création</TableHead>
            <TableHead className="text-left font-medium">DERN Maj</TableHead>
            <TableHead className="text-left font-medium">Intervenant</TableHead>
          </TableRow>
        );

      case "bloque":
        return (
          <TableRow>
            <TableHead className="w-1 p-0"></TableHead>
            <TableHead className="text-left font-medium">Dossier</TableHead>
            <TableHead className="text-left font-medium">Intervenant</TableHead>
            <TableHead className="text-left font-medium">Délai</TableHead>
            <TableHead className="text-left font-medium">Blocage</TableHead>
          </TableRow>
        );

      case "etude":
      case "en-attente":
        return (
          <TableRow>
            <TableHead className="w-1 p-0"></TableHead>
            <TableHead className="text-left font-medium">Client</TableHead>
            <TableHead className="text-left font-medium">Dossier</TableHead>
            <TableHead className="text-left font-medium">Délai</TableHead>
            <TableHead className="text-left font-medium">Intervenant</TableHead>
            <TableHead className="text-left font-medium">Refus</TableHead>
          </TableRow>
        );
      case "attente-greffe":
      case "a-saisir":
      case "a-payer":
        return (
          <TableRow>
            <TableHead className="w-1 p-0"></TableHead>
            <TableHead className="text-left font-medium">Client</TableHead>
            <TableHead className="text-left font-medium">Prestation</TableHead>
            <TableHead className="text-left font-medium">Dossier</TableHead>
            <TableHead className="text-left font-medium">Délai</TableHead>
            <TableHead className="text-left font-medium">Intervenant</TableHead>
            <TableHead className="text-left font-medium">Refus</TableHead>
          </TableRow>
        );
      case "refus":
        return (
          <TableRow>
            <TableHead className="w-1 p-0"></TableHead>
            <TableHead className="text-left font-medium">Client</TableHead>
            <TableHead className="text-left font-medium">Dossier</TableHead>
            <TableHead className="text-left font-medium">Intervenant</TableHead>
            <TableHead className="text-left font-medium">Délai</TableHead>
            <TableHead className="text-left font-medium">Motif Refus</TableHead>
          </TableRow>
        );
      case "termine":
        return (
          <TableRow>
            <TableHead className="w-1 p-0"></TableHead>
            <TableHead className="text-left font-medium">
              Nom du client
            </TableHead>
            <TableHead className="text-left font-medium">Demandeur</TableHead>
            <TableHead className="text-left font-medium">Prestation</TableHead>
            <TableHead className="text-left font-medium">Forme</TableHead>
            <TableHead className="text-left font-medium">Dossier</TableHead>
            <TableHead className="text-left font-medium">Délai</TableHead>
            <TableHead className="text-left font-medium">Intervenant</TableHead>
            <TableHead className="text-left font-medium">Refus</TableHead>
          </TableRow>
        );
    }
  };

  // Render table cells based on active tab
  const renderTableCells = (dossier: Dossier) => {
    switch (activeTab) {
      case "urgent":
      case "tous":
        return (
          <>
            <TableCell className="font-medium">{dossier.clientNom}</TableCell>
            <TableCell>{dossier.demandeur}</TableCell>
            <TableCell>{dossier.prestation}</TableCell>
            <TableCell>{dossier.forme}</TableCell>
            <TableCell>{dossier.dossier}</TableCell>
            <TableCell>{dossier.tarif}</TableCell>
            <TableCell>{dossier.statutCreation}</TableCell>
            <TableCell>{dossier.creation}</TableCell>
            <TableCell>{dossier.dernMaj}</TableCell>
            <TableCell>{dossier.intervenant}</TableCell>
          </>
        );
      case "bloque":
        return (
          <>
            <TableCell>{dossier.dossier}</TableCell>
            <TableCell>{dossier.intervenant}</TableCell>
            <TableCell>{dossier.delai}</TableCell>
            <TableCell>{dossier.blocage}</TableCell>
          </>
        );
      case "etude":
      case "en-attente":
        return (
          <>
            <TableCell className="font-medium">{dossier.clientNom}</TableCell>
            <TableCell>{dossier.dossier}</TableCell>
            <TableCell>{dossier.delai}</TableCell>
            <TableCell>{dossier.intervenant}</TableCell>
            <TableCell>{dossier.motifRefus}</TableCell>
          </>
        );
      case "attente-greffe":
      case "a-saisir":
      case "a-payer":
        return (
          <>
            <TableCell className="font-medium">{dossier.clientNom}</TableCell>
            <TableCell>{dossier.prestation}</TableCell>
            <TableCell>{dossier.dossier}</TableCell>
            <TableCell>{dossier.delai}</TableCell>
            <TableCell>{dossier.intervenant}</TableCell>
            <TableCell>{dossier.clientNom}</TableCell>
          </>
        );
      case "refus":
        return (
          <>
            <TableCell className="font-medium">{dossier.clientNom}</TableCell>
            <TableCell>{dossier.dossier}</TableCell>
            <TableCell>{dossier.intervenant}</TableCell>
            <TableCell>{dossier.delai}</TableCell>
            <TableCell>{dossier.motifRefus}</TableCell>
          </>
        );
      case "termine":
        return (
          <>
            <TableCell className="font-medium">{dossier.clientNom}</TableCell>
            <TableCell>{dossier.demandeur}</TableCell>
            <TableCell>{dossier.prestation}</TableCell>
            <TableCell>{dossier.forme}</TableCell>
            <TableCell>{dossier.dossier}</TableCell>
            <TableCell>{dossier.delai}</TableCell>
            <TableCell>{dossier.intervenant}</TableCell>
            <TableCell>{dossier.motifRefus}</TableCell>
          </>
        );
    }
  };

  // Fonction pour gérer le clic sur un email
  const handleEmailClick = (emailId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedEmail = emailsData?.find((email) => email._id === emailId);
    if (selectedEmail) {
      setSelectedEmailId(emailId);
    }
  };

  // Fonction pour ouvrir le détail d'un dossier
  const handleOpenDossier = (dossierId: string) => {
    setSelectedDossierId(dossierId);
  };

  // Render mail content area
  const renderMailContent = () => {
    if (activeTab !== "mail") return null;

    // Trouver l'email sélectionné
    const selectedEmail = emailsData?.find(
      (email) => email._id === selectedEmailId
    );
    console.log(" ------ selectedEmail -------", selectedEmail?._id);
    console.log(" ------ selectedClientid -------", selectedEmail?.client._id);

    return (
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 p-3 bg-blue-100">
            <Button
              variant="secondary"
              className={`text-sm px-3 py-1 h-auto ${
                !showArchives ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setShowArchives(false)}
            >
              Boîte mail
            </Button>
            <Button
              variant="secondary"
              className={`text-sm px-3 py-1 h-auto ${
                showArchives ? "bg-white shadow-sm" : ""
              }`}
              onClick={() => setShowArchives(true)}
            >
              Archives
            </Button>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {isEmailsLoading ? (
              <div className="p-3 text-center text-gray-500">Chargement...</div>
            ) : paginatedEmails.length === 0 ? (
              <div className="p-3 text-center text-gray-500">
                Aucun email trouvé
              </div>
            ) : (
              paginatedEmails.map((email) => (
                <div
                  key={email._id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedEmailId === email._id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : ""
                  }`}
                  onClick={(e) => handleEmailClick(email._id, e)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-sm">
                      {email.clientName}
                    </div>
                    <div className="text-xs text-gray-500">{email.date}</div>
                  </div>
                  <div className="text-sm text-gray-700 truncate mb-1">
                    {email.from}
                  </div>
                  <div className="text-sm text-gray-600 truncate mb-2">
                    {email.subject}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      Non traité
                    </span>
                    {selectedEmailId === email.id && (
                      <span className="text-xs text-blue-600 font-medium">
                        Sélectionné
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Email pagination */}
          <PaginationControls
            currentPage={currentEmailPage}
            totalPages={totalEmailPages}
            onPageChange={setCurrentEmailPage}
            itemType="emails"
          />
        </div>

        <div className="md:col-span-2 border rounded-lg">
          {selectedEmail ? (
            <>
              <div className="border-b p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2">
                      {selectedEmail.subject}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">
                          <span className="font-medium">De:</span>{" "}
                          {selectedEmail.from}
                        </div>
                        <div className="text-gray-600 mb-1">
                          <span className="font-medium">Client:</span>{" "}
                          {selectedEmail.clientName}
                        </div>
                        <div className="text-gray-600 mb-1">
                          <span className="font-medium">ID Email:</span>{" "}
                          {selectedEmail._id}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">
                          <span className="font-medium">Date:</span>{" "}
                          {selectedEmail.date}
                        </div>
                        <div className="text-gray-600 mb-1">
                          <span className="font-medium">Statut:</span>{" "}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            Non traité
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Content with Enhanced Details */}
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Contenu de l'email:
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg max-h-64 overflow-y-auto">
                    <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {selectedEmail.textBody}
                    </div>
                  </div>
                </div>

                {/* Additional Email Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"></div>

                {/* Attachments Section (if any) */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Pièces jointes
                  </h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 text-center">
                      Aucune pièce jointe
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <div className="text-lg mb-2">Sélectionnez un email</div>
              <div className="text-sm">
                Choisissez un email dans la liste pour voir son contenu détaillé
              </div>
            </div>
          )}
        </div>

        {/* Forms Section - Now separated into two distinct cards */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nouveau Dossier Form */}
          <Card className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Nouveau dossier</h3>
            <div className="space-y-4">
              <div>
                <Select
                  value={selectedClientName}
                  onValueChange={(value) => {
                    const selectedClient = clientsData?.find(
                      (client) => client.clientName === value
                    );
                    if (selectedClient) {
                      setSelectedClientName(selectedClient.clientName);
                      setSelectedclientId(selectedClient._id);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsData?.map((client) => (
                      <SelectItem key={client._id} value={client.clientName}>
                        {client.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedProvision}
                  onValueChange={setSelectedProvision}
                  disabled={createFileMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prestation" />
                  </SelectTrigger>
                  <SelectContent>
                    {provisionsData?.map((provision) => (
                      <SelectItem key={provision} value={provision}>
                        {provision}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedLegalForm}
                  onValueChange={setSelectedLegalForm}
                  disabled={createFileMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Forme juridique" />
                  </SelectTrigger>
                  <SelectContent>
                    {legalFormsData?.map((form) => (
                      <SelectItem key={form} value={form}>
                        {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input
                  placeholder="Nom du dossier"
                  className="w-full"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  disabled={createFileMutation.isPending}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgent-check"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  disabled={createFileMutation.isPending}
                />
                <label htmlFor="urgent-check">Urgent</label>
              </div>

              <div>
                <Button
                  variant="outline"
                  className="bg-white"
                  onClick={handleCreateDossier}
                  disabled={createFileMutation.isPending}
                >
                  {createFileMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Création en cours...
                    </>
                  ) : (
                    "Créer un dossier"
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Associer à un Dossier Form */}
          <Card className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium mb-4">Associer à un dossier</h3>
            <div className="space-y-4">
              <div>
                <Select
                  value={selectedClientName}
                  onValueChange={(value) => {
                    const selectedClient = clientsData?.find(
                      (client) => client.clientName === value
                    );
                    if (selectedClient) {
                      setSelectedClientName(selectedClient.clientName);
                      setSelectedclientId(selectedClient._id);
                    }
                  }}
                  disabled={linkToFileMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsData?.map((client) => (
                      <SelectItem key={client._id} value={client.clientName}>
                        {client.clientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={selectedFileId || ""}
                  onValueChange={setSelectedFileId}
                  disabled={linkToFileMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nom du dossier" />
                  </SelectTrigger>
                  <SelectContent>
                    {filesData?.map((file) => (
                      <SelectItem key={file._id} value={file._id}>
                        {file.name || file.fileName || `Dossier ${file._id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="acceder-check"
                  defaultChecked
                  disabled={linkToFileMutation.isPending}
                />
                <label htmlFor="acceder-check">Accéder</label>
              </div>

              <Button
                variant="outline"
                className="bg-white"
                onClick={handleLinkToFile}
                disabled={linkToFileMutation.isPending}
              >
                {linkToFileMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Association en cours...
                  </>
                ) : (
                  "Associer au dossier"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Loading states
  const isLoading =
    isClientsLoading ||
    isLegalFormsLoading ||
    isProvisionsLoading ||
    isFilesLoading ||
    (activeTab === "mail" && isEmailsLoading);

  // Error states
  const error =
    clientsError ||
    legalFormsError ||
    provisionsError ||
    filesError ||
    (activeTab === "mail" && emailsError);

  const statusTabs = [
    { id: "mail", label: "Mail", count: emailsData?.length, icon: Mail },
    { id: "tous", label: "Tous", count: mockDossiers.length, icon: FolderOpen },
    {
      id: "bloque",
      label: "Bloqué",
      count: mockDossiers.filter((d) => d.statutCreation === "Bloqué").length,
      icon: Archive,
    },
    {
      id: "urgent",
      label: "Urgent",
      count: mockDossiers.filter((d) => d.statutCreation === "Urgent").length,
      icon: Archive,
    },
    {
      id: "etude",
      label: "Etude",
      count: mockDossiers.filter((d) => d.statutCreation === "Etude").length,
      icon: Archive,
    },
    {
      id: "en-attente",
      label: "En attente",
      count: mockDossiers.filter((d) => d.statutCreation === "En cours").length,
      icon: Archive,
    },
    {
      id: "a-saisir",
      label: "A saisir",
      count: mockDossiers.filter((d) => d.statutCreation === "A saisir").length,
      icon: Archive,
    },
    {
      id: "a-payer",
      label: "A payer",
      count: mockDossiers.filter((d) => d.statutCreation === "A payer").length,
      icon: Archive,
    },
    {
      id: "attente-greffe",
      label: "Attente Greffe",
      count: mockDossiers.filter((d) => d.statutCreation === "Attente greffe")
        .length,
      icon: Archive,
    },
    {
      id: "refus",
      label: "Refus",
      count: mockDossiers.filter((d) => d.statutCreation === "Refus").length,
      icon: Archive,
    },
    {
      id: "termine",
      label: "Terminé",
      count: mockDossiers.filter((d) => d.statutCreation === "Terminé").length,
      icon: Archive,
    },
  ];

  // Display loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6 animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-formality-primary"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Display error state
  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-6 animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <p className="text-red-600">
                Une erreur est survenue lors du chargement des données.
              </p>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries()}
              >
                Réessayer
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedDossierId ? (
          <DossierDetail
            dossierId={selectedDossierId}
            onClose={() => setSelectedDossierId(null)}
          />
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-bold text-formality-accent flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-formality-primary" />
                Dossiers
              </h1>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-10 border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Main Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* Enhanced Tab Navigation */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="overflow-x-auto">
                    <TabsList className="bg-transparent p-0 h-auto w-full rounded-none flex-nowrap min-w-full">
                      {statusTabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="py-4 px-4 sm:px-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:shadow-sm flex items-center gap-2 transition-all whitespace-nowrap flex-shrink-0"
                          >
                            <IconComponent className="h-4 w-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                            <span className={`flex h-5 min-w-5 items-center justify-center rounded-full text-xs font-medium text-white px-1.5 ${
                              tab.id === 'mail' ? 'bg-formality-primary' :
                              tab.id === 'urgent' ? 'bg-red-500' :
                              tab.id === 'bloque' ? 'bg-orange-500' :
                              'bg-gray-500'
                            }`}>
                              {tab.count}
                            </span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-3 sm:p-6">
                  {activeTab === "mail" ? (
                    // Mail Content Layout
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Email List */}
                        <div className="lg:col-span-1 border rounded-lg overflow-hidden">
                          <div className="flex items-center gap-2 p-3 bg-blue-50 border-b">
                            <Button
                              variant="secondary"
                              size="sm"
                              className={`text-sm px-3 py-1 h-auto ${
                                !showArchives ? "bg-white shadow-sm" : ""
                              }`}
                              onClick={() => setShowArchives(false)}
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Boîte mail
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className={`text-sm px-3 py-1 h-auto ${
                                showArchives ? "bg-white shadow-sm" : ""
                              }`}
                              onClick={() => setShowArchives(true)}
                            >
                              <Archive className="h-3 w-3 mr-1" />
                              Archives
                            </Button>
                          </div>
                          <div className="divide-y max-h-96 overflow-y-auto">
                            {isEmailsLoading ? (
                              <div className="p-4 text-center text-gray-500">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-formality-primary mx-auto mb-2"></div>
                                Chargement...
                              </div>
                            ) : paginatedEmails.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">
                                <Mail className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">Aucun email trouvé</p>
                              </div>
                            ) : (
                              paginatedEmails.map((email) => (
                                <div
                                  key={email._id}
                                  className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                    selectedEmailId === email._id
                                      ? "bg-blue-50 border-l-4 border-blue-500"
                                      : ""
                                  }`}
                                  onClick={(e) => handleEmailClick(email._id, e)}
                                >
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                      <div className="font-medium text-sm truncate">
                                        {email.clientName}
                                      </div>
                                      <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                        {email.date}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-700 truncate">
                                      {email.from}
                                    </div>
                                    <div className="text-sm text-gray-600 truncate">
                                      {email.subject}
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                        Non traité
                                      </span>
                                      {selectedEmailId === email._id && (
                                        <span className="text-xs text-blue-600 font-medium">
                                          Sélectionné
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                          {/* Email Pagination */}
                          <PaginationControls
                            currentPage={currentEmailPage}
                            totalPages={totalEmailPages}
                            onPageChange={setCurrentEmailPage}
                            itemType="emails"
                          />
                        </div>

                        {/* Email Detail */}
                        <div className="lg:col-span-2 border rounded-lg min-h-96">
                          {selectedEmail ? (
                            <div className="h-full flex flex-col">
                              <div className="border-b p-4 bg-gray-50">
                                <h2 className="text-lg font-semibold mb-3">
                                  {selectedEmail.subject}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <div className="text-gray-600">
                                      <span className="font-medium">De:</span> {selectedEmail.from}
                                    </div>
                                    <div className="text-gray-600">
                                      <span className="font-medium">Client:</span> {selectedEmail.clientName}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="text-gray-600">
                                      <span className="font-medium">Date:</span> {selectedEmail.date}
                                    </div>
                                    <div className="text-gray-600">
                                      <span className="font-medium">Statut:</span>{" "}
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                        Non traité
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-1 p-4">
                                <div className="bg-gray-50 p-4 rounded-lg h-full overflow-y-auto">
                                  <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                    {selectedEmail.textBody}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                              <div className="text-center">
                                <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <div className="text-lg mb-2">Sélectionnez un email</div>
                                <div className="text-sm">
                                  Choisissez un email dans la liste pour voir son contenu
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Forms Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Nouveau Dossier Form */}
                        <Card className="p-6">
                          <h3 className="text-lg font-medium mb-4">Nouveau dossier</h3>
                          <div className="space-y-4">
                            <Select
                              value={selectedClientName}
                              onValueChange={(value) => {
                                const selectedClient = clientsData?.find(
                                  (client) => client.clientName === value
                                );
                                if (selectedClient) {
                                  setSelectedClientName(selectedClient.clientName);
                                  setSelectedclientId(selectedClient._id);
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un client" />
                              </SelectTrigger>
                              <SelectContent>
                                {clientsData?.map((client) => (
                                  <SelectItem key={client._id} value={client.clientName}>
                                    {client.clientName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select
                              value={selectedProvision}
                              onValueChange={setSelectedProvision}
                              disabled={createFileMutation.isPending}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Prestation" />
                              </SelectTrigger>
                              <SelectContent>
                                {provisionsData?.map((provision) => (
                                  <SelectItem key={provision} value={provision}>
                                    {provision}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={selectedLegalForm}
                              onValueChange={setSelectedLegalForm}
                              disabled={createFileMutation.isPending}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Forme juridique" />
                              </SelectTrigger>
                              <SelectContent>
                                {legalFormsData?.map((form) => (
                                  <SelectItem key={form} value={form}>
                                    {form}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Input
                              placeholder="Nom du dossier"
                              value={fileName}
                              onChange={(e) => setFileName(e.target.value)}
                              disabled={createFileMutation.isPending}
                            />

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="urgent-check"
                                checked={isUrgent}
                                onChange={(e) => setIsUrgent(e.target.checked)}
                                disabled={createFileMutation.isPending}
                              />
                              <label htmlFor="urgent-check" className="text-sm">Urgent</label>
                            </div>

                            <Button
                              onClick={handleCreateDossier}
                              disabled={createFileMutation.isPending}
                              className="w-full"
                            >
                              {createFileMutation.isPending ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Création en cours...
                                </>
                              ) : (
                                "Créer un dossier"
                              )}
                            </Button>
                          </div>
                        </Card>

                        {/* Associer à un Dossier Form */}
                        <Card className="p-6">
                          <h3 className="text-lg font-medium mb-4">Associer à un dossier</h3>
                          <div className="space-y-4">
                            <Select
                              value={selectedClientName}
                              onValueChange={(value) => {
                                const selectedClient = clientsData?.find(
                                  (client) => client.clientName === value
                                );
                                if (selectedClient) {
                                  setSelectedClientName(selectedClient.clientName);
                                  setSelectedclientId(selectedClient._id);
                                }
                              }}
                              disabled={linkToFileMutation.isPending}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un client" />
                              </SelectTrigger>
                              <SelectContent>
                                {clientsData?.map((client) => (
                                  <SelectItem key={client._id} value={client.clientName}>
                                    {client.clientName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={selectedFileId || ""}
                              onValueChange={setSelectedFileId}
                              disabled={linkToFileMutation.isPending}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Nom du dossier" />
                              </SelectTrigger>
                              <SelectContent>
                                {filesData?.map((file) => (
                                  <SelectItem key={file._id} value={file._id}>
                                    {file.name || file.fileName || `Dossier ${file._id}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id="acceder-check"
                                defaultChecked
                                disabled={linkToFileMutation.isPending}
                              />
                              <label htmlFor="acceder-check" className="text-sm">Accéder</label>
                            </div>

                            <Button
                              onClick={handleLinkToFile}
                              disabled={linkToFileMutation.isPending}
                              className="w-full"
                              variant="outline"
                            >
                              {linkToFileMutation.isPending ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                  Association en cours...
                                </>
                              ) : (
                                "Associer au dossier"
                              )}
                            </Button>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    // Dossiers Table
                    <div className="space-y-4">
                      <div className="overflow-hidden border rounded-lg">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>{renderTableHeaders()}</TableHeader>
                            <TableBody>
                              {paginatedDossiers.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={10} className="text-center py-8">
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                      <FolderOpen className="h-8 w-8 text-gray-300" />
                                      <p>Aucun dossier trouvé</p>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                paginatedDossiers.map((dossier) => (
                                  <TableRow
                                    key={dossier.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedDossierId(dossier.id)}
                                  >
                                    <TableCell className="p-0 w-1">
                                      <div
                                        className={`w-1 h-full ${
                                          dossier.statutCreation === "Urgent"
                                            ? "bg-red-500"
                                            : dossier.statutCreation === "Bloqué"
                                            ? "bg-orange-500"
                                            : "bg-blue-500"
                                        }`}
                                      ></div>
                                    </TableCell>
                                    {renderTableCells(dossier)}
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        {/* Dossier Pagination */}
                        <PaginationControls
                          currentPage={currentDossierPage}
                          totalPages={totalDossierPages}
                          onPageChange={setCurrentDossierPage}
                          itemType="dossiers"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Tabs>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dossiers;
