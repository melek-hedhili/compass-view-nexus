/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Paperclip } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query";
import { EmailService } from "@/api-swagger/services/EmailService";
import { EmailDto } from "@/api-swagger/models/EmailDto";

import NewMessageModal from "./NewMessageModal";
import ReplyModal from "./ReplyModal";
import MailDetail from "./MailDetail";
import { DataTable, Column } from "@/components/ui/data-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ReactNode } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// Extend EmailDto with additional properties we need
interface ExtendedEmailDto extends EmailDto {
  _id: string;
  status?: "non-lu" | "lu";
  attachments?: number;
}

const Mail = () => {
  const [selectedMail, setSelectedMail] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("boite-mail");
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<ExtendedEmailDto | null>(
    null
  );
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Consolidated pagination state
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
    searchTerm: "",
    sortField: "",
    sortOrder: "asc" as "asc" | "desc",
  });

  // Fetch emails using TanStack Query
  const emailQueries = useQueries({
    queries: [
      {
        queryKey: [
          "emails",
          "inbox",
          paginationParams.page,
          paginationParams.perPage,
          paginationParams.searchTerm,
        ],
        queryFn: () =>
          EmailService.emailControllerFindAll({
            page: paginationParams.page.toString(),
            perPage: paginationParams.perPage.toString(),
            searchValue: paginationParams.searchTerm,
            searchFields: ["client.clientName", "from", "subject"],
          }),
      },
      {
        queryKey: [
          "emails",
          "archived",
          paginationParams.page,
          paginationParams.perPage,
          paginationParams.searchTerm,
        ],
        queryFn: () =>
          EmailService.emailControllerFindAllArchived({
            page: paginationParams.page.toString(),
            perPage: paginationParams.perPage.toString(),
            searchValue: paginationParams.searchTerm,
            searchFields: ["client.clientName", "from", "subject"],
          }),
      },
      {
        queryKey: [
          "emails",
          "sent",
          paginationParams.page,
          paginationParams.perPage,
          paginationParams.searchTerm,
        ],
        queryFn: () =>
          EmailService.emailControllerFindAllSent({
            page: paginationParams.page.toString(),
            perPage: paginationParams.perPage.toString(),
            searchValue: paginationParams.searchTerm,
            searchFields: ["client.clientName", "to", "subject"],
          }),
      },
    ],
  });
  const [inboxQuery, archivedQuery, sentQuery] = emailQueries;

  const inboxData = inboxQuery.data;
  const isInboxLoading = inboxQuery.isLoading;
  const inboxError = inboxQuery.error;

  const archivedData = archivedQuery.data;
  const isArchivedLoading = archivedQuery.isLoading;
  const archivedError = archivedQuery.error;

  const sentData = sentQuery.data;
  const isSentLoading = sentQuery.isLoading;
  const sentError = sentQuery.error;

  // Counts for each tab (Inbox, Archived, Sent)
  const inboxCount = inboxData?.count || 0;
  const archivedCount = archivedData?.count || 0;
  const sentCount = sentData?.count || 0;

  // Find the selected mail based on the active tab
  const selectedMailData = useMemo(() => {
    if (!selectedMail) return null;

    switch (activeTab) {
      case "boite-mail":
        return inboxData?.data?.find((mail) => mail._id === selectedMail);
      case "archives":
        return archivedData?.data?.find((mail) => mail._id === selectedMail);
      case "envoye":
        return sentData?.data?.find((mail) => mail._id === selectedMail);
      default:
        return null;
    }
  }, [selectedMail, activeTab, inboxData, archivedData, sentData]);

  const error =
    inboxError ||
    (activeTab === "archives" && archivedError) ||
    (activeTab === "envoye" && sentError);

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: (id: string) => EmailService.emailControllerArchive({ id }),
    onSuccess: () => {
      setSelectedMail(null);
      toast({
        title: "Archivé",
        description: "Le mail a été archivé avec succès.",
      });
      //close drawer
      setIsDrawerOpen(false);
      // Invalidate and refetch the relevant queries
      queryClient.invalidateQueries({ queryKey: ["emails", "inbox"] });
      queryClient.invalidateQueries({ queryKey: ["emails", "archived"] });
    },
    onError: (error) => {
      console.error("Error archiving email:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'archivage du mail. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  // Handle archiving an email
  const handleArchive = async () => {
    if (selectedMailData) {
      await archiveMutation.mutateAsync(selectedMailData._id as string);
    }
  };

  // Handle unarchiving an email
  const handleUnarchive = async () => {
    if (selectedMailData) {
      await archiveMutation.mutateAsync(selectedMailData._id as string);
    }
  };

  // Handle opening reply modal
  const handleReply = () => {
    if (selectedMailData) {
      setReplyToEmail(selectedMailData as unknown as ExtendedEmailDto);
      setIsReplyOpen(true);
    }
  };

  // Handle closing the new message modal
  const handleCloseNewMessageModal = () => {
    setIsNewMessageOpen(false);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setPaginationParams((prev) => ({
      ...prev,
      searchTerm: value,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleSelectMail = (mailId: string) => {
    setSelectedMail(mailId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMail(null);
  };

  const handlePageChange = (newPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      perPage: newPerPage,
      page: 1, // Reset to first page when changing items per page
    }));
  };

  const handleSort = (field: string, order: "asc" | "desc") => {
    setPaginationParams((prev) => ({
      ...prev,
      sortField: field,
      sortOrder: order,
    }));
  };

  // Sort data based on current sort field and order
  const sortData = (data: EmailDto[] | undefined) => {
    if (!data || !paginationParams.sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[paginationParams.sortField as keyof EmailDto];
      const bValue = b[paginationParams.sortField as keyof EmailDto];

      if (aValue === undefined || bValue === undefined) return 0;

      const comparison = String(aValue).localeCompare(String(bValue));
      return paginationParams.sortOrder === "asc" ? comparison : -comparison;
    });
  };

  // Get sorted data for each tab
  const sortedInboxData = sortData(inboxData?.data);
  const sortedArchivedData = sortData(archivedData?.data);
  const sortedSentData = sortData(sentData?.data);

  // Define columns variable with the correct type
  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "status",
      header: "Statut",
      render: (value: unknown, row: Record<string, unknown>) =>
        (
          <div className="flex justify-center">
            <div
              className={`w-3 h-3 rounded-full mx-auto ${
                row.status === "non-lu" ? "bg-formality-primary" : "bg-gray-300"
              }`}
            ></div>
          </div>
        ) as ReactNode,
      className: "w-16 text-center font-medium",
    },
    {
      key: "clientName",
      header: "Nom du Client",
      render: (_: unknown, row: Record<string, unknown>) =>
        ((row.client as { clientName: string })?.clientName ||
          "N/A") as ReactNode,
      className: "text-left font-medium",
    },
    {
      key: "from",
      header: activeTab === "envoye" ? "Destinataire" : "Expéditeur",
      render: (_: unknown, row: Record<string, unknown>) =>
        (activeTab === "envoye"
          ? (row.to as string)
          : (row.from as string)) as ReactNode,
      className: "text-left font-medium",
    },
    {
      key: "subject",
      header: "Sujet",
      className: "text-left font-medium",
    },

    {
      key: "date",
      header: "Date/H",
      render: (value: unknown, row: Record<string, unknown>) =>
        (
          <div className="text-sm text-gray-500">
            {format(new Date(row.date as string), "dd/MM/yyyy HH:mm", {
              locale: fr,
            })}
          </div>
        ) as ReactNode,
      className: "text-left font-medium w-32",
    },
    {
      key: "attachments",
      header: "PJ",
      render: (value: unknown, row) =>
        (row.attachments && (row.attachments as number) > 0 ? (
          <div className="flex items-center justify-center gap-1 text-xs font-medium bg-gray-100 rounded-md px-1.5 py-0.5">
            <Paperclip className="h-3 w-3" />
            {row.attachments as number}
          </div>
        ) : null) as ReactNode,
      className: "w-16 text-center font-medium",
    },
  ];

  // Display error state
  if (error) {
    return (
      <div className="w-full animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <p className="text-red-600">
              Une erreur est survenue lors du chargement des emails.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["emails"] })
              }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex-1" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Recherche..."
              className="pl-10 border-gray-200"
              value={paginationParams.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button
            className="bg-formality-primary hover:bg-formality-primary/90 text-white flex items-center gap-2"
            onClick={() => setIsNewMessageOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Nouveau message</span>
          </Button>
        </div>
      </div>

      {/* Segmented Tabs with counts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="flex gap-2 rounded-lg bg-gray-100 p-1 w-full md:w-auto">
          <TabsTrigger
            value="boite-mail"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-formality-primary rounded-lg font-semibold transition-colors"
          >
            Boîte de réception
            <Badge variant="secondary" className="ml-2 px-2">
              {inboxCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="archives"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-formality-primary rounded-lg font-semibold transition-colors"
          >
            Archivé
            <Badge variant="secondary" className="ml-2 px-2">
              {archivedCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="envoye"
            className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-formality-primary rounded-lg font-semibold transition-colors"
          >
            Envoyé
            <Badge variant="secondary" className="ml-2 px-2">
              {sentCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="boite-mail"
          className="focus-visible:outline-none mt-4"
        >
          <div className="card-elegant w-full">
            <DataTable
              data={sortedInboxData || []}
              count={inboxData?.count}
              columns={columns}
              loading={isInboxLoading}
              onRowClick={(row) => handleSelectMail(row._id as string)}
              page={paginationParams.page}
              perPage={paginationParams.perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              sortField={paginationParams.sortField}
              sortOrder={paginationParams.sortOrder}
              onSort={handleSort}
              renderListEmpty={() => (
                <div className="h-24 text-center text-gray-500 flex items-center justify-center">
                  Aucun mail trouvé
                </div>
              )}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="archives"
          className="focus-visible:outline-none mt-4"
        >
          <div className="card-elegant w-full">
            <DataTable
              data={sortedArchivedData || []}
              count={archivedData?.count}
              columns={columns}
              loading={isArchivedLoading}
              onRowClick={(row) => handleSelectMail(row._id as string)}
              page={paginationParams.page}
              perPage={paginationParams.perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              sortField={paginationParams.sortField}
              sortOrder={paginationParams.sortOrder}
              onSort={handleSort}
              renderListEmpty={() => (
                <div className="h-24 text-center text-gray-500 flex items-center justify-center">
                  Aucun mail archivé trouvé
                </div>
              )}
            />
          </div>
        </TabsContent>
        <TabsContent value="envoye" className="focus-visible:outline-none mt-4">
          <div className="card-elegant w-full">
            <DataTable
              data={sortedSentData || []}
              count={sentData?.count}
              columns={columns}
              loading={isSentLoading}
              onRowClick={(row) => handleSelectMail(row._id as string)}
              page={paginationParams.page}
              perPage={paginationParams.perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              sortField={paginationParams.sortField}
              sortOrder={paginationParams.sortOrder}
              onSort={handleSort}
              renderListEmpty={() => (
                <div className="h-24 text-center text-gray-500 flex items-center justify-center">
                  Aucun mail envoyé trouvé
                </div>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Mail Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl lg:w-[900px] h-full max-h-screen p-0"
          style={{ overflow: "auto" }}
        >
          {/* Make whole drawer scrollable, not just form: remove internal py/padding that creates fixed height */}
          <div className="h-full">
            <MailDetail
              mail={selectedMailData}
              onClose={handleCloseDrawer}
              onReply={handleReply}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
              isArchiving={archiveMutation.isPending}
              activeTab={activeTab}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Reply Drawer */}
      <Sheet open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-4xl lg:w-[900px] h-full max-h-screen p-0"
          style={{ overflow: "auto" }}
        >
          <div className="h-full">
            {replyToEmail && (
              <ReplyModal
                onClose={() => {
                  setIsReplyOpen(false);
                  setReplyToEmail(null);
                }}
                originalEmail={replyToEmail}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* New Message Sheet Drawer */}
      <Sheet open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl lg:w-[600px] h-full max-h-screen p-0"
          style={{
            overflow: "auto",
            boxShadow: "0 8px 40px 0 rgba(0,0,0,.10)",
          }}
        >
          <div className="h-full">
            <NewMessageModal onClose={() => setIsNewMessageOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Mail;
