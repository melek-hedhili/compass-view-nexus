
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import AppLayout from "../../../components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, Plus, MailIcon, Paperclip } from "lucide-react";
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

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch emails using TanStack Query
  const emailQueries = useQueries({
    queries: [
      {
        queryKey: ["emails", "inbox", searchTerm],
        queryFn: () =>
          EmailService.emailControllerFindAll({
            value: searchTerm,
            searchFields: ["client.clientName", "from", "subject"],
          }),
      },
      {
        queryKey: ["emails", "archived", searchTerm],
        queryFn: () =>
          EmailService.emailControllerFindAllArchived({
            value: searchTerm,
            searchFields: ["client.clientName", "from", "subject"],
          }),
      },
      {
        queryKey: ["emails", "sent", searchTerm],
        queryFn: () =>
          EmailService.emailControllerFindAllSent({
            value: searchTerm,
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

  // Find the selected mail based on the active tab
  const selectedMailData = useMemo(() => {
    if (!selectedMail) return null;

    switch (activeTab) {
      case "boite-mail":
        return inboxData?.data.find((mail) => mail._id === selectedMail);
      case "archives":
        return archivedData?.data.find((mail) => mail._id === selectedMail);
      case "envoye":
        return sentData?.data.find((mail) => mail._id === selectedMail);
      default:
        return null;
    }
  }, [selectedMail, activeTab, inboxData, archivedData, sentData]);

  // Get current loading and error states
  const isLoading =
    isInboxLoading ||
    (activeTab === "archives" && isArchivedLoading) ||
    (activeTab === "envoye" && isSentLoading);
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
      await archiveMutation.mutateAsync(selectedMailData._id);
    }
  };

  // Handle unarchiving an email
  const handleUnarchive = async () => {
    if (selectedMailData) {
      await archiveMutation.mutateAsync(selectedMailData._id);
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
    setSearchTerm(value);
  };

  const handleSelectMail = (mailId: string) => {
    setSelectedMail(mailId);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMail(null);
  };

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
        (activeTab === "envoye" ? (row.to as string) : (row.from as string)) as ReactNode,
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

  // Display loading state
  if (isLoading) {
    return (
      <AppLayout>
        <div className="w-full px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-formality-primary"></div>
              <p className="text-gray-600">Chargement des emails...</p>
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
        <div className="w-full px-4 sm:px-6 lg:px-8 animate-fade-in">
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
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <MailIcon className="h-6 w-6 mr-2 text-formality-primary" />
            <h1 className="text-2xl font-bold text-formality-accent">
              Boîte mail
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Recherche..."
                className="pl-10 border-gray-200"
                value={searchTerm}
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

        <Card className="w-full overflow-hidden border-0 shadow-lg">
          <Tabs
            defaultValue="boite-mail"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <TabsList className="bg-transparent p-0 h-auto w-full rounded-none">
                <TabsTrigger
                  value="boite-mail"
                  className="py-4 px-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
                >
                  <MailIcon className="h-4 w-4" />
                  Boîte de réception
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-formality-primary text-xs font-medium text-white px-1.5">
                    {inboxData?.data?.length || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="envoye"
                  className="py-4 px-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
                >
                  <Search className="h-4 w-4" />
                  Envoyés
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white px-1.5">
                    {sentData?.data?.length || 0}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="archives"
                  className="py-4 px-6 rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-formality-primary data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
                >
                  <Paperclip className="h-4 w-4" />
                  Archives
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-500 text-xs font-medium text-white px-1.5">
                    {archivedData?.data?.length || 0}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Inbox Tab Content */}
            <TabsContent value="boite-mail" className="mt-0 p-6">
              <DataTable
                data={inboxData?.data || []}
                count={inboxData?.count}
                columns={columns}
                loading={isInboxLoading}
                onRowClick={(row) => handleSelectMail(row._id as string)}
                className="bg-white rounded-lg border"
                renderListEmpty={() => (
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MailIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="font-medium">Aucun mail trouvé</p>
                      <p className="text-sm text-gray-400">La boîte de réception est vide</p>
                    </div>
                  </div>
                )}
              />
            </TabsContent>

            {/* Sent Tab Content */}
            <TabsContent value="envoye" className="mt-0 p-6">
              <DataTable
                data={sentData?.data || []}
                count={sentData?.count}
                columns={columns}
                loading={isSentLoading}
                onRowClick={(row) => handleSelectMail(row._id as string)}
                className="bg-white rounded-lg border"
                renderListEmpty={() => (
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="font-medium">Aucun mail envoyé</p>
                      <p className="text-sm text-gray-400">Vous n'avez envoyé aucun email</p>
                    </div>
                  </div>
                )}
              />
            </TabsContent>

            {/* Archives Tab Content */}
            <TabsContent value="archives" className="mt-0 p-6">
              <DataTable
                data={archivedData?.data || []}
                count={archivedData?.count}
                columns={columns}
                loading={isArchivedLoading}
                onRowClick={(row) => handleSelectMail(row._id as string)}
                className="bg-white rounded-lg border"
                renderListEmpty={() => (
                  <div className="h-32 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Paperclip className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="font-medium">Aucun mail archivé</p>
                      <p className="text-sm text-gray-400">Les archives sont vides</p>
                    </div>
                  </div>
                )}
              />
            </TabsContent>
          </Tabs>

          {/* Mail Detail Drawer */}
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetContent
              side="right"
              className="w-full sm:max-w-4xl overflow-y-auto lg:w-[900px]"
            >
              <div className="py-4">
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
              className="w-full sm:max-w-4xl overflow-y-auto lg:w-[900px]"
            >
              <div className="py-4">
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

          {/* New Message Modal */}
          {isNewMessageOpen && (
            <NewMessageModal onClose={handleCloseNewMessageModal} />
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default Mail;
