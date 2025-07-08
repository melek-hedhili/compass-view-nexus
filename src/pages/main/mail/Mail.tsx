import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Archive, Inbox, Plus, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { type TabKey } from "./mail.types";
import { type EmailDto } from "@/api-swagger/models/EmailDto";
import NewMessageModal from "./NewMessageModal";
import InboxMail from "./InboxMail";
import ArchivedMail from "./ArchivedMail";
import SentMail from "./SentMail";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClientService, EmailService } from "@/api-swagger";
import { useToast } from "@/hooks/use-toast";
import ReplyModal from "./ReplyModal";
import MailDetail from "./MailDetail";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SegmentedTabs from "@/components/ui/segmented-tabs";

// Extend EmailDto with additional properties we need

const Mail = () => {
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState<EmailDto | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const tabKey = (location.pathname.split("/").pop() ?? "inbox") as TabKey;
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<EmailDto | null>(null);

  const handleCloseNewMessageModal = () => {
    setIsNewMessageOpen(false);
  };
  const { data: counts } = useQuery({
    queryKey: ["emails", "counts"],
    queryFn: () => EmailService.emailControllerGetEmailCount(),
  });
  const { data: clientsEmails } = useQuery({
    queryKey: ["clients"],
    queryFn: () => ClientService.clientControllerFindAll({}),
    select: (data) => data.data.map((client) => client.email),
  });
  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: (id: string) => EmailService.emailControllerArchive({ id }),
    onSuccess: async () => {
      console.log("invalidating");
      // Invalidate all queries that start with ["emails", "inbox"] or ["emails", "archived"]
      await queryClient.invalidateQueries({
        queryKey: ["emails", "inbox"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["emails", "archived"],
      });
      // Also invalidate the counts query
      await queryClient.invalidateQueries({
        queryKey: ["emails", "counts"],
      });

      setSelectedMail(null);
      toast({
        title: "Archivé",
        description: "Le mail a été archivé avec succès.",
      });
      //close drawer
      setIsDrawerOpen(false);
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
    if (selectedMail) {
      await archiveMutation.mutateAsync(selectedMail._id);
    }
  };

  // Handle unarchiving an email
  const handleUnarchive = async () => {
    if (selectedMail) {
      await archiveMutation.mutateAsync(selectedMail._id);
    }
  };

  // Handle opening reply modal
  const handleReply = () => {
    if (selectedMail) {
      setReplyToEmail(selectedMail);
      setIsReplyOpen(true);
    }
  };

  const handleRowClick = (email: EmailDto) => {
    setSelectedMail(email);
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex-1" />
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
      <SegmentedTabs
        tabs={[
          {
            name: "Boîte de réception",

            value: "inbox",
            icon: Inbox,
            badge: (
              <Badge variant="secondary" className="ml-2 px-2">
                {counts?.receivedCount}
              </Badge>
            ),
            component: <InboxMail onRowClick={handleRowClick} />,
          },
          {
            name: "Archivé",
            value: "archived",
            icon: Archive,
            badge: (
              <Badge variant="secondary" className="ml-2 px-2">
                {counts?.archivedCount}
              </Badge>
            ),
            component: <ArchivedMail onRowClick={handleRowClick} />,
          },
          {
            name: "Envoyé",
            value: "sent",
            icon: Send,
            badge: (
              <Badge variant="secondary" className="ml-2 px-2">
                {counts?.sentCount}
              </Badge>
            ),
            component: <SentMail onRowClick={handleRowClick} />,
          },
        ]}
        value={tabKey}
        onValueChange={(v) => navigate(`/dashboard/mail/${v}`)}
      />

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={isNewMessageOpen}
        onClose={handleCloseNewMessageModal}
        clientsEmails={clientsEmails}
      />

      {replyToEmail && (
        <ReplyModal
          isOpen={isReplyOpen}
          onClose={() => {
            setIsReplyOpen(false);
            setReplyToEmail(null);
          }}
          originalEmail={replyToEmail}
        />
      )}
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
              mail={selectedMail}
              onClose={() => setSelectedMail(null)}
              onReply={handleReply}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
              isArchiving={archiveMutation.isPending}
              activeTab={tabKey}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Mail;
