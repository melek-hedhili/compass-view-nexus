import type React from "react";
import type { ReactElement } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Mail,
  FolderOpen,
  AlertCircle,
  FileText,
  CheckCircle2,
  Hourglass,
  Clock,
  Ban,
  FileX2,
  FileClock,
  FileWarning,
  FilePlus2,
} from "lucide-react";
import {
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { ClientService } from "@/api-swagger/services/ClientService";
import { FileService } from "@/api-swagger/services/FileService";
import { EmailService } from "@/api-swagger/services/EmailService";
import { FileDto } from "@/api-swagger/models/FileDto";
import type { EmailDto } from "@/api-swagger/models/EmailDto";
import { useNavigate } from "react-router-dom";
import SegmentedTabs from "@/components/ui/segmented-tabs";
import MailTab from "./details/mailTab/MailTab";
import { Form } from "@/components/ui/form";
import { ControlledInput } from "@/components/ui/controlled/controlled-input/controlled-input";
import { useForm } from "react-hook-form";
import { useSearchDebounce } from "@/hooks/use-search-debounce";
import { DataTable } from "@/components/ui/data-table";
import type { Column } from "@/components/ui/data-table";
import { formatDate } from "@/utils/utils";

// Utility to get human-readable status label
function getStatusLabel(status: FileDto.status): string {
  switch (status) {
    case FileDto.status.UNDER_STUDY:
      return "En étude";
    case FileDto.status.PENDING:
      return "En attente";
    case FileDto.status.PENDING_STAR:
      return "Urgent";
    case FileDto.status.TO_BE_ENTERED:
      return "À saisir";
    case FileDto.status.TO_BE_ENTERED_STAR:
      return "À saisir (urgent)";
    case FileDto.status.TO_BE_PAID:
      return "À payer";
    case FileDto.status.WAITING_FOR_GREFFE:
      return "Attente greffe";
    case FileDto.status.WAITING_FOR_GREFFE_STAR:
      return "Attente greffe (urgent)";
    case FileDto.status.REJECTED:
      return "Refusé";
    case FileDto.status.COMPLETED:
      return "Terminé";
    case FileDto.status.BLOCKED:
      return "Bloqué";
    default:
      return status;
  }
}

// Utility to get human-readable prestation label
function getPrestationLabel(provision: FileDto.provision): string {
  switch (provision) {
    case FileDto.provision.LEGAL:
      return "Juridique";
    case FileDto.provision.ACCOUNTING:
      return "Comptable";
    case FileDto.provision.ADMINISTRATIVE:
      return "Administrative";
    default:
      return provision;
  }
}

const Dossiers = (): ReactElement => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mail");
  const [showArchives, setShowArchives] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<EmailDto | null>(null);
  const methods = useForm<{
    search: string;
  }>({
    defaultValues: {
      search: "",
    },
  });
  const search = useSearchDebounce({
    control: methods.control,
    name: "search",
  });
  // Pagination states
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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

  const fileCountQuery = useQuery({
    queryKey: ["fileCount"],
    queryFn: () => FileService.fileControllerGetFileStatusCount(),
  });

  const filesQuery = useQuery({
    queryKey: ["files", activeTab, page, perPage],
    queryFn: () =>
      FileService.fileControllerFindAll({
        page: page.toString(),
        perPage: perPage.toString(),
        ...(activeTab &&
          activeTab !== "tous" && {
            filters: JSON.stringify([
              {
                field: "status",
                values: [activeTab],
              },
            ]),
          }),
      }),
    enabled: activeTab !== "mail",
  });

  // DataTable columns definition (example, adjust as needed)
  const dossierColumns: Column<FileDto>[] = [
    { key: "client.clientName", header: "Nom du client" },
    { key: "intervenant.username", header: "Intervenant" },
    { key: "fileName", header: "Nom du dossier" },
    { key: "legalForm", header: "Forme" },
    {
      key: "provision",
      header: "Prestation",
      render: (value, _) => getPrestationLabel(value),
    },
    {
      key: "client.creationPrice",
      header: "Tarif",
      sortable: true,
      align: "left",

      render: (value) => (value ? `${value}€` : "-"),
    },
    {
      key: "client.modificationPrice",
      header: "Tarif Modification",
      sortable: true,
      align: "center",
      alignHeader: "center",
      render: (value) => (value ? `${value}€` : "-"),
    },
    {
      key: "client.submissionPrice",
      header: "Tarif Soumission",
      sortable: true,
      align: "center",
      alignHeader: "center",
      render: (value) => (value ? `${value}€` : "-"),
    },
    {
      key: "created_at",
      header: "Création",
      render: (value, _) => formatDate(value),
    },
    {
      key: "updated_at",
      header: "Dernière Maj",
      render: (value, _) => formatDate(value),
    },
  ];

  // Fetch emails
  const {
    data: emailsData,
    isLoading: isEmailsLoading,
    error: emailsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["emails", "dossier", search],
    queryFn: ({ pageParam = 1 }) =>
      EmailService.emailControllerFindAll({
        page: pageParam.toString(),
        perPage: "10",
        searchValue: search,
        searchFields: ["from", "to", "subjec"],
      }),
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.count;
      const loaded = allPages.flatMap((p) => p.data).length;
      return loaded < total ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      data: data.pages.flatMap((page) => page.data),
      count: data.pages.reduce((acc, page) => acc + page.count, 0),
    }),
  });

  // Handle initial selections when data is available
  useEffect(() => {
    if (clientsData?.count && !selectedClientName) {
      setSelectedClientName(clientsData.data[0].clientName);
    }
    if (filesQuery.data?.count && !selectedFileId) {
      setSelectedFileId(filesQuery.data.data[0]._id);
    }
    if (emailsData?.data.length > 0) {
      setSelectedEmailId(emailsData.data[0]._id);
    }
  }, [
    clientsData,
    selectedClientName,
    filesQuery.data,
    selectedFileId,
    emailsData,
  ]);

  useEffect(() => {
    if (emailsData?.data?.length === 0) {
      setSelectedEmail(null);
      return;
    }
    if (selectedEmailId && emailsData?.data?.length > 0) {
      const found = emailsData?.data?.find(
        (email) => email._id === selectedEmailId
      );
      setSelectedEmail(found || null);
    }
  }, [selectedEmailId, emailsData]);

  // Fonction pour gérer le clic sur un email
  const handleEmailClick = (emailId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmailId(emailId);
    // Find and set the selected email
    const email = emailsData?.data?.find((email) => email._id === emailId);
    if (email) {
      setSelectedEmail(email);
    }
  };

  // Update the click handler to navigate to dossier route
  const handleDossierClick = (dossierId: string) => {
    navigate(`/dashboard/dossiers/${dossierId}/informations`);
  };

  // Loading states
  const isLoading =
    isClientsLoading ||
    isLegalFormsLoading ||
    isProvisionsLoading ||
    filesQuery.isLoading ||
    (activeTab === "mail" && isEmailsLoading);

  // Error states
  const error =
    clientsError ||
    legalFormsError ||
    provisionsError ||
    filesQuery.error ||
    (activeTab === "mail" && emailsError);

  const statusTabs = [
    {
      id: "mail",
      label: "Mail",
      icon: Mail,

      count: emailsData?.count,
    },
    {
      id: "tous",
      label: "Tous",
      icon: FolderOpen,
      count: fileCountQuery.data?.ALL_COUNT,
    },
    {
      id: FileDto.status.UNDER_STUDY,
      label: "En étude",
      icon: Hourglass,
      count: fileCountQuery.data?.UNDER_STUDY_COUNT,
    },
    {
      id: FileDto.status.PENDING,
      label: "En attente",
      icon: Clock,
      count: fileCountQuery.data?.PENDING_COUNT,
    },
    {
      id: FileDto.status.PENDING_STAR,
      label: "En attente *",
      icon: AlertCircle,
      count: fileCountQuery.data?.PENDING_STAR_COUNT,
    },
    {
      id: FileDto.status.TO_BE_ENTERED,
      label: "À saisir",
      icon: FilePlus2,
      count: fileCountQuery.data?.TO_BE_ENTERED_COUNT,
    },
    {
      id: FileDto.status.TO_BE_ENTERED_STAR,
      label: "À saisir *",
      icon: FileWarning,
      count: fileCountQuery.data?.TO_BE_ENTERED_STAR_COUNT,
    },
    {
      id: FileDto.status.TO_BE_PAID,
      label: "À payer",
      icon: FileText,
      count: fileCountQuery.data?.TO_BE_PAID_COUNT,
    },
    {
      id: FileDto.status.WAITING_FOR_GREFFE,
      label: "Attente greffe",
      icon: FileClock,
      count: fileCountQuery.data?.WAITING_FOR_GREFFE_COUNT,
    },
    {
      id: FileDto.status.WAITING_FOR_GREFFE_STAR,
      label: "Attente greffe *",
      icon: AlertCircle,
      count: fileCountQuery.data?.WAITING_FOR_GREFFE_STAR_COUNT,
    },
    {
      id: FileDto.status.REJECTED,
      label: "Refusé",
      icon: FileX2,
      count: fileCountQuery.data?.REJECTED_COUNT,
    },
    {
      id: FileDto.status.COMPLETED,
      label: "Terminé",
      icon: CheckCircle2,
      count: fileCountQuery.data?.COMPLETED_COUNT,
    },
    {
      id: FileDto.status.BLOCKED,
      label: "Bloqué",
      icon: Ban,
      count: fileCountQuery.data?.BLOCKED_COUNT,
    },
  ];

  // Display error state
  if (error) {
    return (
      <div className="w-full animate-fade-in">
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
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <Form methods={methods}>
          <ControlledInput
            placeholder="Recherche..."
            name="search"
            startAdornment={<Search className="h-4 w-4 text-gray-400" />}
          />
        </Form>

        {/* Main Card */}
        <div className="overflow-hidden border-0">
          <SegmentedTabs
            tabs={statusTabs.map((tab) => ({
              name: tab.label,
              value: tab.id,
              icon: tab.icon,
              badgeCount: tab.count, // Assuming count is available for all tabs for now
              badgeClassName:
                tab.id === "mail"
                  ? "bg-formality-primary text-white"
                  : tab.id === "urgent"
                  ? "bg-red-500 text-white"
                  : tab.id === "bloque"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-500 text-white",
              component:
                tab.id === "mail" ? (
                  <MailTab
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    showArchives={showArchives}
                    setShowArchives={setShowArchives}
                    isEmailsLoading={isLoading}
                    paginatedEmails={emailsData?.data}
                    selectedEmailId={selectedEmailId}
                    handleEmailClick={handleEmailClick}
                    selectedEmail={selectedEmail}
                    clientsData={clientsData?.data}
                    provisionsData={provisionsData}
                    legalFormsData={legalFormsData}
                    filesData={filesQuery.data?.data}
                  />
                ) : (
                  <DataTable
                    data={filesQuery.data?.data || []}
                    columns={dossierColumns}
                    loading={filesQuery.isLoading}
                    count={filesQuery.data?.count || 0}
                    page={page}
                    perPage={perPage}
                    onPageChange={setPage}
                    onPerPageChange={setPerPage}
                    onRowClick={(row) => handleDossierClick(row._id)}
                  />
                ),
            }))}
            value={activeTab}
            onValueChange={(v) => {
              console.log("v", v);
              setActiveTab(v);
              setPage(1);
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Dossiers;
