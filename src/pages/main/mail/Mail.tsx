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
import MailHeader from "./components/MailHeader";
import MailTabs from "./components/MailTabs";
import { ExtendedEmailDto } from "./utils";

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
            value: paginationParams.searchTerm,
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
            value: paginationParams.searchTerm,
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
            value: paginationParams.searchTerm,
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

  return (
    <AppLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 animate-fade-in">
        {/* Move header to separate component */}
        <MailHeader
          searchValue={paginationParams.searchTerm}
          onSearch={handleSearch}
          onNewMessage={() => setIsNewMessageOpen(true)}
        />
        {/* Move all tab/content logic to MailTabs */}
        <MailTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          inboxData={inboxData}
          archivedData={archivedData}
          sentData={sentData}
          isLoading={isLoading}
          error={error}
          selectedMail={selectedMail}
          onSelectMail={handleSelectMail}
          isDrawerOpen={isDrawerOpen}
          onDrawerOpenChange={setIsDrawerOpen}
          selectedMailData={selectedMailData as ExtendedEmailDto | null}
          onCloseDrawer={handleCloseDrawer}
          onReply={handleReply}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
          isArchiving={archiveMutation.isPending}
          handlePageChange={handlePageChange}
          handlePerPageChange={handlePerPageChange}
          handleSort={handleSort}
          paginationParams={paginationParams}
          replyToEmail={replyToEmail}
          isReplyOpen={isReplyOpen}
          setIsReplyOpen={setIsReplyOpen}
          setReplyToEmail={setReplyToEmail}
          isNewMessageOpen={isNewMessageOpen}
          onCloseNewMessageModal={handleCloseNewMessageModal}
        />
      </div>
    </AppLayout>
  );
};

export default Mail;
